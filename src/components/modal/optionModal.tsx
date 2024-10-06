'use client';

import React from 'react';

interface OptionModalProps {
  topTitle?: string;
  middleTitle?: string;
  bottomTitle?: string;
  onTopHandler?: () => void;
  onMiddleHandler?: () => void;
  onBottomHandler?: () => void;
  btnVisible?: boolean;
}

/**
 * 옵션 모달
 * @param topTitle 첫 번째 옵션
 * @param middleTitle 두 번째 옵션
 * @param bottomTitle 세 번째 옵션
 * @param onTopHandler 첫 번째 옵션 핸들러
 * @param onMiddleHandler 두 번째 옵션 핸들러
 * @param onBottomHandler 세 번째 옵션 핸들러
 * @param btnVisible 중간 버튼 보임 여부 (기본값: true)
 * @returns
 */
const OptionModal = ({
  topTitle,
  middleTitle,
  bottomTitle,
  onTopHandler,
  onMiddleHandler,
  onBottomHandler,
  btnVisible = true,
}: OptionModalProps) => {
  return (
    <div className="flex flex-col z-50 items-center border border-grey_3 rounded-md w-40 absolute bg-white shadow-lg">
      <button
        className="w-full py-1.5 text-black border-b border-grey_3 text-xs font-semibold"
        onClick={onTopHandler}
      >
        {topTitle || '상세 정보'}
      </button>
      {/* btnVisible이 true일 때만 middle 버튼을 보여줌 */}
      {btnVisible && (
        <button
          className="w-full py-1.5 text-black border-b border-grey_3 text-xs font-semibold"
          onClick={onMiddleHandler}
        >
          {middleTitle || '실행'}
        </button>
      )}

      <button
        className="w-full py-1.5 text-red-500 text-xs font-semibold"
        onClick={onBottomHandler}
      >
        {bottomTitle || '삭제'}
      </button>
    </div>
  );
};

export default OptionModal;
