'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import ImageModal from '../modal/image/imageModal';
import { useImageStore } from '@/store/imageStore';
import LargeButton from './largeButton';

interface AddImageButtonProps {
  onCreate: (imageData: any) => void;
}

const AddImageButton = ({ onCreate }: AddImageButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const addImage = useImageStore((state) => state.addImage);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSave = async (
    id: string,
    name: string,
    tag: string,
    file: File | null,
    size: string,
    source: 'local' | 'dockerHub',
    dockerImageInfo?: any
  ) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('imageName', name);
    formData.append('tag', tag);

    if (source === 'local' && file) {
      formData.append('method', 'local');
      formData.append('file', file);
    } else if (source === 'dockerHub') {
      formData.append('method', 'pull');
    } else {
      showSnackbar(
        enqueueSnackbar,
        '올바른 소스를 선택해 주세요.',
        'error',
        '#FF4853'
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/image/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create image');
      }

      const imageData = {
        id,
        name,
        tag,
        size,
        source,
        dockerImageInfo,
      };
      onCreate(imageData);
      addImage(imageData);

      showSnackbar(
        enqueueSnackbar,
        '이미지가 성공적으로 추가되었습니다!',
        'success',
        '#254b7a'
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating image:', error);
      showSnackbar(
        enqueueSnackbar,
        '이미지 추가 중 오류가 발생했습니다.',
        'error',
        '#254b7a'
      );
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <LargeButton
        title="Image"
        onClick={openModal}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? '이미지 추가 중...' : 'Image'}
      </LargeButton>
      {isModalOpen && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default AddImageButton;
