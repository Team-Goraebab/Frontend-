import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../\baxiosInstance';

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const dockerClient = createDockerClient();

  try {
    const response = await dockerClient.post('/networks/create', bodyData);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error creating network:', error);

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
