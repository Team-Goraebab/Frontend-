import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../axiosInstance';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Missing image name' }, { status: 400 });
  }

  const dockerClient = createDockerClient();

  try {
    const response = await dockerClient.get(`/images/${name}/json`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching image detail:', error);

    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get image detail' },
      { status: 500 }
    );
  }
}
