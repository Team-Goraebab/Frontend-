'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal, OptionModal } from '@/components';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { selectedHostStore } from '@/store/seletedHostStore';
import { getStatusColors } from '@/utils/statusColorsUtils';
import { formatDateTime } from '@/utils/formatTimestamp';
import { fetchData } from '@/services/apiUtils';
import NetworkDetailModal from '../modal/network/networkDetailModal';

interface NetworkProps {
  Id: string;
  Name: string;
  Created: string;
  Driver: string;
  Containers: { [key: string]: { Name: string; IPv4Address: string } };
  IPAM?: { Config?: { Subnet: string; Gateway: string }[] };
}

interface CardDataProps {
  data: NetworkProps;
  onDeleteSuccess: () => void;
}

/**
 * @param data 네트워크 데이터
 * @returns 네트워크 카드 컴포넌트
 */
const NetworkCard = ({ data, onDeleteSuccess }: CardDataProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { selectedHostId } = selectedHostStore();
  const { bg1, bg2 } = getStatusColors('primary');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const addConnectedBridgeId = selectedHostStore(
    (state) => state.addConnectedBridgeId
  );

  const connectedContainers = Object.values(data.Containers || {}).map(
    (container) => `${container.Name} (${container.IPv4Address})`
  );

  // Subnet과 Gateway 정보 가져오기
  const subnet = data.IPAM?.Config?.[0]?.Subnet || 'No Subnet';
  const gateway = data.IPAM?.Config?.[0]?.Gateway || 'No Gateway';

  const networkItems = [
    { label: 'NAME', value: data.Name },
    { label: 'CREATED', value: formatDateTime(data.Created) },
    { label: 'DRIVER', value: data.Driver },
    { label: 'SUBNET', value: subnet },
    { label: 'GATEWAY', value: gateway },
    {
      label: 'CONTINAERS',
      value:
        connectedContainers.length > 0
          ? connectedContainers.join(', ')
          : 'No connected',
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
      const res = await fetch('/api/network/delete', {
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
          '네트워크가 성공적으로 삭제되었습니다!',
          'success',
          '#254b7a'
        );
        onDeleteSuccess();
      } else {
        showSnackbar(
          enqueueSnackbar,
          `네트워크 삭제 실패: ${result.error}`,
          'error',
          '#FF4853'
        );
      }
    } catch (error) {
      console.error('네트워크 삭제 요청 중 에러:', error);
      {
        showSnackbar(
          enqueueSnackbar,
          `네트워크 삭제 요청 중 에러: ${error}`,
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

  const handleConnect = () => {
    if (selectedHostId) {
      const networkInfo = {
        id: data.Id,
        name: data.Name,
        gateway: gateway,
        subnet: subnet,
        driver: data.Driver,
        connectedContainers: Object.entries(data.Containers).map(
          ([id, container]) => ({
            id,
            name: container.Name,
            ip: container.IPv4Address,
          })
        ),
      };

      addConnectedBridgeId(selectedHostId, networkInfo);
      console.log('Host selected and network connected');
    } else {
      showSnackbar(
        enqueueSnackbar,
        '호스트를 선택해주세요.',
        'error',
        '#FF4853'
      );
      console.log('호스트를 선택하세요');
    }
    setShowOptions(false);
  };

  const fetchNetworkDetail = async (id: string) => {
    try {
      const data = await fetchData(`/api/network/detail?id=${id}`);
      if (!data) {
        throw new Error('Failed to fetch network detail');
      }
      return data;
    } catch (error) {
      console.error('Error fetching network detail:', error);
      throw error;
    }
  };

  const handleGetInfo = async () => {
    try {
      const networkDetail = await fetchNetworkDetail(data.Id);
      console.log('네트워크 상세 정보:', networkDetail);
      setDetailData(networkDetail);
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
                onMiddleHandler={handleConnect}
                onBottomHandler={handleDelete}
              />
            </div>
          )}
        </div>
        {networkItems.map((item, index) => (
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
        question={`네트워크 [${data.Name}]을 삭제하시겠습니까?`}
      />
      <NetworkDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={detailData}
      />
    </div>
  );
};

export default NetworkCard;
