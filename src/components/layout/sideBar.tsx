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
import DaemonConnectBar from '../bar/daemonConnectBar';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import LargeButton from '../button/largeButton';
import { RxReload } from 'react-icons/rx';
import ContainerCardGroup from '@/components/card/containerCardGroup';
import { selectedHostStore } from '@/store/seletedHostStore';

type DataHandlerType = {
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
};

interface Container {
  Id: string;
  Name: string;
  Labels: {
    'com.docker.compose.project'?: string;
  };

  [key: string]: any;
}

interface ComponentMapItem {
  title: string;
  addButton: React.ComponentType<any>;
  cardComponent?: React.ComponentType<any>;
  noDataMessage: string;
  helpType: string;
}

const loadData = async (
  apiUrl: string,
  setData: React.Dispatch<React.SetStateAction<any[]>>,
  dataKey?: string
) => {
  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    const data = await response.json();
    setData(dataKey ? data?.[dataKey] || [] : data || []);
  } catch (error) {
    throw error;
  }
};

const Sidebar = () => {
  const { activeId } = useMenuStore();
  const selectedHostIp = selectedHostStore((state) => state.selectedHostIp);

  const [networkData, setNetworkData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [containerData, setContainerData] = useState<Container[]>([]);
  const [imageData, setImageData] = useState<any[]>([]);

  const apiMap: Record<number, { url: string; dataKey?: string }> = {
    1: { url: `/api/container/list?hostIp=${selectedHostIp}` },
    2: { url: `/api/image/list?hostIp=${selectedHostIp}` },
    3: { url: `/api/network/list?hostIp=${selectedHostIp}` },
    4: { url: `/api/volume/list?hostIp=${selectedHostIp}`, dataKey: 'Volumes' },
  };

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

      await loadData(
        url,
        dataHandlers[activeId as 1 | 2 | 3 | 4].setData,
        dataKey
      );

      setTimeout(() => {
        loadData(url, dataHandlers[activeId as 1 | 2 | 3 | 4].setData, dataKey);
      }, 2000);
    } catch (error) {
      throw error;
    }
  };

  const componentMap: Record<1 | 2 | 3 | 4, ComponentMapItem> = {
    1: {
      title: '컨테이너',
      addButton: AddContainerButton,
      noDataMessage: '컨테이너를 추가하세요',
      helpType: 'container',
    },
    2: {
      title: '이미지',
      addButton: AddImageButton,
      cardComponent: ImageCard,
      noDataMessage: '이미지를 추가하세요',
      helpType: 'image',
    },
    3: {
      title: '네트워크',
      addButton: AddBridgeButton,
      cardComponent: NetworkCard,
      noDataMessage: '네트워크 데이터를 추가하세요',
      helpType: 'network',
    },
    4: {
      title: '볼륨',
      addButton: AddVolumeButton,
      cardComponent: VolumeCard,
      noDataMessage: '볼륨 데이터를 추가하세요',
      helpType: 'volume',
    },
  };

  const currentComponent = componentMap[activeId as 1 | 2 | 3 | 4];

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

  const renderDataList = () => {
    if (!currentComponent) return null;

    const { cardComponent: CardComponent, noDataMessage } = currentComponent;
    const data = dataHandlers[activeId as 1 | 2 | 3 | 4]?.data;

    if (activeId === 1) {
      const groupedContainers = Array.isArray(containerData)
        ? containerData.reduce((acc, container) => {
            const groupName =
              container.Labels['com.docker.compose.project'] ||
              container.Names[0].replace(/^\//, '');
            if (!acc[groupName]) {
              acc[groupName] = {
                containers: [],
                networkMode: container.HostConfig?.NetworkMode || 'Unknown',
              };
            }
            acc[groupName].containers.push(container);
            return acc;
          }, {} as Record<string, { containers: Container[]; networkMode: string }>)
        : {};

      return Object.entries(groupedContainers).map(
        ([groupName, { containers }]) => (
          <ContainerCardGroup
            key={groupName}
            projectName={groupName}
            containers={containers}
            onDeleteSuccess={handleDeleteSuccess}
          />
        )
      );
    }

    return data && data.length > 0
      ? data.map(
          (item) =>
            CardComponent && (
              <CardComponent
                key={`${item.Id}-${selectedHostIp}`}
                data={item}
                onDeleteSuccess={handleDeleteSuccess}
              />
            )
        )
      : renderNoDataMessage(noDataMessage);
  };

  const refreshData = () => {
    const { url, dataKey } = apiMap[activeId] || {};
    if (!url) return;
    loadData(url, dataHandlers[activeId as 1 | 2 | 3 | 4].setData, dataKey);
  };

  useEffect(() => {
    const { url, dataKey } = apiMap[activeId] || {};
    if (!url) return;

    loadData(url, dataHandlers[activeId as 1 | 2 | 3 | 4].setData, dataKey);

    Object.keys(dataHandlers).forEach((key) => {
      if (Number(key) !== activeId) {
        dataHandlers[Number(key) as 1 | 2 | 3 | 4].setData([]);
      }
    });
  }, [activeId]);

  useEffect(() => {
    setImageData([]);
    refreshData();
  }, [selectedHostIp]);

  return (
    <div className="fixed z-[99] top-0 left-0 w-[300px] flex flex-col h-full bg-white border-r-2 border-grey_2 pt-14">
      <div className="flex justify-between items-center px-6 py-4 bg-grey_0 border-b border-grey_2">
        <h2 className="text-md font-semibold font-pretendard flex items-center">
          {currentComponent?.title || '데이터'}
          <span className="ml-2 px-2 py-1 bg-blue_4 text-white text-xs font-pretendard rounded-lg">
            {dataHandlers[activeId as 1 | 2 | 3 | 4]?.data.length || 0}
          </span>
        </h2>
        <button
          className="text-blue_6 font-bold"
          onClick={refreshData}
          title="새로고침"
        >
          <RxReload size={16} />
        </button>
      </div>
      <div className="flex flex-col flex-grow pl-4 pr-4 pt-4 overflow-y-auto scrollbar-hide">
        <div className="flex-grow">{renderDataList()}</div>
      </div>
      <div className="flex-shrink-0 p-4 border-t">
        {currentComponent ? (
          React.createElement(currentComponent.addButton, {
            onCreate: handleCreate,
          })
        ) : (
          <LargeButton title={'추가하기'} onClick={() => {}} />
        )}
      </div>
      <div>
        <DaemonConnectBar />
      </div>
    </div>
  );
};

export default Sidebar;
