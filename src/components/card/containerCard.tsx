'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { getStatusColors } from '@/utils/statusColorsUtils';
import { formatTimestamp } from '@/utils/formatTimestamp';
import { fetchData } from '@/services/apiUtils';
import ContainerDetailModal from '../modal/container/containerDetailModal';
import LogModal from '../modal/container/logModal';
import {
  FiActivity, FiAlertCircle,
  FiCalendar, FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiCpu,
  FiFileText, FiGlobe,
  FiHardDrive,
  FiImage, FiInfo,
  FiPauseCircle, FiTrash, FiXCircle,
} from 'react-icons/fi';

interface CardDataProps {
  data: any;
  onSelectNetwork?: (networkName: string) => void;
  onDeleteSuccess: () => void;
}

interface StatusProps {
  state: string;
}

/**
 * ContainerCard: 컨테이너 정보를 표시하는 컴포넌트
 * @param data 컨테이너 정보
 * @param selectedHostId 선택한 호스트 id
 * @returns JSX.Element
 */
const ContainerCard = ({ data, onDeleteSuccess }: CardDataProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const cardRef = useRef<HTMLDivElement>(null);
  const { bg1, bg2 } = getStatusColors(data.State);

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<boolean>(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);


  const containerName = data.Names ? data.Names[0].replace(/^\//, '') : 'N/A';
  const imageName = data.Image || 'N/A';

  const items = [
    { label: 'Name', value: containerName, icon: FiCpu },
    { label: 'Created', value: formatTimestamp(data.Created) || 'N/A', icon: FiCalendar },
    { label: 'Image', value: imageName, icon: FiImage },
    { label: 'Network', value: data?.HostConfig?.NetworkMode || 'N/A', icon: FiGlobe },
    { label: 'Status', value: data.Status || 'N/A', icon: FiActivity },
  ];

  const StatusIcon: React.FC<StatusProps> = ({ state }) => {
    switch (state.toLowerCase()) {
      case 'running':
        return <FiCheckCircle className="text-green_6" size={16} />;
      case 'paused':
        return <FiPauseCircle className="text-yellow_6" size={16} />;
      case 'exited':
        return <FiXCircle className="text-red_6" size={16} />;
      default:
        return <FiAlertCircle className="text-gray-500" size={16} />;
    }
  };

  const StatusText: React.FC<StatusProps> = ({ state }) => {
    const stateColor = {
      running: 'text-green_6',
      paused: 'text-yellow_6',
      exited: 'text-red_6',
      default: 'text-gray-700',
    };

    const color = stateColor[state.toLowerCase() as keyof typeof stateColor] || stateColor.default;

    return <span className={`font-medium font-pretendard text-sm ${color}`}>{state}</span>;
  };

  const handleLogsClick = () => {
    setIsLogModalOpen(true);
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
          '#254b7a',
        );
        onDeleteSuccess();
      } else {
        showSnackbar(
          enqueueSnackbar,
          `컨테이너 삭제 실패: ${result.error}`,
          'error',
          '#FF4853',
        );
      }
    } catch (error) {
      console.error('컨테이너 삭제 중 에러:', error);
      {
        showSnackbar(
          enqueueSnackbar,
          `컨테이너 삭제 요청 중 에러: ${error}`,
          'error',
          '#FF4853',
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
      setDetailData(containerDetail);
      setShowOptions(false);
      setIsModalOpen(true);
    } catch (error) {
      throw error;
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
    <div ref={cardRef} className="relative bg-white border rounded-lg transition-all duration-300 mb-6 overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center space-x-2">
          <StatusIcon state={data.State} />
          <StatusText state={data.State} />
        </div>
        <div className="flex">
          <button
            onClick={handleLogsClick}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            title="View Logs"
          >
            <FiFileText className="text-gray-500" size={16} />
          </button>
          <button
            onClick={handleGetInfo}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            title="Container Info"
          >
            <FiInfo className="text-gray-500" size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            title="Delete Container"
          >
            <FiTrash className="text-gray-500" size={16} />
          </button>
        </div>
      </div>


      <div className="p-4">
        <span className="font-pretendard font-bold text-md text-gray-800 truncate flex-grow">
          {data.Labels?.['com.docker.compose.project'] || 'Unknown Project'}
        </span>
        <div className="grid gap-4 mt-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: bg1 }}>
                <item.icon size={16} style={{ color: bg2 }} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium font-pretendard">{item.label}</span>
                <span className="font-pretendard font-semibold text-sm text-gray-800 truncate max-w-[150px]">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={toggleVolumeDropdown}
            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <FiHardDrive size={16} />
              <span>Volumes</span>
            </div>
            {isVolumeOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>

          {isVolumeOpen && (
            <div
              className="mt-3 space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {data.Mounts?.length > 0 ? (
                data.Mounts.map((mount: {
                  Driver: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined;
                  Destination: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined;
                  Mode: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined;
                }, index: React.Key | null | undefined) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    {mount.Driver && <p className="text-xs text-gray-600">Driver: {mount.Driver}</p>}
                    {mount.Destination && <p className="text-xs text-gray-600">Mount: {mount.Destination}</p>}
                    {mount.Mode && <p className="text-xs text-gray-600">Mode: {mount.Mode}</p>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No volumes attached.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
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
