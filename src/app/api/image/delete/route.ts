import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../\baxiosInstance';

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const dockerClient = createDockerClient();

  try {
    const response = await dockerClient.delete(`/images/${id}`, {
      params: {
        force: true, // 강제 삭제 플래그
      },
    });
    return NextResponse.json(
      { message: 'Image deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting image:', error);

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
