'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import ContainerModal from '../modal/container/containerModal';
import LargeButton from './largeButton';
import { showSnackbar } from '@/utils/toastUtils';

interface AddContainerButtonProps {
  onCreate: (containerData: any) => void;
}

const AddContainerButton = ({ onCreate }: AddContainerButtonProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddContainer = async (containerData: any) => {
    try {
      const res = await fetch('/api/container/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(containerData),
      });

      const result = await res.json();
      if (res.ok) {
        showSnackbar(
          enqueueSnackbar,
          '컨테이너가 성공적으로 생성되었습니다!',
          'success',
          '#254b7a'
        );
        onCreate(result);
      } else {
        showSnackbar(
          enqueueSnackbar,
          `컨테이너 생성 실패: ${result.error}`,
          'error',
          '#FF4853'
        );
      }
    } catch (error) {
      console.error('컨테이너 생성 중 에러:', error);
      showSnackbar(
        enqueueSnackbar,
        '컨테이너 생성 중 에러가 발생했습니다.',
        'error',
        '#FF4853'
      );
    }

    setIsModalOpen(false);
  };
  return (
    <>
      <LargeButton title={'Container'} onClick={() => setIsModalOpen(true)} />
      {isModalOpen && (
        <ContainerModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleAddContainer}
        />
      )}
    </>
  );
};

export default AddContainerButton;
