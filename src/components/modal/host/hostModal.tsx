'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import { showSnackbar } from '@/utils/toastUtils';
import { colorsOption } from '@/data/color';
import { ThemeColor } from '@/types/type';
import { Button } from '@/components';

interface HostModalProps {
  onClose: () => void;
  onSave: (
    id: string,
    hostNm: string,
    ip: string,
    isRemote: boolean,
    themeColor: ThemeColor,
    networkName: string,
    networkIp: string
  ) => void;
  availableNetworks: { name: string; ip: string }[]; // 네트워크 이름과 IP 목록
}

const HostModal = ({ onClose, onSave, availableNetworks }: HostModalProps) => {
  const id = uuidv4();

  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [hostNm, setHostNm] = useState<string>('');
  const [ip, setIp] = useState<string>('');
  // defualt network
  const [networkName, setNetworkName] = useState<string>('docker0');
  const [networkIp, setNetworkIp] = useState<string>('173.17.0.12');
  // const [networkName, setNetworkName] = useState<string>(
  //   availableNetworks[0]?.name || ''
  // );
  // const [networkIp, setNetworkIp] = useState<string>(
  //   availableNetworks[0]?.ip || ''
  // );

  // Initialize with the first color option as default
  const defaultColor = colorsOption.find((color) => !color.sub);
  const defaultSubColor = colorsOption.find(
    (color) => color.label === defaultColor?.label && color.sub
  );

  const [selectedColor, setSelectedColor] = useState<ThemeColor>({
    label: defaultColor?.label || '',
    bgColor: defaultSubColor?.color || '',
    borderColor: defaultColor?.color || '',
    textColor: defaultColor?.color || '',
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleSave = () => {
    if (!hostNm) {
      showSnackbar(
        enqueueSnackbar,
        'Host 이름을 입력해주세요.',
        'error',
        '#FF4853'
      );
      return;
    }

    if (!ip) {
      showSnackbar(enqueueSnackbar, 'IP를 입력해주세요.', 'error', '#FF4853');
      return;
    }

    onSave(id, hostNm, ip, isRemote, selectedColor, networkName, networkIp);
    onClose();
  };

  const handleColorSelection = (colorLabel: string) => {
    const mainColor = colorsOption.find(
      (color) => color.label === colorLabel && !color.sub
    );
    const subColor = colorsOption.find(
      (color) => color.label === colorLabel && color.sub
    );

    setSelectedColor({
      label: colorLabel,
      bgColor: subColor?.color || '',
      borderColor: mainColor?.color || '',
      textColor: mainColor?.color || '',
    });
  };

  const handleNetworkChange = (selectedNetworkName: string) => {
    const selectedNetwork = availableNetworks.find(
      (net) => net.name === selectedNetworkName
    );
    setNetworkName(selectedNetworkName);
    setNetworkIp(selectedNetwork?.ip || '');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Create New Host</h2>
        <input
          type="text"
          placeholder="Host Name"
          value={hostNm}
          onChange={(e) => setHostNm(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="IP Address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <div className="mb-4">
          <label className="mr-4">
            <input
              type="radio"
              name="hostType"
              value="local"
              checked={!isRemote}
              onChange={() => setIsRemote(false)}
              className="mr-2"
            />
            Local
          </label>
          <label>
            <input
              type="radio"
              name="hostType"
              value="remote"
              checked={isRemote}
              onChange={() => setIsRemote(true)}
              className="mr-2"
            />
            Remote
          </label>
        </div>
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">Select Color Theme:</h3>
          <div className="flex space-x-2">
            {colorsOption
              .filter((color) => !color.sub)
              .map((color) => (
                <div
                  key={color.id}
                  onClick={() => handleColorSelection(color.label)}
                  className={`w-6 h-6 rounded-full cursor-pointer ${
                    selectedColor?.label === color.label
                      ? 'ring-2 ring-offset-2 ring-blue-500'
                      : ''
                  }`}
                  style={{ backgroundColor: color.color }}
                />
              ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-8">
          <Button title={'Cancel'} onClick={onClose} color="grey" />
          <Button title={'Create'} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default HostModal;
