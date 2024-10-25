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
  FiActivity,
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiCpu,
  FiFileText,
  FiGlobe,
  FiHardDrive,
  FiImage,
  FiInfo,
  FiPauseCircle,
  FiTrash,
  FiXCircle,
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

  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const containerName = data.Names ? data.Names[0].replace(/^\//, '') : 'N/A';
  const imageName = data.Image || 'N/A';

  const items = [
    { label: 'Name', value: containerName, icon: FiCpu },
    {
      label: 'Created',
      value: formatTimestamp(data.Created) || 'N/A',
      icon: FiCalendar,
    },
    { label: 'Image', value: imageName, icon: FiImage },
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
        return <FiAlertCircle className="text-grey_4" size={16} />;
    }
  };

  const StatusText: React.FC<StatusProps> = ({ state }) => {
    const stateColor = {
      running: 'text-green_6',
      paused: 'text-yellow_6',
      exited: 'text-red_6',
      default: 'text-grey_6',
    };

    const color =
      stateColor[state.toLowerCase() as keyof typeof stateColor] ||
      stateColor.default;

    return (
      <span className={`font-medium font-pretendard text-sm ${color}`}>
        {state}
      </span>
    );
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
          '#4CAF50'
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
    <div
      ref={cardRef}
      className="bg-white border rounded-lg mb-2 overflow-hidden"
    >
      <div
        className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2 truncate">
          <StatusIcon state={data.State} />
          <StatusText state={data.State} />
          <span className="font-medium text-sm text-grey_6 truncate">
            {containerName}
          </span>
        </div>
        <div className="flex items-center">
          {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="grid gap-4">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: bg1 }}
                  >
                    <item.icon size={16} style={{ color: bg2 }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-grey_4 font-medium">
                      {item.label}
                    </span>
                    <span className="font-semibold text-sm text-grey_7 truncate max-w-[150px]">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">항목이 없습니다.</div>
            )}
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={handleLogsClick}
              className="p-1 text-blue-600 rounded hover:bg-blue-200 transition-colors text-md"
            >
              <FiFileText />
            </button>
            <button
              onClick={handleGetInfo}
              className="p-1 text-green-600 rounded hover:bg-green-200 transition-colors text-md"
            >
              <FiInfo />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-red-600 rounded hover:bg-red-200 transition-colors text-md"
            >
              <FiTrash />
            </button>
          </div>
        </div>
      )}

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
