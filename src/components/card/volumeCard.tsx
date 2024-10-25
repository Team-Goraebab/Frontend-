import React, { useState, useRef } from 'react';
import { Modal } from '@/components';
import { getStatusColors } from '@/utils/statusColorsUtils';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { formatDateTime } from '@/utils/formatTimestamp';
import { fetchData } from '@/services/apiUtils';
import VolumeDetailModal from '../modal/volume/volumeDetailModal';
import {
  FiInfo,
  FiTrash,
  FiHardDrive,
  FiCpu,
  FiCalendar,
  FiDisc,
  FiBox,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';

interface VolumeProps {
  id: string;
  Name: string;
  CreatedAt: string;
  Driver: string;
  Mountpoint: string;
  Scope: string;
  status: string;
  connectedContainers?: {
    id: string;
    name: string;
    ip: string;
    status: string;
  }[];
}

interface VolumeCardProps {
  data: VolumeProps;
  onDeleteSuccess: () => void;
}

const VolumeCard = ({ data, onDeleteSuccess }: VolumeCardProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { bg1, bg2 } = getStatusColors('primary');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const volumeItems = [
    { label: 'NAME', value: data.Name, icon: FiCpu },
    {
      label: 'CREATED',
      value: formatDateTime(data.CreatedAt),
      icon: FiCalendar,
    },
    { label: 'MOUNT POINT', value: data.Mountpoint, icon: FiHardDrive },
    { label: 'CAPACITY', value: data.Scope, icon: FiDisc },
    {
      label: 'CONTAINERS',
      value:
        (data.connectedContainers || [])
          .map((container) => `${container.name} (${container.ip})`)
          .join(', ') || 'No connected',
      icon: FiBox,
    },
  ];

  const handleDelete = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/volume/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: data.Name }),
      });
      const result = await res.json();
      if (res.ok) {
        showSnackbar(
          enqueueSnackbar,
          '볼륨이 성공적으로 삭제되었습니다!',
          'success',
          '#4CAF50'
        );
        onDeleteSuccess();
      } else {
        showSnackbar(
          enqueueSnackbar,
          `볼륨 삭제 실패: ${result.error}`,
          'error',
          '#FF4853'
        );
      }
    } catch (error) {
      console.error('볼륨 삭제 중 에러:', error);
      showSnackbar(
        enqueueSnackbar,
        `볼륨 삭제 요청 중 에러: ${error}`,
        'error',
        '#FF4853'
      );
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchVolumeDetail = async (name: string) => {
    try {
      const data = await fetchData(`/api/volume/detail?name=${name}`);
      if (!data) {
        throw new Error('Failed to fetch volume detail');
      }
      return data;
    } catch (error) {
      console.error('Error fetching volume detail:', error);
      throw error;
    }
  };

  const handleGetInfo = async () => {
    try {
      const volumeDetail = await fetchVolumeDetail(data.Name);
      setDetailData(volumeDetail);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={cardRef}
      className="relative bg-white border rounded-lg transition-all duration-300 mb-2 overflow-hidden"
    >
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center space-x-2 truncate">
          <span className="font-pretendard text-sm font-bold text-grey_6 truncate">
            {data.Name}
          </span>
        </div>
        <div className="flex">
          <button
            onClick={handleGetInfo}
            className="p-2 rounded-full hover:bg-grey_1 transition-colors"
            title="Volume Info"
          >
            <FiInfo className="text-grey_4" size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full hover:bg-grey_1 transition-colors"
            title="Delete Volume"
          >
            <FiTrash className="text-grey_4" size={16} />
          </button>
          <button
            onClick={toggleAccordion}
            className="p-2 rounded-full hover:bg-grey_1 transition-colors"
            title="Toggle Details"
          >
            {isExpanded ? (
              <FiChevronUp size={16} className="text-grey_4" />
            ) : (
              <FiChevronDown size={16} className="text-grey_4" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="grid gap-4">
            {volumeItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: bg1 }}
                >
                  <item.icon size={16} style={{ color: bg2 }} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-grey_4 font-medium font-pretendard">
                    {item.label}
                  </span>
                  <span className="font-pretendard font-semibold text-sm text-grey_7 truncate max-w-[150px]">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        question={`볼륨 [${data.Name}]을 삭제하시겠습니까?`}
      />
      <VolumeDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={detailData}
      />
    </div>
  );
};

export default VolumeCard;
