'use client';

import React, { useState, useEffect } from 'react';
import AddBridgeButton from '../button/addBridgeButton';
import NetworkCard from '../card/networkCard';
import VolumeCard from '../card/volumeCard';
import AddVolumeButton from '../button/addVolumeButton';
import AddContainerButton from '../button/addContainerButton';
import AddImageButton from '../button/addImageButton';
import { useMenuStore } from '@/store/menuStore';
import ImageCard from '../card/imageCard';
import ContainerCard from '../card/containerCard';
import DaemonConnectBar from '../bar/daemonConnectBar';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import LargeButton from '../button/largeButton';
import { fetchData } from '@/services/apiUtils';

interface SidebarProps {
  progress: number;
}

type DataHandlerType = {
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
};

// activeId와 API 경로를 미리 매핑한 객체
const apiMap: Record<number, { url: string; dataKey?: string }> = {
  1: { url: '/api/container/list' },
  2: { url: '/api/image/list' },
  3: { url: '/api/network/list' },
  4: { url: '/api/volume/list', dataKey: 'Volumes' },
};

// 데이터를 로드하는 함수
const loadData = async (
  apiUrl: string,
  setData: React.Dispatch<React.SetStateAction<any[]>>,
  dataKey?: string
) => {
  try {
    const data = await fetchData(apiUrl);
    setData(dataKey ? data?.[dataKey] || [] : data || []);
    console.log(`${dataKey || '데이터'} 정보 :::`, data);
  } catch (error) {
    console.error(`${dataKey || '데이터'} 로드 중 에러 발생:`, error);
  }
};

const Sidebar = ({ progress }: SidebarProps) => {
  const { activeId } = useMenuStore();
  const [networkData, setNetworkData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [containerData, setContainerData] = useState<any[]>([]);
  const [imageData, setImageData] = useState<any[]>([]);

  // 데이터를 관리하는 핸들러 매핑
  const dataHandlers: Record<1 | 2 | 3 | 4, DataHandlerType> = {
    1: { data: containerData, setData: setContainerData },
    2: { data: imageData, setData: setImageData },
    3: { data: networkData, setData: setNetworkData },
    4: { data: volumeData, setData: setVolumeData },
  };

  const handleCreate = async (newItem: any) => {
    try {
      const { url, dataKey } = apiMap[activeId] || {};
      if (!url) return;

      // 새로운 데이터를 로드하여 업데이트
      await loadData(
        url,
        dataHandlers[activeId as 1 | 2 | 3 | 4].setData,
        dataKey
      );

      // 3초 지연 후 다시 데이터 로드
      setTimeout(() => {
        loadData(url, dataHandlers[activeId as 1 | 2 | 3 | 4].setData, dataKey);
      }, 2000);
    } catch (error) {
      console.error('데이터 로드 중 에러 발생:', error);
    }
  };

  const componentMap = {
    1: {
      addButton: AddContainerButton,
      cardComponent: ContainerCard,
      noDataMessage: '컨테이너를 추가하세요',
    },
    2: {
      addButton: AddImageButton,
      cardComponent: ImageCard,
      noDataMessage: '이미지를 추가하세요',
    },
    3: {
      addButton: AddBridgeButton,
      cardComponent: NetworkCard,
      noDataMessage: '네트워크 데이터를 추가하세요',
    },
    4: {
      addButton: AddVolumeButton,
      cardComponent: VolumeCard,
      noDataMessage: '볼륨 데이터를 추가하세요',
    },
  };

  const currentComponent = componentMap[activeId as 1 | 2 | 3 | 4];

  // No data 메시지 표시 함수
  const renderNoDataMessage = (message: string) => (
    <div className="flex flex-col items-center justify-center text-center p-4 border border-dashed border-blue_3 rounded-md bg-blue_0">
      <AiOutlineInfoCircle className="text-blue_6 text-2xl mb-2" />
      <p className="font-pretendard font-medium text-blue_6">{message}</p>
    </div>
  );

  const handleDeleteSuccess = () => {
    const { url, dataKey } = apiMap[activeId] || {};
    if (!url) return;
    loadData(url, dataHandlers[activeId as 1 | 2 | 3 | 4].setData, dataKey);
  };

  // 데이터를 렌더링하는 함수
  const renderDataList = () => {
    if (!currentComponent) return null;

    const { cardComponent: CardComponent, noDataMessage } = currentComponent;
    const data = dataHandlers[activeId as 1 | 2 | 3 | 4]?.data;

    return data && data.length > 0
      ? data.map((item, index) => (
        <CardComponent
          key={index}
          data={item}
          onDeleteSuccess={handleDeleteSuccess}
        />
      ))
      : renderNoDataMessage(noDataMessage);
  };

  // activeId 변경 시 데이터 로드
  useEffect(() => {
    const { url, dataKey } = apiMap[activeId] || {};
    if (!url) return;
    loadData(url, dataHandlers[activeId as 1 | 2 | 3 | 4].setData, dataKey);
  }, [activeId]);

  return (
    <div className="fixed top-0 left-0 w-[300px] flex flex-col h-full bg-white border-r-2 border-grey_2">
      <div className="flex flex-col flex-grow pl-4 pr-4 pt-20 overflow-y-auto scrollbar-hide">
        <div className="flex-grow">{renderDataList()}</div>
        <div className="flex-shrink-0">
          {currentComponent ? (
            React.createElement(currentComponent.addButton, {
              onCreate: handleCreate,
            })
          ) : (
            <LargeButton title={'추가하기'} onClick={() => {}} />
          )}
        </div>
      </div>
      <div className="">
        <DaemonConnectBar />
      </div>
    </div>
  );
};

export default Sidebar;
