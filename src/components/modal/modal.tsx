'use client';

import React from 'react';
import { Dialog } from '@mui/material';
import Button from '../button/button';

interface ModalProps {
  question?: string;
  confirmText?: string;
  closeText?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * 모달 컴포넌트
 * @param question 모달 텍스트 (default: 정말로 삭제하시겠습니까?)
 * @param confirmText 확인 텍스트 (default: 삭제)
 * @param closeText 닫기 텍스트 (default: 취소)
 * @param isOpen 모달 open 유무
 * @param onClose 모달 닫기 핸들러
 * @param onConfirm 모달 확인 핸들러
 * @returns
 */
const Modal = ({
                 question,
                 confirmText,
                 closeText,
                 isOpen,
                 onClose,
                 onConfirm,
               }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl py-6 px-12">
        <p className="mb-6 text-center font-semibold font-pretendard text-lg text-black_6">
          {question || '정말로 삭제하시겠습니까?'}
        </p>
        <div className="flex justify-center space-x-4 font-pretendard">
          <Button title={'삭제'} color="red" onClick={onConfirm} />
          <Button title={'취소'} color="grey" onClick={onClose} />
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
