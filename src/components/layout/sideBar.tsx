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

const Sidebar = ({ progress }: SidebarProps) => {
  const { activeId } = useMenuStore();
  const [networkData, setNetworkData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [containerData, setContainerData] = useState<any[]>([]);
  const [imageData, setImageData] = useState<any[]>([]);

  // API에서 데이터를 로드하는 함수들
  const loadVolumeData = async () => {
    const data = await fetchData('/api/volume/list');
    setVolumeData(data?.Volumes || []);
    console.log('볼륨 정보 :::', data);
  };

  const loadNetworkData = async () => {
    const data = await fetchData('/api/network/list');
    setNetworkData(data || []);
    console.log('네트워크 정보 :::', data);
  };

  const loadContainerData = async () => {
    const data = await fetchData('/api/container/list');
    setContainerData(data || []);
    console.log('컨테이너 정보 :::', data);
  };

  const loadImageData = async () => {
    const data = await fetchData('/api/image/list');
    setImageData(data || []);
    console.log('이미지 정보 :::', data);
  };

  // 데이터를 관리하는 핸들러 매핑
  const dataHandlers: Record<1 | 2 | 3 | 4, DataHandlerType> = {
    1: { data: containerData, setData: setContainerData },
    2: { data: imageData, setData: setImageData },
    3: { data: networkData, setData: setNetworkData },
    4: { data: volumeData, setData: setVolumeData },
  };

  const handleCreate = (newItem: any) => {
    if (dataHandlers[activeId as 1 | 2 | 3 | 4]) {
      const { setData } = dataHandlers[activeId as 1 | 2 | 3 | 4];
      setData((prevData) => [...prevData, newItem]);
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
    if (activeId === 1) {
      loadContainerData();
    } else if (activeId === 2) {
      loadImageData();
    } else if (activeId === 3) {
      loadNetworkData();
    } else if (activeId === 4) {
      loadVolumeData();
    }
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
    if (activeId === 1) {
      loadContainerData();
    } else if (activeId === 2) {
      loadImageData();
    } else if (activeId === 3) {
      loadNetworkData();
    } else if (activeId === 4) {
      loadVolumeData();
    }
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
