import axios from 'axios';

export const fetchData = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data; // 항상 response.data만 반환
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null; // 에러가 발생하면 null 반환
  }
};
