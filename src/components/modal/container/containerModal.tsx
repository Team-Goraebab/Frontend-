'use client';

import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
  const [network, setNetwork] = useState<string>('bridge');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedImageInfo, setSelectedImageInfo] = useState<any | null>(null);

  // 이미지 및 볼륨 데이터를 가져오는 함수
  const loadData = async () => {
    try {
      const volumeData = await fetchData('/api/volume/list');
      const imageData = await fetchData('/api/image/list');
      setVolumes(volumeData.Volumes || []);
      setImages(imageData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
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

    // 이미지 전체 정보 찾기 및 저장
    const selectedImageData = images.find(
      (img) => img.Id === selectedImageName
    );
    setSelectedImageInfo(selectedImageData || null);
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
      image: imageNameWithTag, // 필수: 컨테이너의 이미지를 지정
      name,
      network, // 선택: 네트워크 설정 (기본값: bridge)
      volume: selectedVolumesInfo, // 선택: 볼륨 설정
      ports, // 선택: 포트 설정
    };

    onCreate(newContainer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-32">
      <div className="bg-white p-6 rounded-md shadow-lg w-2/5">
        <h2 className="text-lg font-semibold mb-4">Create Container</h2>
        <input
          type="text"
          placeholder="Container Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />

        {/* 이미지 선택 드롭다운 */}
        <p className="font-semibold mb-2 mt-2">Select an Image:</p>
        <select
          value={selectedImage}
          onChange={handleImageChange}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
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

        {/* 볼륨 선택 체크박스 */}
        <p className="font-semibold mb-2 mt-2">Select Volumes:</p>
        <div className="mb-4 max-h-24 overflow-y-auto border p-2 rounded">
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
            <div>No volumes available</div>
          )}
        </div>
        <input
          type="text"
          placeholder="Ports (e.g., 80:80,443:443)"
          value={ports}
          onChange={(e) => setPorts(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Network"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <div className="flex justify-end space-x-2 pt-8">
          <Button title={'Cancel'} onClick={onClose} color="grey" />
          <Button title={'Create'} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default ContainerModal;
