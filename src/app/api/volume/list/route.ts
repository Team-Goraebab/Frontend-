import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../\baxiosInstance';

export async function GET(req: NextRequest) {
  const dockerClient = createDockerClient();

  try {
    const response = await dockerClient.get('/volumes');
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching volumes:', error);

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
