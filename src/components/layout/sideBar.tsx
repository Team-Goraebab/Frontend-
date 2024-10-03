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
import { useImageStore } from '@/store/imageStore';
import DaemonConnectBar from '../bar/daemonConnectBar';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import LargeButton from '../button/largeButton';

interface SidebarProps {
  progress: number;
}

type DataHandlerType = {
  data: any[];
  setData: Dispatch<SetStateAction<any[]>>;
};

const Sidebar = ({ progress }: SidebarProps) => {
  const { activeId } = useMenuStore();
  const images = useImageStore((state) => state.images);

  const [networkData, setNetworkData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [containerData, setContainerData] = useState<any[]>([]);
  const [imageData, setImageData] = useState<any[]>([]);

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

  const renderNoDataMessage = (message: string) => (
    <div className="flex flex-col items-center justify-center text-center p-4 border border-dashed border-blue_3 rounded-md bg-blue_0">
      <AiOutlineInfoCircle className="text-blue_6 text-2xl mb-2" />
      <p className="font-pretendard font-medium text-blue_6">{message}</p>
    </div>
  );

  const renderDataList = () => {
    if (!currentComponent) return null;

    const { cardComponent: CardComponent, noDataMessage } = currentComponent;
    const data =
      activeId === 2 ? images : dataHandlers[activeId as 1 | 2 | 3 | 4]?.data;

    return data && data.length > 0
      ? data.map((item, index) => <CardComponent key={index} data={item} />)
      : renderNoDataMessage(noDataMessage);
  };

  return (
    <div className="fixed left-0 w-[300px] flex flex-col bg-white border-r-2 border-grey_2 z-40 top-[56px] bottom-0">
      <div className="flex-grow overflow-y-auto scrollbar-hide pl-4 pr-4 pt-4">
        {renderDataList()}
      </div>
      <div className="p-4 border-t border-grey_2">
        {currentComponent ? (
          React.createElement(currentComponent.addButton, {
            onCreate: handleCreate,
          })
        ) : (
          <LargeButton title={'추가하기'} onClick={() => {}} />
        )}
        <div className="mt-4">
          <DaemonConnectBar />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
