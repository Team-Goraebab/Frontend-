'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import BridgeModal from '../modal/network/bridgeModal';
import LargeButton from './largeButton';

interface AddBridgeButtonProps {
  onCreate: (createdNetwork: any) => void;
}

const AddBridgeButton = ({ onCreate }: AddBridgeButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  /**
   * add bridge handler
   * @param id bridge id
   * @param name bridge name
   * @param subnet bridge subnet
   * @param gateway bridge gateway
   * @param driver bridge driver
   */
  const handleCreateBridge = async (
    id: string,
    name: string,
    subnet: string,
    gateway: string,
    driver: string
  ) => {
    const newNetworkData = {
      Name: name,
      Subnet: subnet,
      Gateway: gateway,
      Driver: driver,
      connectedContainers: [],
    };

    try {
      const response = await fetch('/api/network/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNetworkData),
      });

      const result = await response.json();
      if (response.ok) {
        showSnackbar(
          enqueueSnackbar,
          '브리지 네트워크가 성공적으로 생성되었습니다!',
          'success',
          '#254b7a'
        );

        // 생성된 네트워크의 ID와 함께 부모 컴포넌트에 전달
        onCreate({ ...newNetworkData, id: result.Id });
      } else {
        showSnackbar(
          enqueueSnackbar,
          `네트워크 생성 실패: ${result.error}`,
          'error',
          '#FF4853'
        );
      }
    } catch (error) {
      console.error('네트워크 생성 중 에러:', error);
      showSnackbar(
        enqueueSnackbar,
        '네트워크 생성 중 에러가 발생했습니다.',
        'error',
        '#FF4853'
      );
    }

    setIsModalOpen(false);
  };

  return (
    <>
      <LargeButton
        title={'Custom Bridge'}
        onClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <BridgeModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateBridge}
        />
      )}
    </>
  );
};

export default AddBridgeButton;
