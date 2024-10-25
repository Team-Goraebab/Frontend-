'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from '@mui/material';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { Button } from '@/components';
import { fetchData } from '@/services/apiUtils';

interface ContainerModalProps {
  onClose: () => void;
  onCreate: (containerData: any) => void;
}

const ContainerModal = ({ onClose, onCreate }: ContainerModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [images, setImages] = useState<any[]>([]);
  const [volumes, setVolumes] = useState<any[]>([]);

  const [name, setName] = useState<string>(''); // 이름은 선택 사항
  const [ports, setPorts] = useState<string>('80:80,443:443');
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);
  const [selectedVolumesInfo, setSelectedVolumeInfo] = useState<any>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedImageInfo, setSelectedImageInfo] = useState<any | null>(null);
  const [availableNetworks, setAvailableNetworks] = useState<
    { Id: number; Name: string; IPAM: any }[]
  >([]);
  const [networkName, setNetworkName] = useState<string>('bridge');
  const [networkIp, setNetworkIp] = useState<string>('172.17.0.1');

  const loadData = async () => {
    try {
      const volumeData = await fetchData('/api/volume/list');
      const imageData = await fetchData('/api/image/list');
      setVolumes(volumeData?.Volumes || []);
      setImages(imageData || []);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await fetch('/api/network/list');
        const data = await response.json();
        setAvailableNetworks(data?.networks || []);

        if (data?.networks && data.networks.length > 0) {
          setNetworkName(data.networks[0].Name);
          setNetworkIp(data.networks[0].IPAM?.Config?.[0]?.Gateway || '');
        }
      } catch (error) {
        console.error('Error fetching networks:', error);
        setAvailableNetworks([]);
      }
    };

    fetchNetworks();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const handleVolumeChange = (volume: any, volumeName: string) => {
    setSelectedVolumes((prevSelected) =>
      prevSelected.includes(volumeName)
        ? prevSelected.filter((name) => name !== volumeName)
        : [...prevSelected, volumeName]
    );
    setSelectedVolumeInfo((prevSelected: any) =>
      prevSelected.some((vol: any) => vol.id === volume.id)
        ? prevSelected.filter((vol: any) => vol.id !== volume.id)
        : [...prevSelected, volume]
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedImageName = event.target.value;
    setSelectedImage(selectedImageName);
    const selectedImageData = images.find(
      (img) => img.Id === selectedImageName
    );
    setSelectedImageInfo(selectedImageData || null);
  };

  const handleNetworkChange = (selectedNetworkName: string) => {
    const selectedNetwork = availableNetworks.find(
      (net) => net.Name === selectedNetworkName
    );
    setNetworkName(selectedNetworkName);
    setNetworkIp(selectedNetwork?.IPAM?.Config?.[0]?.Gateway || '');
  };

  const handleSave = () => {
    // 유효성 검사
    if (!selectedImageInfo) {
      showSnackbar(
        enqueueSnackbar,
        '이미지를 선택해주세요.',
        'error',
        '#FF4853'
      );
      return;
    }

    const imageNameWithTag = selectedImageInfo?.RepoTags?.[0];

    const newContainer = {
      image: imageNameWithTag,
      name,
      networkName,
      volume: selectedVolumesInfo,
      ports,
    };

    onCreate(newContainer);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <div className="relative h-full flex flex-col">
        <div className="sticky top-4 bg-white z-10 pb-4 border-b">
          <h2 className="text-2xl font-bold text-center">Create Container</h2>
        </div>

        <div className="flex-grow overflow-y-auto px-4 pt-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Container Name (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter container name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-grey_2 rounded-lg focus:outline-none focus:ring-2 focus:ring-grey_4"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Select Image
            </label>
            <select
              value={selectedImage}
              onChange={handleImageChange}
              className="w-full p-3 border border-grey_2 rounded-lg focus:outline-none focus:ring-2 focus:ring-grey_4"
            >
              <option value="" hidden>
                Select an Image
              </option>
              {images
                .filter((image) => image.RepoTags && image.RepoTags.length > 0)
                .map((image) => (
                  <option key={image.Id} value={image.Id}>
                    {image.Labels?.['com.docker.compose.project'] || 'N/A'} (
                    {image.RepoTags[0]})
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Select Volumes
            </label>
            <div className="max-h-32 overflow-y-auto border border-grey_2 p-3 rounded-lg">
              {volumes.length > 0 ? (
                volumes.map((volume) => (
                  <div key={volume.Id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`volume-${volume.id}`}
                      value={volume.Name}
                      checked={selectedVolumes.includes(volume.Name)}
                      onChange={() => handleVolumeChange(volume, volume.Name)}
                      className="mr-2"
                    />
                    <label htmlFor={`volume-${volume.Id}`}>
                      {volume.Name} ({volume.Driver})
                    </label>
                  </div>
                ))
              ) : (
                <p>No volumes available</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Ports</label>
            <input
              type="text"
              placeholder="80:80,443:443"
              value={ports}
              onChange={(e) => setPorts(e.target.value)}
              className="w-full p-3 border border-grey_2 rounded-lg focus:outline-none focus:ring-2 focus:ring-grey_4"
            />
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
              {availableNetworks && availableNetworks.length > 0 ? (
                availableNetworks.map((net) => (
                  <option key={net.Id} value={net.Name}>
                    {net.Name} (IP:{' '}
                    {net.IPAM?.Config?.[0]?.Gateway || 'IP 없음'})
                  </option>
                ))
              ) : (
                <option disabled>네트워크가 없습니다.</option>
              )}
            </select>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white py-4 pr-4 flex justify-end space-x-4 border-t">
          <Button title="취소" onClick={onClose} color="grey" />
          <Button title="생성" onClick={handleSave} />
        </div>
      </div>
    </Dialog>
  );
};

export default ContainerModal;
