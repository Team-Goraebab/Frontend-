'use client';

import React, { useState, Dispatch, SetStateAction } from 'react';
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
      icon: '🐳',
    },
    2: {
      addButton: AddImageButton,
      cardComponent: ImageCard,
      noDataMessage: '이미지를 추가하세요',
      icon: '🖼️',
    },
    3: {
      addButton: AddBridgeButton,
      cardComponent: NetworkCard,
      noDataMessage: '네트워크 데이터를 추가하세요',
      icon: '🌐',
    },
    4: {
      addButton: AddVolumeButton,
      cardComponent: VolumeCard,
      noDataMessage: '볼륨 데이터를 추가하세요',
      icon: '💾',
    },
  };

  const currentComponent = componentMap[activeId as 1 | 2 | 3 | 4];
  const renderNoDataMessage = (message: string, icon: string) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-blue-50 rounded-lg">
      <div className="text-4xl mb-4">{icon}</div>
      <p className="font-pretendard font-medium text-blue-600 text-md">{message}</p>
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

    const { cardComponent: CardComponent, noDataMessage, icon } = currentComponent;
    const data =
      activeId === 2 ? images : dataHandlers[activeId as 1 | 2 | 3 | 4]?.data;
    return data && data.length > 0
      ? data.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardComponent
              key={index}
              data={item}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </>
        ))
      : renderNoDataMessage(noDataMessage, icon);
  };

  // activeId 변경 시 데이터 로드
  useEffect(() => {
    const { url, dataKey } = apiMap[activeId] || {};
    if (!url) return;
    loadData(url, dataHandlers[activeId as 1 | 2 | 3 | 4].setData, dataKey);
  }, [activeId]);

  return (
    <div className="fixed left-0 w-[300px] flex flex-col bg-gray-50 border-r border-gray-200 shadow-md z-40 top-[56px] bottom-0">
      <div className="flex-grow overflow-y-auto scrollbar-hide p-4 font-pretendard">
        {renderDataList()}
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        {currentComponent ? (
          React.createElement(currentComponent.addButton, {
            onCreate: handleCreate,
          })
        ) : (
          <LargeButton title={'추가하기'} onClick={() => {}} />
        )}
      </div>
      <div className="w-full h-auto">
        <DaemonConnectBar />
      </div>
    </div>
  );
};

export default Sidebar;
