/**
 *
 * @param status card의 상태 값
 * @returns status에 따른 색상을 반환
 */
export const getStatusColors = (status: string) => {
  switch (status) {
    case 'running':
      return { bg1: '#E0F7E9', bg2: '#4CAF50' }; // 녹색
    case 'paused':
      return { bg1: '#f6e3d1', bg2: '#FFA048' }; // 파랑
    case 'exited':
      return { bg1: '#F4F4F4', bg2: '#7F7F7F' }; // 회색
    case 'dead':
      return { bg1: '#f6d4d6', bg2: '#FF4853' }; // 붉은색
    default:
      return { bg1: '#ccd9eb', bg2: '#254b7a' }; // 기본값
  }
};
