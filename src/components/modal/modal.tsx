'use client';

import React from 'react';

interface ModalProps {
  question?: string;
  confirmText?: string;
  closeText?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-20"
        //   onClick={onClose}
      />
      <div className="bg-white rounded-lg p-4 md:p-5 z-10 shadow-lg w-[90%] max-w-xs sm:max-w-[360px] md:max-w-sm lg:max-w-[400px] xl:max-w-[400px] 2xl:max-w-[400px]">
        <p className="mb-4 md:mb-6 2xl:mb-8 mt-3 md:mt-4 2xl:mt-6 text-center font-bold text-base md:text-lg 2xl:text-2xl">
          {question || '정말로 삭제하시겠습니까?'}
        </p>
        <div className="flex justify-center space-x-3 md:space-x-5">
          <button
            className="w-24 sm:w-28 md:w-32 2xl:w-40 py-2 2xl:py-3 bg-red_1 text-red_2 rounded-lg font-bold text-sm md:text-base 2xl:text-xl"
            onClick={onConfirm}
          >
            {confirmText || '삭제'}
          </button>
          <button
            className="w-24 sm:w-28 md:w-32 2xl:w-40 py-2 2xl:py-3 bg-grey_1 text-grey_6 rounded-lg font-bold text-sm md:text-base 2xl:text-xl"
            onClick={onClose}
          >
            {closeText || '취소'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
