import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../axiosInstance';

export async function DELETE(req: NextRequest) {
  const { id } = await req.json(); // 삭제할 컨테이너 ID
  const dockerClient = createDockerClient();

  try {
    const response = await dockerClient.delete(`/containers/${id}?force=true`);
    return NextResponse.json(
      { message: 'Container deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting container:', error);

    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete container' },
      { status: 500 }
    );
  }
}
