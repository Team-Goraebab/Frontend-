'use client';

import React, { useState, useEffect } from 'react';
import HostModal from '../modal/host/hostModal';
import { useHostStore } from '@/store/hostStore';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { selectedHostStore } from '@/store/seletedHostStore';
import { HiOutlineHome, HiPlus } from 'react-icons/hi';
import { Host, Network, ThemeColor } from '@/types/type';

const AddHostButton = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [availableNetworks, setAvailableNetworks] = useState<Network[]>([]);

  const { enqueueSnackbar } = useSnackbar();
  const addHost = useHostStore((state) => state.addHost);
  const addConnectedBridgeId = selectedHostStore(
    (state) => state.addConnectedBridgeId
  );

  // 네트워크 목록을 API에서 가져오는 함수
  const fetchNetworks = async () => {
    try {
      const response = await fetch('/api/network/list');
      const data = await response.json();
      console.log('네트워크 리스트 데이터', data);
      setAvailableNetworks(data || []);
    } catch (error) {
      console.error('네트워크 목록을 불러오는데 실패했습니다.', error);
    }
  };

  useEffect(() => {
    fetchNetworks();
  }, []);

  const handleAddHost = (
    id: string,
    hostNm: string,
    hostIp: string | undefined,
    isRemote: boolean,
    themeColor: ThemeColor,
    networkName: string,
    networkIp: string
  ): void => {
    const newHost: Host = {
      id,
      hostNm,
      hostIp: isRemote ? hostIp : undefined, // isRemote가 true일 때만 hostIp 설정
      status: true,
      isRemote,
      themeColor,
      networkName,
      networkIp,
    };

    const selectedNetwork = availableNetworks.find(
      (network) => network.Name.toLowerCase() === networkName.toLowerCase()
    );

    if (!selectedNetwork) {
      showSnackbar(
        enqueueSnackbar,
        '선택된 네트워크를 찾을 수 없습니다.',
        'error',
        '#d32f2f'
      );
      return;
    }

    addHost(newHost);

    addConnectedBridgeId(id, {
      name: selectedNetwork.Name,
      gateway: selectedNetwork.IPAM?.Config?.[0]?.Gateway || '',
      driver: selectedNetwork.Driver || '',
      subnet: selectedNetwork.IPAM?.Config?.[0]?.Subnet || '',
      scope: selectedNetwork.Scope || '',
    });

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
      <div className="fixed top-20 z-[9] right-[50px] transform translate-x-4 h-[42px] rounded-lg flex items-center justify-between">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-white bg-blue_6 hover:from-blue-600 hover:to-blue-800 text-center rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
        >
          <div className="flex gap-1 items-center">
            <HiPlus size={20} className="font-pretendard" />
            <span className="text-sm font-medium">New Host</span>
            <HiOutlineHome size={18} className="ml-2 font-medium" />
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
