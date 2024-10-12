import { Container } from '@/types/type';
import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';

export interface CardContainerProps {
  networkName: string;
  networkIp: string;
  containers: Container[];
  themeColor: {
    label: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  };
  onDelete?: () => void;
  onSelectNetwork?: () => void;
  isSelected?: boolean;
}

/**
 *
 * @param networkName 네트워크 이름
 * @param networkIp 네트워크 ip 주소
 * @param containers 컨테이너 목록
 * @param themeColor 테마 색상
 * @param onDelete 네트워크 삭제 시 호출되는 함수
 * @param onSelectNetwork 네트워크 선택 시 호출되는 함수
 * @param isSelected 선택된 상태
 * @returns
 */
const CardContainer = ({
  networkName,
  networkIp,
  containers,
  themeColor,
  onDelete,
  onSelectNetwork,
  isSelected,
}: CardContainerProps) => {
  const handleNetworkClick = () => {
    if (onSelectNetwork) {
      onSelectNetwork();
    }
  };

  return (
    <div
      className="relative flex flex-col items-center p-[10px] border bg-white rounded-lg shadow-lg w-[450px] transition-colors duration-200 cursor-pointer"
      onClick={handleNetworkClick}
      style={{
        borderColor: isSelected ? themeColor.textColor : '',
        backgroundColor: isSelected ? '#F4F4F4' : 'white',
      }}
    >
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="absolute top-2 right-2 hover:text-gray-500 transition-colors duration-200 hover:scale-105"
        >
          <FaTimesCircle
            className="w-5 h-5"
            style={{ color: themeColor.borderColor }}
          />
        </button>
      )}

      <div
        className="w-full text-center text-blue_6 border-2 p-2 rounded-md mb-3 text-sm font-semibold"
        style={{
          borderColor: `${themeColor.borderColor}`,
          backgroundColor: `${themeColor.bgColor}`,
          color: `${themeColor.textColor}`,
        }}
      >
        {`${networkName} : ${networkIp}`}
      </div>
      {containers.length > 0 ? (
        <div className="w-full h-36 scrollbar-hide overflow-y-auto">
          {containers.map((container, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 mb-2 border rounded-md bg-gray-50 hover:bg-gray-200 transition-colors duration-200"
            >
              <span>{container.name}</span>
              <span
                className="text-sm text-transparent"
                style={{ fontSize: 0.1 }}
              >
                {container.image.name}:{container.tag}
              </span>
              {container.volume?.map((volume, index) => (
                <span key={index}>
                  <p className="text-transparent" style={{ fontSize: 0.1 }}>
                    {volume.name}
                  </p>
                </span>
              ))}
              <div className="flex items-center space-x-4">
                <span>{container.ip}</span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      container.active === 'running'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm">
                    {container.active === 'running' ? 'Running' : 'Stopped'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-36 text-center text-gray-500 p-4">
          No Images Available
        </div>
      )}
    </div>
  );
};

export default CardContainer;
