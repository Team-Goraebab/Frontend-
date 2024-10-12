import { NextRequest, NextResponse } from 'next/server';
import { createDockerClient } from '../../axiosInstance';

interface ContainerConfig {
  name: string;
  image: string;
  network?: string;
  volumes?: string;
  ports?: string;
  env?: string;
}

export async function POST(req: NextRequest) {
  const bodyData: ContainerConfig = await req.json();
  const dockerClient = createDockerClient();
  console.log(bodyData);

  try {
    const createResponse = await dockerClient.post(
      `/containers/create?name=${bodyData.name}`,
      {
        Image: bodyData.image,
        HostConfig: {
          NetworkMode: bodyData.network || 'bridge',
          Mounts: bodyData.volumes?.split(',')
            .map((vol) => {
              const [source, target] = vol.split(':').map(part => part.trim());
              if (source && target) {
                return {
                  Target: target,
                  Source: source,
                  Type: 'volume',
                };
              }
              return null;
            })
            .filter((mount): mount is NonNullable<typeof mount> => mount !== null),
          PortBindings: bodyData.ports?.split(',').reduce<Record<string, Array<{ HostPort: string }>>>((acc, port) => {
            const [hostPort, containerPort] = port.split(':');
            acc[`${containerPort}/tcp`] = [{ HostPort: hostPort }];
            return acc;
          }, {}),
        },
        ExposedPorts: bodyData.ports?.split(',').reduce<Record<string, {}>>((acc, port) => {
          const containerPort = port.split(':')[1];
          acc[`${containerPort}/tcp`] = {};
          return acc;
        }, {}),
        Env: bodyData.env?.split(',').filter(envVar => envVar.includes('=')).map(envVar => {
          const [key, ...values] = envVar.split('=');
          return `${key.trim()}=${values.join('=').trim()}`;
        }),
      }
    );

    const containerId = createResponse.data.Id;

    await dockerClient.post(`/containers/${containerId}/start`);

    return NextResponse.json({
      message: 'Container created and started successfully',
      containerId: containerId
    }, { status: 200 });

  } catch (error) {
    console.error('Error running container:', error);

    if (error instanceof Error && 'response' in error) {
      return NextResponse.json(
        { error: (error as any).response.data.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to run container' },
      { status: 500 }
    );
  }
}
