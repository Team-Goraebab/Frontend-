'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal, OptionModal } from '@/components';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { useImageStore } from '@/store/imageStore';
import { getStatusColors } from '@/utils/statusColorsUtils';

interface CardProps {
  Id: string;
  Labels?: {
    [key: string]: string;
  };
  Size: number;
  RepoTags: string[];
  Created: number;
}

interface CardDataProps {
  data: CardProps;
}

/**
 *
 * @param data 이미지 데이터
 * @returns
 */
const ImageCard = ({ data }: CardDataProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const removeImage = useImageStore((state) => state.removeImage);

  const { bg1, bg2 } = getStatusColors('primary');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const items = [
    { label: 'ID', value: data.Id },
    // { label: 'NAME', value: data.Labels?.['com.docker.compose.project'] },
    { label: 'SIZE', value: (data.Size / (1024 * 1024)).toFixed(2) + ' MB' },
    { label: 'TAGS', value: data.RepoTags.join(', ') },
    { label: 'CREATED', value: new Date(data.Created * 1000).toLocaleString() },
  ];

  const handleOptionClick = () => {
    setShowOptions(!showOptions);
  };

  const handleGetInfo = () => {
    setShowOptions(false);
  };

  const handleDelete = () => {
    setShowModal(true);
    setShowOptions(false);
  };

  const handleConfirmDelete = () => {
    removeImage(data.Id);
    showSnackbar(
      enqueueSnackbar,
      '이미지가 삭제되었습니다.',
      'success',
      '#25BD6B'
    );
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
        <div className="flex justify-between text-grey_4 text-sm mb-3 relative">
          <span className={'font-pretendard font-bold text-grey_6 pt-2'}>
            {data.Labels?.['com.docker.compose.project'] || 'Unknown Project'}
          </span>
          <span
            className="font-semibold text-xs cursor-pointer"
            onClick={handleOptionClick}
          >
            •••
          </span>
          {showOptions && (
            <div className="absolute top-4 left-16">
              <OptionModal
                onTopHandler={handleGetInfo}
                onBottomHandler={handleDelete}
                btnVisible={false}
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
    </div>
  );
};

export default ImageCard;
