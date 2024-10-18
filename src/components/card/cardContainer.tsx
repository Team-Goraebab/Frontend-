'use client';

import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { FaTimesCircle, FaInfoCircle, FaPencilAlt } from 'react-icons/fa';
import { Container, ThemeColor } from '@/types/type';
import ImageDetailModal from '@/components/modal/image/imageDetailModal';
import ContainerNameModal from '../modal/container/containerNameModal';

export interface CardContainerProps {
  networkName: string;
  networkIp: string;
  containers: Container[];
  themeColor: ThemeColor;
  onDelete?: () => void;
  onSelectNetwork?: () => void;
  isSelected?: boolean;
}

interface ImageInfo {
  name: string;
  tag: string;
}

const CardContainer = ({
  networkName,
  networkIp,
  containers,
  themeColor,
  onDelete,
  onSelectNetwork,
  isSelected,
}: CardContainerProps) => {
  const [droppedImages, setDroppedImages] = useState<ImageInfo[]>([]);
  const [detailData, setDetailData] = useState<any>(null);
  const [containerName, setContainerName] =
    useState<string>('no container name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const splitImageNameAndTag = (image: string): ImageInfo => {
    const [name, tag] = image.split(':');
    return { name, tag };
  };

  const fetchImageDetail = async (name: string) => {
    try {
      const data = await fetch(`/api/image/detail?name=${name}`).then((res) =>
        res.json()
      );
      if (!data) {
        throw new Error('Failed to fetch image detail');
      }
      return data;
    } catch (error) {
      console.error('Error fetching image detail:', error);
      throw error;
    }
  };

  const handleGetInfo = async (imageName: string) => {
    try {
      const imageDetail = await fetchImageDetail(imageName);
      setDetailData(imageDetail);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'IMAGE_CARD',
    drop: (item: { image: string }) => {
      const imageInfo = splitImageNameAndTag(item.image);
      setDroppedImages((prev) => [...prev, imageInfo]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  const handleDeleteImage = (index: number) => {
    setDroppedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const allImages = [
    ...containers.map((c) => splitImageNameAndTag(c.image.name)),
    ...droppedImages,
  ];

  // 컨테이너 이름 수정 모달 열기
  const handleOpenNameModal = () => {
    setIsNameModalOpen(true);
  };

  // 컨테이너 이름 저장
  const handleSaveName = (newName: string) => {
    setContainerName(newName);
    setIsNameModalOpen(false);
  };

  return (
    <>
      <div
        className={`absolute flex items-center text-xs font-semibold border-2 h-6 px-1 rounded-t-lg content-center`}
        style={{
          top: '-1.4rem',
          left: '1.25rem',
          zIndex: '10',
          borderColor: `${themeColor.borderColor}`,
          color: `${themeColor.textColor}`,
          backgroundColor: `${themeColor.bgColor}`,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenNameModal();
          }}
        >
          <FaPencilAlt
            className="w-3 h-3 mr-1"
            style={{ color: themeColor.borderColor }}
          />
        </button>
        {containerName}
      </div>

      <div
        ref={ref}
        className={`relative flex flex-col items-center p-[10px] border bg-white rounded-lg shadow-lg w-[450px] transition-colors duration-200 cursor-pointer ${
          isOver ? 'bg-grey_1' : ''
        }`}
        style={{
          borderColor: isSelected ? themeColor.textColor : '',
          borderWidth: isSelected ? '2px' : '',
        }}
        onClick={onSelectNetwork}
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
        <div className="w-full max-h-36 scrollbar-hide overflow-y-auto">
          {allImages.length > 0 ? (
            <div className="w-full max-h-36 scrollbar-hide overflow-y-auto">
              {allImages.map((image, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 mb-2 rounded-md bg-black_0 hover:bg-grey_1 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{image.name}</span>
                    <span
                      className="px-2 py-1 text-xs font-semibold rounded-full"
                      style={{
                        borderColor: `${themeColor.borderColor}`,
                        backgroundColor: `${themeColor.bgColor}`,
                        color: `${themeColor.textColor}`,
                      }}
                    >
                      {image.tag}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-grey_4 hover:text-grey_6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetInfo(`${image.name}:${image.tag}`);
                      }}
                    >
                      <FaInfoCircle className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red_5 hover:text-red_6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(index);
                      }}
                    >
                      <FaTimesCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-36 text-center text-grey_7 p-2 text-sm">
              이미지를 드래그해서 놓으세요
            </div>
          )}
        </div>
      </div>
      <ContainerNameModal
        open={isNameModalOpen}
        containerName={containerName}
        onClose={() => setIsNameModalOpen(false)}
        onSave={handleSaveName}
        onChange={(name) => setContainerName(name)}
      />
      <ImageDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={detailData}
      />
    </>
  );
};

export default CardContainer;
