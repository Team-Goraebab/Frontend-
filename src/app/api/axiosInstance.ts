import axios from 'axios';

export const createDockerClient = () => {
  const isWindows = process.platform === 'win32';
  const options = isWindows
    ? { baseURL: `${process.env.DOCKER_URL || 'http://localhost:2375'}` }
    : { baseURL: 'http://localhost', socketPath: '/var/run/docker.sock' };

  return axios.create(options);
};
