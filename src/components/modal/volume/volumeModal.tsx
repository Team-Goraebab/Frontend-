'use client';

import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components';

interface VolumeModalProps {
  onClose: () => void;
  onCreate: (
    id: string,
    name: string,
    driver: string,
    mountPoint: string,
    capacity: string
  ) => void;
}

const VolumeModal = ({ onClose, onCreate }: VolumeModalProps) => {
  const [name, setName] = useState<string>('');
  const [driver, setDriver] = useState<string>('local');
  const [mountPoint, setMountPoint] = useState<string>('/mnt/data');
  const [capacity, setCapacity] = useState<string>('10GB');
  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = () => {
    if (!name) {
      showSnackbar(
        enqueueSnackbar,
        '볼륨 이름을 입력해주세요.',
        'error',
        '#FF4853'
      );
      return;
    }

    if (!mountPoint) {
      showSnackbar(
        enqueueSnackbar,
        '마운트 경로를 입력해주세요.',
        'error',
        '#FF4853'
      );
      return;
    }

    if (!capacity) {
      showSnackbar(
        enqueueSnackbar,
        '볼륨 용량을 입력해주세요.',
        'error',
        '#FF4853'
      );
      return;
    }

    const id = uuidv4(); // 볼륨 ID 생성
    onCreate(id, name, driver, mountPoint, capacity);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="xs">
      <div className="relative h-full flex flex-col">
        <div className="sticky top-0 bg-white z-10 pb-4 mt-4 border-b">
          <h2 className="text-2xl font-semibold text-center font-pretendard">
            Volume 생성하기
          </h2>
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          <input
            type="text"
            placeholder="Volume Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 p-3 border border-grey_2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-grey_4"
          />
          <input
            type="text"
            placeholder="Mount Point (e.g., /mnt/data)"
            value={mountPoint}
            onChange={(e) => setMountPoint(e.target.value)}
            className="mb-4 p-3 border border-grey_2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-grey_4"
          />
          <input
            type="text"
            placeholder="Capacity (e.g., 10GB)"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="mb-4 p-3 border border-grey_2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-grey_4"
          />
          <select
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            className="mb-8 p-3 border border-grey_2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-grey_4"
          >
            <option value="local">Local</option>
            <option value="nfs">NFS</option>
            <option value="glusterfs">GlusterFS</option>
            <option value="ceph">Ceph</option>
          </select>
        </div>

        <div className="sticky bottom-0 bg-white py-4 pr-4 flex justify-end space-x-4 border-t">
          <Button title="취소" onClick={onClose} color="red" />
          <Button title="생성" onClick={handleCreate} />
        </div>
      </div>
    </Dialog>
  );
};

export default VolumeModal;
