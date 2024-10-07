'use client';

import React from 'react';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { AiOutlineSave } from 'react-icons/ai';

const SaveButton = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleSave = () => {
    // main 태그 안의 내용만 저장함 (layout 제외)
    const mainContent = document.querySelector('main')?.innerHTML;

    if (!mainContent) {
      showSnackbar(
        enqueueSnackbar,
        '빈 설계도는 저장할 수 없습니다.',
        'error',
        '#FF4848'
      );
      return;
    }

    // mainContent를 실제 DOM으로 변환
    const parser = new DOMParser();
    const doc = parser.parseFromString(mainContent, 'text/html');

    // react-transform-wrapper와 react-transform-component를 찾음
    const wrapper = doc.querySelector('.react-transform-wrapper');
    const component = doc.querySelector('.react-transform-component');

    // react-transform-wrapper 및 react-transform-component가 있는지 확인
    if (wrapper && component) {
      // wrapper와 component 안에 다른 태그나 요소가 있는지 확인
      const hasOtherContent =
        wrapper.innerHTML.trim().length > 0 ||
        component.innerHTML.trim().length > 0;

      if (!hasOtherContent) {
        showSnackbar(
          enqueueSnackbar,
          '유효하지 않은 설계도는 저장할 수 없습니다.',
          'error',
          '#FF4848'
        );
        return;
      }
    }

    // 파일 이름 생성 (설계도_날짜 형식)
    const currentDateTime = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `설계도_${currentDateTime}.html`;

    // main 태그의 내용을 Blob으로 저장
    const blob = new Blob([mainContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // 저장 완료 메시지 표시
    showSnackbar(
      enqueueSnackbar,
      '설계도가 성공적으Z로 저장되었습니다!',
      'success',
      '#254b7a'
    );
  };

  return (
    <>
      <div className="fixed bottom-8 right-[40px] transform translate-x-4 h-[40px] px-4 bg-white text-blue_6 hover:text-white hover:bg-blue_4 active:bg-blue_5 rounded-lg shadow-lg flex items-center justify-center transition duration-200 ease-in-out">
        <button
          className="flex items-center gap-2 text-center"
          onClick={handleSave}
        >
          <AiOutlineSave size={20} />
          <span className="font-medium">Save</span>
        </button>
      </div>
    </>
  );
};

export default SaveButton;
