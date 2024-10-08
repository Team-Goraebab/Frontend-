'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import ImageModal from '../modal/image/imageModal';
import { useImageStore } from '@/store/imageStore';
import LargeButton from './largeButton';

interface AddImageButtonProps {
  onCreate: (imageData: any) => void;
}

const AddImageButton = ({ onCreate }: AddImageButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const addImage = useImageStore((state) => state.addImage);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSave = (
    id: string,
    name: string,
    tag: string,
    file: File | null,
    size: string,
    source: 'local' | 'dockerHub', // 이미지의 출처를 구분
    dockerImageInfo?: any // Docker Hub에서 선택된 이미지의 추가 정보
  ) => {
    const imageData = {
      id,
      name,
      tag,
      file,
      size,
      source,
      dockerImageInfo, // Docker Hub 이미지 정보 (선택적)
    };

    // 부모 컴포넌트로 이미지 데이터 전달
    // store에 이미지 데이터 저장
    onCreate(imageData);
    addImage(imageData);

    // 성공 메시지 표시
    showSnackbar(
      enqueueSnackbar,
      '이미지가 성공적으로 추가되었습니다!',
      'success',
      '#254b7a'
    );

    // 모달 닫기
    setIsModalOpen(false);
  };

  return (
    <>
      <LargeButton title={'Image'} onClick={openModal} />
      {isModalOpen && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default AddImageButton;
