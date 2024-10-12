'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal, OptionModal } from '@/components';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { useImageStore } from '@/store/imageStore';
import { getStatusColors } from '@/utils/statusColorsUtils';
import { formatTimestamp } from '@/utils/formatTimestamp';
import { fetchData } from '@/services/apiUtils';
import ImageDetailModal from '../modal/image/imageDetailModal';
import ImageStartOptionModal from '@/components/modal/image/imageStartOptionModal';

interface CardProps {
  Id: string;
  Labels?: {
    [key: string]: string;
  };
  Size: number;
  RepoTags: string[];
  Created: number;
  ExposedPorts?: { [key: string]: {} };
  Volumes?: { [key: string]: {} };
  Env?: string[];
}

interface CardDataProps {
  data: CardProps;
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

const ImageCard = ({ data }: CardDataProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const removeImage = useImageStore((state) => state.removeImage);

  const { bg1, bg2 } = getStatusColors('primary');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [isRunModalOpen, setIsRunModalOpen] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const repoTag =
    data.RepoTags.length > 0
      ? data.RepoTags[0].split(':')
      : ['<none>', '<none>'];
  const [name, tag] = repoTag;

  const items = [
    { label: 'NAME', value: name || '<none>' },
    { label: 'TAG', value: tag || '<none>' },
    { label: 'CREATED', value: formatTimestamp(data.Created) },
    { label: 'SIZE', value: (data.Size / (1024 * 1024)).toFixed(2) + ' MB' },
  ];

  const handleOptionClick = () => {
    setShowOptions(!showOptions);
  };

  const handleDelete = () => {
    setShowModal(true);
    setShowOptions(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`/api/image/delete?id=${data.Id}&force=true`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete image');
      }

      removeImage(data.Id);
      showSnackbar(
        enqueueSnackbar,
        '이미지가 삭제되었습니다.',
        'success',
        '#25BD6B'
      );
    } catch (error) {
      console.error('Error deleting image:', error);
      showSnackbar(
        enqueueSnackbar,
        '이미지 삭제에 실패했습니다.',
        'error',
        '#FF0000'
      );
    } finally {
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchImageDetail = async (name: string) => {
    try {
      const data = await fetchData(`/api/image/detail?name=${name}`);
      if (!data) {
        throw new Error('Failed to fetch image detail');
      }
      return data;
    } catch (error) {
      console.error('Error fetching image detail:', error);
      throw error;
    }
  };

  const handleGetInfo = async () => {
    try {
      const imageDetail = await fetchImageDetail(data.RepoTags[0]);
      console.log('이미지 상세 정보:', imageDetail);
      setDetailData(imageDetail);
      setShowOptions(false);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleStart = async () => {
    setShowOptions(false);
    setIsRunModalOpen(true);
  }

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

      const result = await response.json();
      showSnackbar(
        enqueueSnackbar,
        '컨테이너가 성공적으로 실행되었습니다.',
        'success',
        '#25BD6B'
      );
    } catch (error) {
      console.error('Error running container:', error);
      showSnackbar(
        enqueueSnackbar,
        '컨테이너 실행에 실패했습니다.',
        'error',
        '#FF0000'
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cardRef]);

  return (
    <div
      ref={cardRef}
      className="relative flex items-start px-3 pt-1 pb-3 bg-grey_0 shadow rounded-lg mb-4"
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-lg"
        style={{ backgroundColor: bg2 }}
      />
      <div className="ml-4 flex flex-col w-full">
        <div className="flex justify-end text-grey_4 text-sm mb-3 relative">
          <span
            className="font-semibold text-xs cursor-pointer"
            onClick={handleOptionClick}
          >
            •••
          </span>
          {showOptions && (
            <div className="absolute top-4 left-28">
              <OptionModal
                onTopHandler={handleGetInfo}
                onBottomHandler={handleDelete}
                onMiddleHandler={handleStart}
                btnVisible={true}
              />
            </div>
          )}
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex items-center mt-[5px] space-x-3.5">
            <span
              className="text-xs py-1 w-[60px] rounded-md font-bold text-center"
              style={{ backgroundColor: bg1, color: bg2 }}
            >
              {item.label}
            </span>
            <span className="font-semibold text-xs truncate max-w-[150px]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
      <ImageDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={detailData}
      />
      <ImageStartOptionModal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        onRun={handleRunContainer}
        imageName={data.RepoTags[0]}
      />
    </div>
  );
};

export default ImageCard;
