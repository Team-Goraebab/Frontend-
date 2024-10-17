'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import VolumeModal from '../modal/volume/volumeModal';
import { showSnackbar } from '@/utils/toastUtils';
import LargeButton from '../button/largeButton';

interface AddVolumeButtonProps {
  onCreate: (volumeData: any) => void;
}

const AddVolumeButton = ({ onCreate }: AddVolumeButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  /**
   * add volume handler
   * @param id volume id
   * @param name volume name
   * @param driver volume driver
   * @param mountPoint volume mountPoint
   * @param capacity volume capacity
   */
  const handleCreateVolume = async (
    id: string,
    name: string,
    driver: string,
    mountPoint: string,
    capacity: string
  ) => {
    const newVolumeData = {
      Name: name,
      Driver: driver,
      Labels: {
        capacity: capacity,
      },
    };

    try {
      const response = await fetch('/api/volume/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVolumeData),
      });

      const result = await response.json();

      if (response.ok) {
        showSnackbar(
          enqueueSnackbar,
          '볼륨이 성공적으로 생성되었습니다!',
          'success',
          '#254b7a'
        );
        onCreate(result);
      } else {
        showSnackbar(
          enqueueSnackbar,
          `볼륨 생성 실패: ${result.error}`,
          'error',
          '#FF4853'
        );
      }
    } catch (error) {
      console.error('네트워크 생성 중 에러:', error);
      showSnackbar(
        enqueueSnackbar,
        '볼륨 생성 중 에러가 발생했습니다.',
        'error',
        '#FF4853'
      );
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <LargeButton title={'Volume'} onClick={() => setIsModalOpen(true)} />
      {isModalOpen && (
        <VolumeModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateVolume}
        />
      )}
    </>
  );
};

export default AddVolumeButton;
