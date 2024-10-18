'use client';

import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { AiOutlineSave } from 'react-icons/ai';
import { BASE_URL } from '@/app/api/urlPath';
import { selectedHostStore } from '@/store/seletedHostStore';

interface BlueprintReqDto {
  name: string;
  isDockerRemote: boolean;
  remoteUrl?: string;
}

const SaveButton: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { connectedBridgeIds, selectedHostName } = selectedHostStore(
    (state) => ({
      connectedBridgeIds: state.connectedBridgeIds,
      selectedHostName: state.selectedHostName,
    })
  );

  useEffect(() => {
    console.log('연결된 네트워크:', connectedBridgeIds);

    // 각 호스트에 대해 연결된 네트워크를 호스트 이름으로 묶어 출력
    Object.entries(connectedBridgeIds).forEach(([hostId, bridges]) => {
      const hostName = selectedHostName; // 현재 선택된 호스트 이름 가져오기
      console.log(`호스트 이름: ${hostName || hostId}`);

      bridges.forEach((bridge) => {
        console.log(
          `  네트워크 이름: ${bridge.name}, 게이트웨이: ${bridge.gateway}, 드라이버: ${bridge.driver}, 서브넷: ${bridge.subnet}, 스코프: ${bridge.scope}`
        );
      });
    });
  }, [connectedBridgeIds, selectedHostName]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blueprintName, setBlueprintName] = useState('');
  const [isDockerRemote, setIsDockerRemote] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState('');

  const handleSave = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const mainContent = document.querySelector('main')?.innerHTML;
    if (!mainContent) {
      showSnackbar(
        enqueueSnackbar,
        '저장할 내용이 없습니다.',
        'error',
        '#FF4848'
      );
      return;
    }

    const formData = new FormData();

    // Create blueprintReqDto object
    const blueprintReqDto: BlueprintReqDto = {
      name: blueprintName,
      isDockerRemote: isDockerRemote,
    };

    if (isDockerRemote && remoteUrl) {
      blueprintReqDto.remoteUrl = remoteUrl;
    }

    console.log('JSON 데이터:', JSON.stringify(blueprintReqDto, null, 2));
    // Convert blueprintReqDto to JSON and append as a Blob
    const jsonBlob = new Blob([JSON.stringify(blueprintReqDto)], {
      type: 'application/json',
    });
    formData.append('blueprintReqDto', jsonBlob);

    // Append the HTML content as a Blob with correct content type
    const contentBlob = new Blob([mainContent], {
      type: 'multipart/form-data',
    });
    formData.append('data', contentBlob, `${blueprintName}.html`);

    try {
      const response = await fetch(`${BASE_URL}/blueprints`, {
        method: 'POST',
        body: formData,
      });

      // Check if the response is in JSON format
      const contentType = response.headers.get('Content-Type');

      if (response.ok) {
        showSnackbar(
          enqueueSnackbar,
          '설계도가 성공적으로 저장되었습니다!',
          'success',
          '#254b7a'
        );
        setIsModalOpen(false);
        setBlueprintName('');
        setIsDockerRemote(false);
        setRemoteUrl('');
      } else if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || '서버 응답 오류');
      } else {
        const errorText = await response.text(); // HTML이나 텍스트 응답 처리
        throw new Error(`서버 오류: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar(
        enqueueSnackbar,
        `설계도 저장 중 오류가 발생했습니다: ${error}`,
        'error',
        '#FF4848'
      );
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-[50px] transform translate-x-4 h-[40px] px-4 bg-white border-gray-300 border text-blue-600 hover:text-white hover:bg-blue-500 active:bg-blue-600 rounded-lg flex items-center justify-center transition duration-200 ease-in-out">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="Remote URL"
                value={remoteUrl}
                onChange={(e) => setRemoteUrl(e.target.value)}
              />
            )}
            <div className="flex justify-end mt-6 gap-2">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
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
