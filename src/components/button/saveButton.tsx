'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { AiOutlineSave } from 'react-icons/ai';
import { useBlueprintStore } from '@/store/blueprintStore';
import { createBlueprint } from '@/services/blueprint/api';

const SaveButton = () => {
  const { enqueueSnackbar } = useSnackbar();
  const mappedData = useBlueprintStore((state) => state.mappedData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blueprintName, setBlueprintName] = useState('');
  const [isDockerRemote, setIsDockerRemote] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState('');

  const handleSave = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (!mappedData || !Array.isArray(mappedData)) {
        showSnackbar(
          enqueueSnackbar,
          '매핑된 데이터가 유효하지 않습니다.',
          'error',
          '#FF4853'
        );
        return;
      }

      const requestBody = {
        blueprintName,
        processedData: {
          host: mappedData.map((host) => ({
            name: host.hostNm,
            isLocal: !isDockerRemote,
            ip: isDockerRemote ? remoteUrl : null,
            network: Array.isArray(host.networks)
              ? host.networks.map((network) => ({
                  name: network.name,
                  driver: network.driver || 'bridge',
                  ipam: {
                    config: [
                      {
                        subnet: network.subnet || '',
                      },
                    ],
                  },
                  containers: [
                    {
                      containerName: network.containerName || null,
                      image: {
                        imageId: network.droppedImages?.[0]?.id || '',
                        name: network.droppedImages?.[0]?.name || '',
                        tag: network.droppedImages?.[0]?.tag || '',
                      },
                      networkSettings: network.networkSettings || {},
                      ports: network.ports || [],
                      mounts: network.mounts || [],
                      env: network.env || [],
                      cmd: network.cmd || [],
                    },
                  ],
                }))
              : [],
            volume: Array.isArray(host.imageVolumes)
              ? host.imageVolumes.map((volume) => ({
                  name: volume.Name,
                  driver: volume.Driver,
                }))
              : [],
          })),
        },
      };

      console.log(requestBody);

      const res = await createBlueprint(requestBody);

      if (res.status === 200 || res.status === 201) {
        showSnackbar(
          enqueueSnackbar,
          '설계도를 성공적으로 전송했습니다!',
          'success',
          '#4CAF50'
        );
      } else {
        showSnackbar(
          enqueueSnackbar,
          `설계도 전송 실패: ${res.data.error}`,
          'error',
          '#FF4853'
        );
      }
    } catch (error) {
      console.error('설계도 전송 실패 중 에러:', error);
      showSnackbar(
        enqueueSnackbar,
        '설계도 전송 실패 중 에러가 발생했습니다.',
        'error',
        '#FF4853'
      );
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-[50px] transform translate-x-4 h-[40px] px-4 bg-white border-grey_1 border text-blue_6 hover:text-white hover:bg-blue_5 active:bg-blue_6 rounded-lg flex items-center justify-center transition duration-200 ease-in-out">
        <button
          className="flex items-center gap-2 text-center"
          onClick={handleSave}
        >
          <AiOutlineSave size={20} />
          <span className="font-medium font-pretendard">저장</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">설계도 저장</h2>
            <input
              type="text"
              className="w-full px-3 py-2 border border-grey_2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="설계도 이름"
              value={blueprintName}
              onChange={(e) => setBlueprintName(e.target.value)}
              autoFocus
            />
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="isDockerRemote"
                checked={isDockerRemote}
                onChange={(e) => setIsDockerRemote(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isDockerRemote">Docker Remote</label>
            </div>
            {isDockerRemote && (
              <input
                type="text"
                className="w-full px-3 py-2 border border-grey_3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue_5 mb-4"
                placeholder="Remote URL"
                value={remoteUrl}
                onChange={(e) => setRemoteUrl(e.target.value)}
              />
            )}
            <div className="flex justify-end mt-6 gap-2">
              <button
                className="px-4 py-2 text-grey_6 hover:text-grey_7 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-blue_6 text-white rounded-md hover:bg-blue_5 transition-colors"
                onClick={handleSubmit}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SaveButton;
