import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../axiosInstance';

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const dockerClient = createDockerClient();
  console.log(bodyData);
  try {
    // 이름을 URL 파라미터로 전달
    const response = await dockerClient.post(
      `/containers/create?name=${bodyData.name}`,
      {
        Image: bodyData.image, // 사용할 이미지
        HostConfig: {
          NetworkMode: bodyData.network, // 네트워크 설정
          Mounts: bodyData.volumes?.map((vol: any) => ({
            Target: vol.Mountpoint, // 마운트 포인트 설정
            Source: vol.Name, // 소스 볼륨 이름
            Type: 'volume',
          })),
          PortBindings: {
            '80/tcp': [
              { HostPort: bodyData.ports?.split(',')[0]?.split(':')[0] },
            ],
            '443/tcp': [
              { HostPort: bodyData.ports?.split(',')[1]?.split(':')[0] },
            ],
          },
        },
        NetworkingConfig: {
          EndpointsConfig: {
            [bodyData.network]: {},
          },
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error creating container:', error);

    if (error instanceof Error && (error as any).response) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create container' },
      { status: 500 }
    );
  }
}
