import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import { Dialog } from '@mui/material';
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
  availableNetworks: { name: string; ip: string }[];
}

const HostModal = ({ onClose, onSave }: HostModalProps) => {
  const id = uuidv4();
  const { enqueueSnackbar } = useSnackbar();

  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [hostNm, setHostNm] = useState<string>('');
  const [ip, setIp] = useState<string>('');
  const [availableNetworks, setAvailableNetworks] = useState<
    { Id: number; Name: string; IPAM: any }[]
  >([]);

  const [networkName, setNetworkName] = useState<string>('docker0');
  const [networkIp, setNetworkIp] = useState<string>('173.17.0.12');

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

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await fetch('/api/network/list');
        const data = await response.json();
        setAvailableNetworks(data || []);

        if (data && data.networks.length > 0) {
          setNetworkName(data.Name);
          setNetworkIp(data.IPAM?.Config?.[0]?.Gateway);
        }
      } catch (error) {
        console.log('네트워크 목록 에러 :', error);
      }
    };

    fetchNetworks();
  }, []);

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

    if (!networkIp) {
      showSnackbar(
        enqueueSnackbar,
        '네트워크를 선택해주세요.',
        'error',
        '#FF4853'
      );
      return;
    }

    onSave(
      id,
      hostNm,
      networkIp,
      isRemote,
      selectedColor,
      networkName,
      networkIp
    );
    onClose();
  };

  const handleNetworkChange = (selectedNetworkName: string) => {
    const selectedNetwork = availableNetworks.find(
      (net) => net.Name === selectedNetworkName
    );
    setNetworkName(selectedNetworkName);
    setNetworkIp(selectedNetwork?.IPAM?.Config?.[0]?.Gateway || '');
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

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center border-b pb-4">
          Create New Host
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Host Name</label>
          <input
            type="text"
            placeholder="Enter Host Name"
            value={hostNm}
            onChange={(e) => setHostNm(e.target.value)}
            className="w-full p-3 border border-grey_3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Host Type</h3>
          <div className="flex mb-4">
            <label className="mr-4 flex items-center cursor-pointer">
              <input
                type="radio"
                name="hostType"
                value="local"
                checked={!isRemote}
                onChange={() => setIsRemote(false)}
                className="hidden"
              />
              <span
                className={`w-4 h-4 border-2 border-grey_4 rounded-full flex items-center justify-center mr-2 ${
                  !isRemote ? 'bg-grey_4' : ''
                }`}
              >
                {!isRemote && (
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                )}
              </span>
              Local
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="hostType"
                value="remote"
                checked={isRemote}
                onChange={() => setIsRemote(true)}
                className="hidden"
              />
              <span
                className={`w-4 h-4 border-2 border-grey_4 rounded-full flex items-center justify-center mr-2 ${
                  isRemote ? 'bg-grey_4' : ''
                }`}
              >
                {isRemote && (
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                )}
              </span>
              Remote
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            Select Network
          </label>
          <select
            value={networkName}
            onChange={(e) => handleNetworkChange(e.target.value)}
            className="w-full p-3 border border-grey_3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableNetworks.map((net) => (
              <option key={net.Id} value={net.Name}>
                {net.Name} (IP: {net.IPAM?.Config?.[0]?.Gateway || 'IP 없음'})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Select Color Theme</h3>
          <div className="flex space-x-3">
            {colorsOption
              .filter((color) => !color.sub)
              .map((color) => (
                <div
                  key={color.id}
                  onClick={() => handleColorSelection(color.label)}
                  className={`w-8 h-8 rounded-full cursor-pointer transition-transform duration-200 transform hover:scale-110 ${
                    selectedColor?.label === color.label
                      ? 'ring-4 ring-offset-2 ring-grey_4'
                      : ''
                  }`}
                  style={{ backgroundColor: color.color }}
                />
              ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <Button title="Cancel" onClick={onClose} color="grey" />
          <Button title="Create" onClick={handleSave} />
        </div>
      </div>
    </Dialog>
  );
};

export default HostModal;
