import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../\baxiosInstance';

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const dockerClient = createDockerClient(); // 공통 클라이언트 사용

  try {
    const response = await dockerClient.post('/images/create', null, {
      params: {
        fromImage: bodyData.fromImage,
        tag: bodyData.tag || 'latest',
      },
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error creating image:', error);

    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
