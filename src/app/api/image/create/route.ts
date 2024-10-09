import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../axiosInstance';
import { Readable } from 'stream';
import { createGzip, createBrotliCompress } from 'node:zlib';
import tar from 'tar-stream';
import { extname } from 'path';

export async function POST(req: NextRequest) {
  const dockerClient = createDockerClient();
  const formData = await req.formData();
  const method = formData.get('method') as string;
  const imageName = formData.get('imageName') as string;
  const tag = formData.get('tag') as string || 'latest';

  if (!method || !imageName) {
    console.error('Missing required parameters:', { method, imageName });
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    let response;

    if (method === 'local') {
      const file = formData.get('file') as File | null;
      if (!file) {
        console.error('No file provided for local build');
        return NextResponse.json({ error: 'No file provided for local build' }, { status: 400 });
      }

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileExtension = extname(file.name).toLowerCase();

      // tar 파일 생성 및 압축 해제 형식에 따라 처리
      const pack = tar.pack();
      pack.entry({ name: 'Dockerfile' }, `
        FROM alpine:latest
        WORKDIR /app
        COPY ${file.name} /app/
        RUN tar -xf /app/${file.name} -C /app
      `);
      pack.entry({ name: file.name }, fileBuffer);
      pack.finalize();

      let readable: Readable;

      if (fileExtension === '.tar.gz' || fileExtension === '.tgz') {
        const gzip = createGzip();
        readable = Readable.from(pack).pipe(gzip);
      } else if (fileExtension === '.tar.bz2' || fileExtension === '.tbz2') {
        const brotli = createBrotliCompress();
        readable = Readable.from(pack).pipe(brotli);
      } else if (fileExtension === '.tar.xz') {
        // XZ 포맷은 별도의 처리가 필요합니다. 여기서는 원본을 그대로 사용하도록 처리
        readable = Readable.from(pack);
      } else if (fileExtension === '.tar') {
        readable = Readable.from(pack);
      } else {
        console.error('Unsupported file format:', fileExtension);
        return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
      }

      response = await dockerClient.post('/build', readable, {
        params: {
          t: `${imageName}:${tag}`,
        },
        headers: {
          'Content-Type': 'application/x-tar',
        },
      });
    } else if (method === 'pull') {
      response = await dockerClient.post('/images/create', null, {
        params: {
          fromImage: imageName,
          tag: tag,
        },
      });
    } else {
      console.error('Invalid method specified:', method);
      return NextResponse.json({ error: 'Invalid method specified' }, { status: 400 });
    }

    console.log(response.data);

    // Buffer로 변환하여 응답하기
    const responseData = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    return new NextResponse(responseData, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating/building image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
