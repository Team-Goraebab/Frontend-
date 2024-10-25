import {
  BASE_URL,
  REMOTE_STORAGES,
  REMOTE_STORAGE_CONNECT,
  REMOTE_STORAGE,
  REMOTE_DEAMONS,
} from '@/app/api/urlPath';
import axios from 'axios';

interface RemoteDatabase {
  host: string;
  port: number;
  dbms: string;
  name: string;
  username: string;
  password: string;
}

// Remote storage 목록 조회
export const getRemoteDatabase = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${REMOTE_STORAGES}`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remote storage 연결
export const connectRemoteDatabase = async (
  RemoteDatabaseData: RemoteDatabase
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${REMOTE_STORAGE_CONNECT}`,
      RemoteDatabaseData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Remote storage 복사
export const copyRemoteDatabase = async (storageId: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${REMOTE_STORAGE}/${storageId}/copy`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Remote storage 삭제
export const deleteRemoteDatabase = async (storageId: string) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}${REMOTE_DEAMONS}/${storageId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
