'use client';

import React, { useState } from 'react';
import { Dialog } from '@mui/material';
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
 * IP 주소 형식 검사 함수
 * @param ip IP 주소 문자열
 * @returns 유효한 IP 형식이면 true, 그렇지 않으면 false
 */
const isValidIPAddress = (ip: string): boolean => {
  const ipPattern =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
  return ipPattern.test(ip);
};

/**
 * CIDR 서브넷 형식 검사 함수
 * @param subnet CIDR 형식의 문자열
 * @returns 유효한 CIDR 형식이면 true, 그렇지 않으면 false
 */
const isValidCIDR = (subnet: string): boolean => {
  const cidrPattern =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}\/([0-9]|[1-2][0-9]|3[0-2])$/;
  return cidrPattern.test(subnet);
};

/**
 * BridgeModal 컴포넌트
 * @param onClose 모달 닫기 핸들러
 * @param onCreate 브리지 생성 핸들러
 * @returns
 */
const BridgeModal = ({ onClose, onCreate }: BridgeModalProps) => {
  const [name, setName] = useState<string>('');
  const [subnet, setSubnet] = useState<string>('192.168.1.0/24');
  const [gateway, setGateway] = useState<string>('192.168.1.1');
  const [driver, setDriver] = useState<string>('bridge');
  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = () => {
    if (!name.trim()) {
      showSnackbar(
        enqueueSnackbar,
        '브리지 이름을 입력해주세요.',
        'error',
        '#FF4853'
      );
      return;
    }

    if (!isValidCIDR(subnet)) {
      showSnackbar(
        enqueueSnackbar,
        '올바른 서브넷 형식을 입력해주세요. (예: 192.168.1.0/24)',
        'error',
        '#FF4853'
      );
      return;
    }

    if (!isValidIPAddress(gateway)) {
      showSnackbar(
        enqueueSnackbar,
        '올바른 게이트웨이 IP 주소를 입력해주세요. (예: 192.168.1.1)',
        'error',
        '#FF4853'
      );
      return;
    }

    const id = uuidv4();
    onCreate(id, name, subnet, gateway, driver);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="xs">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Bridge 생성하기</h2>
        <input
          type="text"
          placeholder="Bridge Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 p-2 border border-grey_2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Subnet (e.g., 192.168.1.0/24)"
          value={subnet}
          onChange={(e) => setSubnet(e.target.value)}
          className="mb-2 p-2 border border-grey_2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Gateway (e.g., 192.168.1.1)"
          value={gateway}
          onChange={(e) => setGateway(e.target.value)}
          className="mb-2 p-2 border border-grey_2 rounded w-full"
        />
        <select
          value={driver}
          onChange={(e) => setDriver(e.target.value)}
          className="mb-8 p-2 border border-grey_2 rounded w-full"
        >
          <option value="bridge">Bridge</option>
          <option value="host">Host</option>
          <option value="overlay">Overlay</option>
        </select>
        <div className="flex justify-end space-x-2 pt-8">
          <Button title={'취소'} onClick={onClose} color={'red'} />
          <Button title={'생성'} onClick={handleCreate} />
        </div>
      </div>
    </Dialog>
  );
};

export default BridgeModal;
