import {
  BASE_URL,
  REMOTE_DEAMONS,
  REMOTE_DEAMON_CONNECT,
} from '@/app/api/urlPath';
import axios from 'axios';

interface RemoteDaemon {
  host: string;
  port: number;
  name: string;
}

// Remote daemons 조회
export const getRemoteDaemons = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${REMOTE_DEAMONS}`, {
      params: {},
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remote daemon 연결
export const connectRemoteDaemon = async (RemoteDaemonData: RemoteDaemon) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${REMOTE_DEAMON_CONNECT}`,
      RemoteDaemonData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Remote daemon 삭제
export const deleteRemoteDaemon = async (daemonId: string) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}${REMOTE_DEAMONS}/${daemonId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
