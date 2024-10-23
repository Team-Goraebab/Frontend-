'use client';

import React, { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDrop } from 'react-dnd';
import {
  FaTimesCircle,
  FaInfoCircle,
  FaPlusCircle,
  FaChevronUp,
  FaChevronDown,
} from 'react-icons/fa';
import { MdStorage } from 'react-icons/md';
import { Container, ThemeColor, VolumeData } from '@/types/type';
import ImageDetailModal from '@/components/modal/image/imageDetailModal';
import SelectVolumeModal from '../modal/volume/selectVolumeModal';
import ConfigurationModal from '../modal/daemon/configurationModal';
import { selectedHostStore } from '@/store/seletedHostStore';
import { useSnackbar } from 'notistack';

export interface CardContainerProps {
  networkName: string;
  networkIp: string;
  containers: Container[];
  themeColor: ThemeColor;
  onDelete?: () => void;
  onSelectNetwork?: () => void;
  isSelected?: boolean;
  hostIp: string;
}

interface ImageInfo {
  id: string;
  name: string;
  tag: string;
}

interface ImageToNetwork {
  id: string;
  name: string;
  tag: string;
  networkName: string;
}

const CardContainer = ({
  networkName,
  networkIp,
  containers,
  themeColor,
  onDelete,
  onSelectNetwork,
  isSelected,
  hostIp,
}: CardContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const randomId = uuidv4();
  const { enqueueSnackbar } = useSnackbar();

  const selectedHostIp = selectedHostStore((state) => state.selectedHostIp);

  const [droppedImages, setDroppedImages] = useState<ImageInfo[]>([]);
  const [imageToNetwork, setImageToNetwork] = useState<ImageToNetwork[]>([]);
  const [detailData, setDetailData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVolumes, setSelectedVolumes] = useState<VolumeData[]>([]);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [configs, setConfigs] = useState<{ [key: string]: any[] }>({});
  const [imageVolumes, setImageVolumes] = useState<{
    [imageId: string]: VolumeData[];
  }>({});

  console.log('configs >>>', configs);
  console.log('imageVolumes >>>', imageVolumes);
  console.log('imageToNetwork >>>', imageToNetwork);

  const splitImageNameAndTag = (image: string, id: string): ImageInfo => {
    const [name, tag] = image.split(':');
    return { id, name, tag };
  };

  const handleGetInfo = async (imageName: string) => {
    try {
      const imageDetail = await fetch(
        `/api/image/detail?name=${imageName}`
      ).then((res) => res.json());
      setDetailData(imageDetail);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'IMAGE_CARD',
    drop: (item: { image: string; id: string }) => {
      if (droppedImages.length > 0) {
        enqueueSnackbar('이미지는 하나만 추가할 수 있습니다.', {
          variant: 'warning',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        return;
      }

      const imageInfo = splitImageNameAndTag(item.image, item.id);
      setDroppedImages((prev) => [...prev, imageInfo]);
      setImageToNetwork((prev) => [...prev, { ...imageInfo, networkName }]);
    },
    canDrop: () => hostIp === selectedHostIp,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  const allImages = [
    ...containers.map((c) => splitImageNameAndTag(c.image.name, c.id)),
    ...droppedImages,
  ];

  const handleDeleteImage = (imageId: string) => {
    // 이미지 삭제
    setDroppedImages((prev) => prev.filter((image) => image.id !== imageId));
    // imageToNetwork에서 해당 이미지 정보 삭제
    setImageToNetwork((prev) => prev.filter((entry) => entry.id !== imageId));
    // imageVolumes에서 해당 이미지의 볼륨 데이터 삭제
    setImageVolumes((prev) => {
      const updatedVolumes = { ...prev };
      delete updatedVolumes[imageId];
      return updatedVolumes;
    });
  };

  const handleOpenVolumeModal = (imageId: string) => {
    setSelectedImage(imageId);
    setSelectedVolumes(imageVolumes[imageId] || []);
    setIsVolumeModalOpen(true);
  };

  const handleCloseVolumeModal = () => {
    setIsVolumeModalOpen(false);
  };

  const handleAddVolume = (volumeData: VolumeData[]) => {
    setImageVolumes((prev) => ({
      ...prev,
      [selectedImage]: volumeData,
    }));
    handleCloseVolumeModal();
  };

  const handleConfig = () => {
    setIsConfigModalOpen(true);
  };

  const handleSaveConfig = (config: any) => {
    setConfigs((prev) => ({
      ...prev,
      [networkName]: [...(prev[networkName] || []), config],
    }));
    setIsConfigModalOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div
        ref={ref}
        className={`relative flex flex-col items-center p-6 border bg-white rounded-lg shadow-lg w-[500px] transition-colors duration-200 cursor-pointer ${
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
            className="absolute top-4 right-4 hover:text-grey_5 text-white duration-200 hover:scale-105"
          >
            <FaTimesCircle
              className="w-5 h-5 text-white"
              style={{
                color: themeColor.borderColor,
                backgroundColor: 'white',
                borderRadius: 10,
              }}
            />
          </button>
        )}
        <div
          className="w-full flex items-center justify-center text-blue_6 border-2 p-2.5 rounded-md mb-4 text-sm font-semibold space-x-2"
          style={{
            borderColor: `${themeColor.borderColor}`,
            backgroundColor: `${themeColor.bgColor}`,
            color: `${themeColor.textColor}`,
          }}
        >
          <button
            onClick={handleConfig}
            className="flex items-center justify-center px-2 rounded-full transition-colors duration-200"
            style={{ color: themeColor.textColor }}
          >
            <MdStorage className="w-6 h-6" />
          </button>
          <span>{`${networkName} : ${networkIp}`}</span>
        </div>
        <div className="w-full h-44 scrollbar-hide overflow-y-auto">
          {allImages.length > 0 ? (
            <div className="space-y-4">
              {allImages.map((image, index) => {
                const isExpanded = expandedImage === image.id;
                return (
                  <div
                    key={image.id}
                    className="bg-white border border-grey_2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-row items-center gap-2">
                          <span
                            className="font-bold font-pretendard"
                            title={image.name}
                          >
                            {image.name.length > 13
                              ? `${image.name.slice(0, 13)}...`
                              : image.name}
                          </span>

                          <span
                            className="px-2 py-1 text-xs font-semibold rounded-md inline-block"
                            style={{
                              borderColor: `${themeColor.borderColor}`,
                              backgroundColor: `${themeColor.bgColor}`,
                              color: `${themeColor.textColor}`,
                            }}
                          >
                            {image.tag}
                          </span>
                        </div>
                        <div className="flex space-x-2 items-center">
                          <button
                            className="flex items-center space-x-1 text-sm text-grey_6 hover:text-grey_7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGetInfo(image.name);
                            }}
                          >
                            <FaInfoCircle className="w-4 h-4" />
                            <span>정보</span>
                          </button>
                          <button
                            className="flex items-center space-x-1 text-sm text-grey_6 hover:text-grey_7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenVolumeModal(image.id);
                            }}
                          >
                            <FaPlusCircle className="w-4 h-4" />
                            <span>볼륨 추가</span>
                          </button>
                          <button
                            className="flex items-center space-x-1 text-sm text-red-500 hover:text-red_6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(image.id);
                            }}
                          >
                            <FaTimesCircle className="w-4 h-4" />
                            <span>삭제</span>
                          </button>
                        </div>
                      </div>
                      {/* {imageVolumes[image.id]?.length > 0 && ( */}
                      <div className="mt-3 flex justify-between">
                        <h4 className="text-sm font-semibold text-grey_6">
                          Volumes ({imageVolumes[image.id]?.length || 0})
                        </h4>
                        <button
                          className="text-grey_5 hover:text-grey_6"
                          onClick={() =>
                            setExpandedImage(isExpanded ? null : image.id)
                          }
                        >
                          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      </div>
                      {/* )} */}
                    </div>
                    {isExpanded && imageVolumes[image.id]?.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-b-lg border-t border-grey_2">
                        <ul className="space-y-2">
                          {imageVolumes[image.id].map((vol, volIndex) => (
                            <li
                              key={volIndex}
                              className="flex items-center justify-between"
                            >
                              <span
                                className="text-sm text-grey_6 truncate max-w-[300px]"
                                title={vol.Name}
                              >
                                {vol.Name}
                              </span>
                              <span className="text-xs text-grey_5 bg-grey_2 px-2 py-1 rounded">
                                {vol.Driver}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full h-44 flex items-center justify-center text-grey_7 p-2 text-sm border-2 border-dashed border-grey_2 rounded-lg">
              이미지를 드래그해서 놓으세요
            </div>
          )}
        </div>
      </div>
      <ImageDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={detailData}
      />
      <SelectVolumeModal
        open={isVolumeModalOpen}
        imageName={selectedImage}
        onClose={handleCloseVolumeModal}
        onSave={handleAddVolume}
        initialSelectedVolumes={selectedVolumes}
      />
      <ConfigurationModal
        open={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveConfig}
      />
    </>
  );
};

export default CardContainer;
