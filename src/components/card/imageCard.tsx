'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '@/components';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { getStatusColors } from '@/utils/statusColorsUtils';
import { fetchData } from '@/services/apiUtils';
import ImageDetailModal from '../modal/image/imageDetailModal';
import ImageStartOptionModal from '@/components/modal/image/imageStartOptionModal';
import {
  FiInfo,
  FiTrash,
  FiPlay,
  FiCpu,
  FiTag,
  FiSave,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { TbNumber } from 'react-icons/tb';
import { useDrag } from 'react-dnd';

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
  onDeleteSuccess: () => void;
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

const ImageCard = ({ data, onDeleteSuccess }: CardDataProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'IMAGE_CARD',
    item: { image: data.RepoTags[0], id: data.Id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (ref.current) {
      drag(ref);
    }
  }, [ref, drag]);

  const { enqueueSnackbar } = useSnackbar();

  const { bg1, bg2 } = getStatusColors('primary');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [isRunModalOpen, setIsRunModalOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false); // 아코디언 상태

  const repoTag =
    data.RepoTags.length > 0
      ? data.RepoTags[0].split(':')
      : ['<none>', '<none>'];
  const [name, tag] = repoTag;

  const items = [
    { label: 'Name', value: name || '<none>', icon: FiCpu },
    { label: 'Tag', value: tag || '<none>', icon: FiTag },
    {
      label: 'Size',
      value: (data.Size / (1024 * 1024)).toFixed(2) + ' MB',
      icon: FiSave,
    },
    { label: 'Id', value: data.Id || '<none>', icon: TbNumber },
  ];

  const handleDelete = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `/api/image/delete?id=${data.Id}&force=true`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete image');
      }

      showSnackbar(
        enqueueSnackbar,
        '이미지가 삭제되었습니다.',
        'success',
        '#4CAF50'
      );

      onDeleteSuccess();
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
      setDetailData(imageDetail);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleStart = async () => {
    setIsRunModalOpen(true);
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

      const result = await response.json();
      showSnackbar(
        enqueueSnackbar,
        '컨테이너가 성공적으로 실행되었습니다.',
        'success',
        '#4CAF50'
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

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="relative bg-white border rounded-lg transition-all duration-300 mb-2 overflow-hidden"
    >
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center space-x-2 truncate">
          <span className="font-bold font-pretendard text-sm text-grey_6 truncate">
            {data.RepoTags[0] || 'Unnamed Image'}
          </span>
        </div>
        <div className="flex">
          <button
            onClick={handleStart}
            className="p-2 rounded-full hover:bg-grey_1 transition-colors"
            title="Run Container"
          >
            <FiPlay className="text-grey_4" size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full hover:bg-grey_1 transition-colors"
            title="Delete Image"
          >
            <FiTrash className="text-grey_4" size={16} />
          </button>
          <button
            onClick={toggleAccordion}
            className="p-2 rounded-full hover:bg-grey_1 transition-colors"
            title="Toggle Details"
          >
            {isExpanded ? (
              <FiChevronUp size={16} className="text-grey_4" />
            ) : (
              <FiChevronDown size={16} className="text-grey_4" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="grid gap-4">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: bg1 }}
                  >
                    <item.icon size={16} style={{ color: bg2 }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-grey_4 font-medium font-pretendard">
                      {item.label}
                    </span>
                    <span className="font-pretendard font-semibold text-sm text-grey_7 truncate max-w-[150px]">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">항목이 없습니다.</div>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleGetInfo}
              className="p-2 rounded-full hover:bg-grey_1 transition-colors"
              title="Image Info"
            >
              <FiInfo className="text-grey_4" size={16} />
            </button>
          </div>
        </div>
      )}

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
