'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal, OptionModal } from '@/components';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { useSelectedNetworkStore } from '@/store/selectedNetworkStore';
import { useContainerStore } from '@/store/containerStore';
import { useStore } from '@/store/cardStore';
import { selectedHostStore } from '@/store/seletedHostStore';
import { getStatusColors } from '@/utils/statusColorsUtils';
import { AiOutlineUp, AiOutlineDown, AiOutlineFileText } from 'react-icons/ai';
import { formatTimestamp } from '@/utils/formatTimestamp';
import { fetchData } from '@/services/apiUtils';
import ContainerDetailModal from '../modal/container/containerDetailModal';
import LogModal from '../modal/container/logModal';

interface CardDataProps {
  data: any;
  onSelectNetwork?: (networkName: string) => void;
  onDeleteSuccess: () => void;
}

/**
 * ContainerCard: 컨테이너 정보를 표시하는 컴포넌트
 * @param data 컨테이너 정보
 * @param selectedHostId 선택한 호스트 id
 * @param selectedHostName 선택한 호스트 name
 * @returns JSX.Element
 */
const ContainerCard = ({ data, onDeleteSuccess }: CardDataProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { selectedNetwork } = useSelectedNetworkStore();
  const { selectedHostId, selectedHostName } = selectedHostStore();
  const addContainerToHost = useStore((state) => state.addContainerToHost);

  const cardRef = useRef<HTMLDivElement>(null);
  const { bg1, bg2 } = getStatusColors(data.State);

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<boolean>(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const { assignImageToContainer, assignNetworkToContainer } =
    useContainerStore();

  const containerName = data.Names ? data.Names[0].replace(/^\//, '') : 'N/A';
  const imageName = data.Image || 'N/A';

  const items = [
    { label: 'NAME', value: containerName },
    { label: 'CREATED', value: formatTimestamp(data.Created) || 'N/A' },
    { label: 'IMAGE', value: imageName },
    { label: 'NETWORK', value: data?.HostConfig?.NetworkMode || 'N/A' },
    { label: 'STATUS', value: data.Status || 'N/A' },
  ];

  const handleOptionClick = () => {
    setShowOptions(!showOptions);
  };

  const handleLogsClick = () => {
    setIsLogModalOpen(true);
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
        '#254b7a'
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

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch('/api/container/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: data.Id }),
      });
      const result = await res.json();
      if (res.ok) {
        showSnackbar(
          enqueueSnackbar,
          '컨테이너가 성공적으로 삭제되었습니다!',
          'success',
          '#254b7a'
        );
        onDeleteSuccess();
      } else {
        showSnackbar(
          enqueueSnackbar,
          `컨테이너 삭제 실패: ${result.error}`,
          'error',
          '#FF4853'
        );
      }
    } catch (error) {
      console.error('컨테이너 삭제 중 에러:', error);
      {
        showSnackbar(
          enqueueSnackbar,
          `컨테이너 삭제 요청 중 에러: ${error}`,
          'error',
          '#FF4853'
        );
      }
    } finally {
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleVolumeDropdown = () => {
    setIsVolumeOpen(!isVolumeOpen);
  };

  const fetchContainerDetail = async (id: string) => {
    try {
      const data = await fetchData(`/api/container/detail?id=${id}`);
      if (!data) {
        throw new Error('Failed to fetch container detail');
      }
      return data;
    } catch (error) {
      console.error('Error fetching container detail:', error);
      throw error;
    }
  };

  const handleGetInfo = async () => {
    try {
      const containerDetail = await fetchContainerDetail(data.Id);
      console.log('컨테이너 상세 정보:', containerDetail);
      setDetailData(containerDetail);
      setShowOptions(false);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
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
        <div className="flex justify-between text-grey_4 text-sm mb-3 relative">
          <span className={'flex font-pretendard font-bold text-grey_6 pt-2'}>
            {data.Labels?.['com.docker.compose.project'] || 'Unknown Project'}{' '}
            <AiOutlineFileText
              className="cursor-pointer text-blue_500 ml-2"
              size={18}
              onClick={handleLogsClick}
              title="View Logs"
            />
          </span>
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
        {/* 볼륨 드롭다운 */}
        <div className="flex items-center mt-2">
          <p
            className="text-xs py-1 w-[65px] h-6 mr-2 rounded-md font-bold text-center flex-shrink-0"
            style={{ backgroundColor: bg1, color: bg2 }}
          >
            VOLUME
          </p>
          <button
            onClick={toggleVolumeDropdown}
            className="flex w-full text-xs font-semibold text-left text-grey_6"
          >
            <div className="flex w-full items-center justify-between pb-2 pl-1">
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
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        question={`컨테이너를 삭제하시겠습니까?`}
      />
      <ContainerDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={detailData}
      />
      <LogModal
        open={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        containerId={data.Id}
        containerName={containerName}
      />
    </div>
  );
};

export default ContainerCard;
