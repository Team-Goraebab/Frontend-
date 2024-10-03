'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components';

interface BridgeModalProps {
  onClose: () => void;
  onCreate: (
    id: string,
    name: string,
    subnet: string,
    gateway: string,
    driver: string
  ) => void;
}

/**
 *
 * @param onClose 브릿지 모달 닫기 핸들러
 * @param onCreate 브릿지 모달 생성 핸들러
 * @returns
 */
const BridgeModal = ({ onClose, onCreate }: BridgeModalProps) => {
  const [name, setName] = useState<string>('');
  const [subnet, setSubnet] = useState<string>('192.168.1.0/24');
  const [gateway, setGateway] = useState<string>('192.168.1.1');
  const [driver, setDriver] = useState<string>('bridge');
  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = () => {
    if (!name) {
      showSnackbar(
        enqueueSnackbar,
        '브리지 이름을 입력해주세요.',
        'error',
        '#FF4853'
      );
      return;
    }

    if (!subnet) {
      showSnackbar(
        enqueueSnackbar,
        '서브넷을 입력해주세요.',
        'error',
        '#FF4853'
      );
      return;
    }

    if (!gateway) {
      showSnackbar(
        enqueueSnackbar,
        '게이트웨이를 입력해주세요.',
        'error',
        '#FF4853'
      );
      return;
    }

    const id = uuidv4(); // 네트워크 ID 생성
    onCreate(id, name, subnet, gateway, driver);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-white p-6 rounded-md shadow-lg w-2/5">
        <h2 className="text-lg font-semibold mb-4">Create Custom Bridge</h2>
        <input
          type="text"
          placeholder="Bridge Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Subnet (e.g., 192.168.1.0/24)"
          value={subnet}
          onChange={(e) => setSubnet(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Gateway (e.g., 192.168.1.1)"
          value={gateway}
          onChange={(e) => setGateway(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <select
          value={driver}
          onChange={(e) => setDriver(e.target.value)}
          className="mb-8 p-2 border border-gray-300 rounded w-full"
        >
          {/* 드라이버 옵션 */}
          <option value="bridge">Bridge</option>
          <option value="host">Host</option>
          <option value="overlay">Overlay</option>
        </select>
        <div className="flex justify-end space-x-2 pt-8">
          <Button title={'Cancel'} onClick={onClose} color="grey" />
          <Button title={'Create'} onClick={handleCreate} />
        </div>
      </div>
    </div>
  );
};

export default BridgeModal;
