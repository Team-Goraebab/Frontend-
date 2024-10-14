'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { AiOutlineSave } from 'react-icons/ai';
import { BASE_URL } from '@/app/api/urlPath';

const SaveButton = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blueprintName, setBlueprintName] = useState('');

  const handleSave = async () => {
    const mainContent = document.querySelector('main')?.innerHTML;

    if (!mainContent) {
      showSnackbar(
        enqueueSnackbar,
        '빈 설계도는 저장할 수 없습니다.',
        'error',
        '#FF4848',
      );
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(mainContent, 'text/html');

    const wrapper = doc.querySelector('.react-transform-wrapper');
    const component = doc.querySelector('.react-transform-component');

    if (wrapper && component) {
      const hasOtherContent =
        wrapper.innerHTML.trim().length > 0 ||
        component.innerHTML.trim().length > 0;

      if (!hasOtherContent) {
        showSnackbar(
          enqueueSnackbar,
          '유효하지 않은 설계도는 저장할 수 없습니다.',
          'error',
          '#FF4848',
        );
        return;
      }
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!blueprintName.trim()) {
      showSnackbar(
        enqueueSnackbar,
        '설계도 이름을 입력해주세요.',
        'error',
        '#FF4848',
      );
      return;
    }

    const mainContent = document.querySelector('main')?.innerHTML;
    if (!mainContent) return;

    try {
      const response = await fetch(`${BASE_URL}/storage/1/blueprint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: blueprintName,
          data: mainContent,
        }),
      });

      if (response.ok) {
        showSnackbar(
          enqueueSnackbar,
          '설계도가 성공적으로 저장되었습니다!',
          'success',
          '#254b7a',
        );
        setIsModalOpen(false);
        setBlueprintName('');
      } else {
        throw new Error('서버 응답 오류');
      }
    } catch (error) {
      showSnackbar(
        enqueueSnackbar,
        '설계도 저장 중 오류가 발생했습니다.',
        'error',
        '#FF4848',
      );
    }
  };

  return (
    <>
      <div
        className="fixed bottom-8 right-[50px] transform translate-x-4 h-[40px] px-4 bg-white border-gray-300 border text-blue-600 hover:text-white hover:bg-blue-500 active:bg-blue-600 rounded-lg flex items-center justify-center transition duration-200 ease-in-out">
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
            <p className="text-gray-600 mb-4">설계도의 이름을 입력해주세요.</p>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="설계도 이름"
              value={blueprintName}
              onChange={(e) => setBlueprintName(e.target.value)}
              autoFocus
            />
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
