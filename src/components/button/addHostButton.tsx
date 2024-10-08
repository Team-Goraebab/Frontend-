'use client';

import React, { useState } from 'react';
import HostModal from '../modal/host/hostModal';
import { useHostStore } from '@/store/hostStore';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { selectedHostStore } from '@/store/seletedHostStore';
import { HiOutlineHome, HiPlus } from 'react-icons/hi';

const AddHostButton = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [availableNetworks] = useState<{ name: string; ip: string }[]>([
    { name: 'bridge', ip: '172.17.0.1' },
    { name: 'host', ip: '192.168.1.1' },
    { name: 'custom-network', ip: '10.0.0.1' },
  ]);

  const { enqueueSnackbar } = useSnackbar();
  const addHost = useHostStore((state) => state.addHost);
  const addConnectedBridgeId = selectedHostStore(
    (state) => state.addConnectedBridgeId
  );

  const handleAddHost = (
    id: string,
    hostNm: string,
    ip: string,
    isRemote: boolean,
    themeColor: {
      label: string;
      bgColor: string;
      borderColor: string;
      textColor: string;
    },
    networkName: string,
    networkIp: string
  ) => {
    const newHost = {
      id,
      hostNm,
      ip,
      status: true,
      isRemote,
      themeColor,
      networkName,
      networkIp,
    };

    const defaultNetwork = {
      id: 'default-docker-network',
      name: 'docker0',
      subnet: '174.172.17.0/24',
      gateway: '174.172.17.1',
      networkIp: '174.172.17.1',
      driver: 'bridge',
      connectedContainers: [],
      status: 'active',
    };

    // Zustand에 호스트 저장
    addHost(newHost);

    // 기본 네트워크를 호스트에 연결
    addConnectedBridgeId(id, defaultNetwork);

    showSnackbar(
      enqueueSnackbar,
      '호스트가 성공적으로 추가되었습니다!',
      'success',
      '#254b7a'
    );
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="fixed top-20 right-[40px] transform translate-x-4 h-[40px] hover:bg-blue_6 bg-blue_5 rounded-lg shadow-lg flex items-center justify-between">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-white text-center rounded-md  transition-all duration-200"
        >
          <div className="flex gap-1 items-center">
            <HiPlus size={20} className="font-bold" />
            <span className="text-sm font-medium">New Host</span>
            <HiOutlineHome size={20} className="font-bold" />
          </div>
        </button>
      </div>
      <div className="min-h-screen flex items-center justify-center">
        {isModalOpen && (
          <HostModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddHost}
            availableNetworks={availableNetworks}
          />
        )}
      </div>
    </>
  );
};

export default AddHostButton;