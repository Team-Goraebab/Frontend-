import { BASE_URL, BLUEPRINTS } from '@/app/api/urlPath';
import axios from 'axios';

// Blueprint 전체 조회
export const getBlueprintList = async (storageId?: string) => {
  try {
    const response = await axios.get(`${BASE_URL}${BLUEPRINTS}`, {
      params: storageId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Blueprint 상세 조회
export const getBlueprintDetail = async (
  blueprintId: string,
  storageId?: string
) => {
  try {
    const response = await axios.get(`${BASE_URL}${BLUEPRINTS}/detail`, {
      params: { blueprintId, storageId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Blueprint 생성
export const createBlueprint = async (blueprintData: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}${BLUEPRINTS}`,
      blueprintData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Blueprint 수정
export const patchBlueprint = async (
  blueprintId: string,
  blueprintData: any,
  storageId?: string
) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}${BLUEPRINTS}/${blueprintId}`,
      blueprintData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Blueprint 삭제
export const deleteBlueprint = async (
  blueprintId: string,
  storageId?: string
) => {
  try {
    const url = storageId
      ? `${BASE_URL}${BLUEPRINTS}/${storageId}/${blueprintId}`
      : `${BASE_URL}${BLUEPRINTS}/${blueprintId}`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};
