'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal, OptionModal } from '@/components';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { useSelectedNetworkStore } from '@/store/selectedNetworkStore';
import { useContainerStore } from '@/store/containerStore';
import { Volume, Image } from '@/types/type';
import { useStore } from '@/store/cardStore';
import { selectedHostStore } from '@/store/seletedHostStore';
import { getStatusColors } from '@/utils/statusColorsUtils';
import { AiOutlineUp, AiOutlineDown } from 'react-icons/ai';

interface CardProps {
  id: string;
  name: string;
  ip: string;
  size: string;
  tag: string;
  active: string;
  status: string;
  image: Image;
  volume?: Volume[];
  network?: string;
}

interface CardDataProps {
  data: any;
  onSelectNetwork?: (networkName: string) => void;
}

/**
 * ContainerCard: 컨테이너 정보를 표시하는 컴포넌트
 * @param data 컨테이너 정보
 * @param selectedHostId 선택한 호스트 id
 * @param selectedHostName 선택한 호스트 name
 * @returns JSX.Element
 */
const ContainerCard = ({ data }: CardDataProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { selectedNetwork } = useSelectedNetworkStore();
  const { selectedHostId, selectedHostName } = selectedHostStore();
  const addContainerToHost = useStore((state) => state.addContainerToHost);

  const cardRef = useRef<HTMLDivElement>(null);
  const { bg1, bg2 } = getStatusColors(data.status || 'primary');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState<boolean>(false);
  const [isImageOpen, setIsImageOpen] = useState<boolean>(false);
  const { assignImageToContainer, assignNetworkToContainer } =
    useContainerStore();

  // 컨테이너 이름은 'Names' 배열에서 추출합니다.
  const containerName = data.Names ? data.Names[0] : 'N/A';

  // 이미지 정보는 'RepoTags' 또는 'Image' 필드에서 추출
  const imageName = data.Image || 'N/A';
  const imageID = data.ImageID || 'N/A'; // 필요시 추가 가능

  const items = [
    { label: 'ID', value: data.Id },
    { label: 'NAME', value: containerName },
    { label: 'IMAGE', value: imageName },
    { label: 'NETWORK', value: data.HostConfig.NetworkMode || 'N/A' },
    { label: 'STATE', value: data.State || 'N/A' },
    { label: 'STATUS', value: data.Status || 'N/A' },
  ];

  const handleOptionClick = () => {
    setShowOptions(!showOptions);
  };

  const handleGetInfo = () => {
    console.log('정보 가져오기 클릭됨');
    setShowOptions(false);
  };

  const handleRun = () => {
    if (!selectedNetwork) {
      showSnackbar(
        enqueueSnackbar,
        '네트워크를 선택해주세요.',
        'error',
        '#FF4853'
      );
      return;
    }

    if (selectedHostId) {
      const newContainer = {
        id: uuidv4(),
        name: containerName,
        ip: data.ip,
        size: data.size,
        tag: data.Image?.tag || 'latest',
        active: data.active,
        status: 'running',
        network: selectedNetwork.networkName,
        image: data.image,
        mounts: data.Mounts || [],
      };

      addContainerToHost(selectedHostId, newContainer);

      if (data.image) {
        assignImageToContainer(newContainer.id, data.image);
      } else {
        console.warn('Image information is missing for the container.');
      }

      assignNetworkToContainer(newContainer.id, selectedNetwork.hostId);

      showSnackbar(
        enqueueSnackbar,
        `호스트 ${selectedHostName}의 ${selectedNetwork.networkName} 네트워크에서 컨테이너가 실행되었습니다.`,
        'success',
        '#4C48FF'
      );
    } else {
      showSnackbar(
        enqueueSnackbar,
        '호스트를 선택해주세요.',
        'error',
        '#FF4853'
      );
    }
    setShowOptions(false);
  };

  const handleDelete = () => {
    setShowModal(true);
    setShowOptions(false);
  };

  const handleConfirmDelete = () => {
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleVolumeDropdown = () => {
    setIsVolumeOpen(!isVolumeOpen);
  };

  const toggleImageDropdown = () => {
    setIsImageOpen(!isImageOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cardRef]);

  return (
    <div
      ref={cardRef}
      className="relative flex items-start px-3 pt-1 pb-3 bg-grey_0 shadow rounded-lg mb-4"
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-lg"
        style={{ backgroundColor: bg2 }}
      />
      <div className="ml-4 flex flex-col w-full">
        {/* Option 버튼 */}
        <div className="flex justify-end text-grey_4 text-sm mb-3 relative">
          <span
            className="font-semibold text-xs cursor-pointer"
            onClick={handleOptionClick}
          >
            •••
          </span>
          {showOptions && (
            <div className="absolute top-4 left-16">
              <OptionModal
                onTopHandler={handleGetInfo}
                onMiddleHandler={handleRun}
                onBottomHandler={handleDelete}
              />
            </div>
          )}
        </div>
        {/* 컨테이너 정보 */}
        {items.map((item, index) => (
          <div key={index} className="flex items-center mt-[5px] space-x-3.5">
            <span
              className="text-xs py-1 w-[65px] rounded-md font-bold text-center"
              style={{ backgroundColor: bg1, color: bg2 }}
            >
              {item.label}
            </span>
            <span className="font-semibold text-xs truncate max-w-[150px]">
              {item.value}
            </span>
          </div>
        ))}

        {/* 이미지 정보 드롭다운 */}
        <div className="flex items-center mt-2">
          <p
            className="text-xs py-1 w-[65px] h-6 mr-2 rounded-md font-bold text-center mb-2 flex-shrink-0"
            style={{ backgroundColor: bg1, color: bg2 }}
          >
            IMAGE
          </p>
          <button
            onClick={toggleImageDropdown}
            className="flex items-center justify-between w-full text-xs font-semibold text-left text-grey_6"
          >
            <div className="flex w-full items-center justify-between pb-2">
              {isImageOpen ? 'Hide Image Info' : 'Show Image Info'}
              {isImageOpen ? <AiOutlineUp /> : <AiOutlineDown />}
            </div>
          </button>
        </div>

        {/* 이미지 정보 드롭다운 내용 */}
        {isImageOpen && (
          <div className="flex flex-col mb-2 p-1 border rounded w-full">
            <p className="text-xs">Image Name: {imageName}</p>
            {/* <p className="text-xs">Image ID: {imageID}</p> */}
          </div>
        )}

        {/* 볼륨 드롭다운 */}
        <div className="flex items-center">
          <p
            className="text-xs py-1 w-[65px] h-6 mr-2 rounded-md font-bold text-center mb-2 flex-shrink-0"
            style={{ backgroundColor: bg1, color: bg2 }}
          >
            VOLUME
          </p>
          <button
            onClick={toggleVolumeDropdown}
            className="flex w-full text-xs font-semibold text-left text-grey_6"
          >
            <div className="flex w-full items-center justify-between pb-2">
              {isVolumeOpen ? 'Hide Volumes' : 'Show Volumes'}
              {isVolumeOpen ? <AiOutlineUp /> : <AiOutlineDown />}
            </div>
          </button>
        </div>

        {/* 볼륨 드롭다운 내용 */}
        {isVolumeOpen && (
          <div className="max-h-42 overflow-y-auto scrollbar-custom w-full flex-grow">
            {data.Mounts?.length > 0 ? (
              data.Mounts.map((mount: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col mb-2 p-1 border rounded w-full"
                >
                  {/* <p className="text-xs font-semibold">{mount.Name || 'N/A'}</p> */}
                  {mount.Driver && (
                    <p className="text-xs">Driver: {mount.Driver}</p>
                  )}
                  {mount.Destination && (
                    <p className="text-xs">Mount: {mount.Destination}</p>
                  )}
                  {mount.Mode && <p className="text-xs">Mode: {mount.Mode}</p>}
                </div>
              ))
            ) : (
              <p className="text-xs text-grey_4">No volumes attached.</p>
            )}
          </div>
        )}
      </div>

      {/* 삭제 모달 */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ContainerCard;
