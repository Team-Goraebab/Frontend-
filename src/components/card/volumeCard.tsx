'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal, OptionModal } from '@/components';
import { getStatusColors } from '@/utils/statusColorsUtils';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { formatDateTime } from '@/utils/formatTimestamp';
import { fetchData } from '@/services/apiUtils';
import VolumeDetailModal from '../modal/volume/volumeDetailModal';

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

/**
 * @param data 볼륨 데이터
 * @returns 볼륨 카드 UI
 */
const VolumeCard = ({ data, onDeleteSuccess }: VolumeCardProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { bg1, bg2 } = getStatusColors('primary');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const volumeItems = [
    { label: 'NAME', value: data.Name },
    { label: 'CREATED', value: formatDateTime(data.CreatedAt) },
    { label: 'MOUNT POINT', value: data.Mountpoint },
    { label: 'CAPACITY', value: data.Scope },
    {
      label: 'CONTAINERS',
      value:
        (data.connectedContainers || [])
          .map((container) => `${container.name} (${container.ip})`)
          .join(', ') || 'No connected',
    },
  ];

  const handleOptionClick = () => {
    setShowOptions(!showOptions);
  };

  const handleDelete = () => {
    setShowModal(true);
    setShowOptions(false);
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
          '#254b7a'
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
      {
        showSnackbar(
          enqueueSnackbar,
          `볼륨 삭제 요청 중 에러: ${error}`,
          'error',
          '#FF4853'
        );
      }
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
      console.log('볼륨 상세 정보:', volumeDetail);
      setDetailData(volumeDetail);
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
                onBottomHandler={handleDelete}
                btnVisible={false}
              />
            </div>
          )}
        </div>
        {volumeItems.map((item, index) => (
          <div key={index} className="flex items-center mt-[5px] space-x-3.5">
            <span
              className="text-xs py-1 w-[75px] rounded-md font-bold text-center"
              style={{ backgroundColor: bg1, color: bg2 }}
            >
              {item.label}
            </span>
            <span className="font-semibold text-xs truncate max-w-[130px]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
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
