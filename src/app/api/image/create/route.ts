import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../axiosInstance';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  const dockerClient = createDockerClient();
  const formData = await req.formData();
  const method = formData.get('method') as string;
  const imageName = formData.get('imageName') as string;
  const tag = formData.get('tag') as string || 'latest';

  if (!method || !imageName) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    let response;

    if (method === 'local') {
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file provided for local build' }, { status: 400 });
      }

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const readable = Readable.from(fileBuffer);

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
