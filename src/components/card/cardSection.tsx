'use client';

import React from 'react';
import { CardContainer, ConnectBar, HostCard } from '@/components';
import { HostCardProps } from './hostCard';
import Draggable from 'react-draggable';
import { useStore } from '@/store/cardStore';
import { selectedHostStore } from '@/store/seletedHostStore';
import { useHostStore } from '@/store/hostStore';
import { useSelectedNetworkStore } from '@/store/selectedNetworkStore';

interface CardSectionProps {
  hostData: HostCardProps[];
  isHandMode: boolean;
}

/**
 *
 * @param hostData 호스트 데이터
 * @param isHandMode 손 동작 모드
 * @returns
 */
const CardSection = ({ hostData, isHandMode }: CardSectionProps) => {
  const {
    selectedHostId,
    setSelectedHostId,
    selectedHostName,
    setSelectedHostName,
    connectedBridgeIds,
    deleteConnectedBridgeId,
  } = selectedHostStore();
  const { selectedNetwork, setSelectedNetwork, clearSelectedNetwork } =
    useSelectedNetworkStore();

  const allContainers = useStore((state) => state.hostContainers);
  const deleteNetwork = useHostStore((state) => state.deleteNetwork);

  const handleHostClick = (id: string, name: string) => {
    setSelectedHostId(selectedHostId === id ? null : id);
    setSelectedHostName(selectedHostName === name ? null : name); // 호스트 이름 저장
    clearSelectedNetwork(); // 새로운 호스트 선택 시 네트워크 선택 해제
  };

  const handleDeleteNetwork = (hostId: string, networkName: string) => {
    if (
      selectedNetwork?.hostId === hostId &&
      selectedNetwork?.networkName === networkName
    ) {
      clearSelectedNetwork(); // 네트워크 삭제 시 선택된 네트워크 해제
    }
    deleteNetwork(hostId, networkName);
    deleteConnectedBridgeId(hostId, networkName);
  };

  const handleSelectNetwork = (hostId: string, networkName: string) => {
    if (
      selectedNetwork?.hostId === hostId &&
      selectedNetwork?.networkName === networkName
    ) {
      clearSelectedNetwork(); // 이미 선택된 네트워크를 다시 클릭하면 선택 해제
    } else {
      setSelectedNetwork(hostId, networkName); // 새로운 네트워크 선택
      setSelectedHostId(hostId); // 네트워크를 선택하면 해당 호스트도 자동 선택
    }
  };

  console.log(hostData);

  return (
    <Draggable disabled={!isHandMode}>
      <div
        className="flex flex-col items-center"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {hostData.map((host) => {
          const containers = allContainers[host.id] || [];
          const networks = connectedBridgeIds[host.id] || [];
          const isHostSelected =
            selectedNetwork?.hostId === host.id || selectedHostId === host.id;
          console.log(networks);
          return (
            <div key={host.id} className="flex flex-col items-center">
              <div className="flex flex-row items-center">
                {networks.length > 0 && (
                  <div className="flex items-center">
                    <CardContainer
                      networkName={networks[0].name}
                      networkIp={networks[0].gateway}
                      containers={containers}
                      themeColor={host.themeColor}
                      onDelete={() =>
                        handleDeleteNetwork(host.id, networks[0].name)
                      }
                      onSelectNetwork={() =>
                        handleSelectNetwork(host.id, networks[0].name)
                      }
                      isSelected={
                        selectedNetwork?.hostId === host.id &&
                        selectedNetwork?.networkName === networks[0].name
                      }
                    />
                    <ConnectBar rotate={180} themeColor={host.themeColor} />
                  </div>
                )}

                <HostCard
                  id={host.id}
                  hostNm={host.hostNm}
                  hostIp={host.hostIp}
                  isRemote={host.isRemote}
                  onClick={() => handleHostClick(host.id, host.hostNm)}
                  themeColor={host.themeColor}
                  className={isHostSelected ? 'scale-105 border-blue-500' : ''}
                  isSelectedNetwork={isHostSelected}
                />

                {networks.length > 1 && (
                  <div className="flex items-center">
                    <ConnectBar themeColor={host.themeColor} />
                    <CardContainer
                      networkName={networks[1].name}
                      networkIp={networks[1].gateway}
                      containers={containers}
                      themeColor={host.themeColor}
                      onDelete={() =>
                        handleDeleteNetwork(host.id, networks[1].name)
                      }
                      onSelectNetwork={() =>
                        handleSelectNetwork(host.id, networks[1].name)
                      }
                      isSelected={
                        selectedNetwork?.hostId === host.id &&
                        selectedNetwork?.networkName === networks[1].name
                      }
                    />
                  </div>
                )}
              </div>
              {networks.length > 2 && (
                <div className="flex flex-col items-center">
                  <ConnectBar
                    rotate={90}
                    themeColor={host.themeColor}
                    length={'long'}
                  />
                  <CardContainer
                    networkName={networks[2].name}
                    networkIp={networks[2].gateway}
                    containers={containers}
                    themeColor={host.themeColor}
                    onDelete={() =>
                      handleDeleteNetwork(host.id, networks[2].name)
                    }
                    onSelectNetwork={() =>
                      handleSelectNetwork(host.id, networks[2].name)
                    }
                    isSelected={
                      selectedNetwork?.hostId === host.id &&
                      selectedNetwork?.networkName === networks[2].name
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Draggable>
  );
};

export default CardSection;
