'use client';

import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { FaTimesCircle } from 'react-icons/fa';
import { Container } from '@/types/type';
import ImageStartOptionModal from '@/components/modal/image/imageStartOptionModal';
import { showSnackbar } from '@/utils/toastUtils';
import { enqueueSnackbar } from 'notistack';

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
  onDropContainer?: (container: Container) => void;
}

interface ContainerConfig {
  name: string;
  image: string;
  network?: string;
  ports?: { [key: string]: string };
  volumes?: { hostPath?: string; containerPath?: string };
  env?: Array<{ variable: string; value: string }>;
  hostId?: string;
}

const CardContainer = ({
                         networkName,
                         networkIp,
                         containers,
                         themeColor,
                         onDelete,
                         onSelectNetwork,
                         isSelected,
                         onDropContainer,
                       }: CardContainerProps) => {
  const [droppedContainers, setDroppedContainers] = useState<Container[]>([]); // 드롭된 컨테이너 상태
  const [selectedImage, setSelectedImage] = useState<string>(''); // 선택된 이미지 이름
  const [selectedNetworkIp, setSelectedNetworkIp] = useState<string>(''); // 선택된 네트워크 IP (드롭 시 사용)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 상태
  const [draggedItem, setDraggedItem] = useState<Container | null>(null); // 현재 드래그된 아이템 상태

  const ref = useRef<HTMLDivElement>(null); // ref 생성

  // 드롭 훅 설정
  const [{ isOver }, drop] = useDrop({
    accept: 'IMAGE_CARD',
    drop: (item: any) => {
      if (onDropContainer) {
        onDropContainer(item);
      }
      setIsModalOpen(true);
      setSelectedImage(item.image);
      setSelectedNetworkIp(networkIp);
      setDraggedItem(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  // 모달 닫기 핸들러 (취소 시 드롭된 항목 취소)
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage('');
    setDraggedItem(null); // 드래그된 아이템을 초기화하여 취소
  };

  const handleRunContainer = async (containerConfig: ContainerConfig) => {
    try {
      const response = await fetch('/api/image/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(containerConfig),
      });

      if (!response.ok) {
        throw new Error('Failed to run container');
      }

      // API 성공적으로 실행되었을 때만 드래그된 이미지를 컨테이너로 변환하여 drop
      if (draggedItem) {
        const newContainer = { ...draggedItem, name: containerConfig.name };
        setDroppedContainers((prev) => [...prev, newContainer]);
        setDraggedItem(null);
      }

      setIsModalOpen(false);
      setSelectedImage('');

      showSnackbar(
        enqueueSnackbar,
        '컨테이너가 성공적으로 실행되었습니다.',
        'success',
        '#25BD6B',
      );
    } catch (error) {
      console.error('Error running container:', error);
      showSnackbar(
        enqueueSnackbar,
        '컨테이너 실행에 실패했습니다.',
        'error',
        '#FF0000',
      );
    }
  };

  return (
    <div
      ref={ref}
      className={`relative flex flex-col items-center p-[10px] border bg-white rounded-lg shadow-lg w-[450px] transition-colors duration-200 cursor-pointer ${isOver ? 'bg-gray-100' : ''}`}
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

      {droppedContainers.length > 0 || containers.length > 0 ? (
        <div className="w-full h-36 scrollbar-hide overflow-y-auto">
          {(containers.concat(droppedContainers)).map((container, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 mb-2 border rounded-md bg-gray-50 hover:bg-gray-200 transition-colors duration-200"
            >
              <span>{container.name}</span>
              <span className="text-sm">
                {container.image.name}
              </span>
              <div className="flex items-center space-x-4">
                <span>{container.ip}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setDroppedContainers((prev) => prev.filter((_, i) => i !== index))}
                >
                  <FaTimesCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-36 text-center text-gray-500 p-4">
          No Images Available
        </div>
      )}

      {isModalOpen && (
        <ImageStartOptionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          imageName={selectedImage}
          DNDNetworkIp={selectedNetworkIp} // 드래그된 항목의 IP를 전달
          onRun={handleRunContainer}
        />
      )}
    </div>
  );
};

export default CardContainer;
