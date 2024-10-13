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
    <div className="flex flex-col z-50 items-center rounded-xl w-32 absolute bg-white shadow-lg border border-grey_2">
      <button
        className="w-full py-2 text-black_6 text-xs font-semibold hover:bg-grey_0 rounded-t-xl transition-colors relative"
        onClick={onTopHandler}
      >
        {topTitle || '상세 정보'}
        <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-grey_2" />
      </button>

      {btnVisible && (
        <button
          className="w-full py-2 text-black_6 text-xs font-semibold font-pretendard hover:bg-grey_0 transition-colors relative"
          onClick={onMiddleHandler}
        >
          {middleTitle || '실행'}
          <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-grey_2" />
        </button>
      )}

      <button
        className="w-full py-2 text-danger text-xs font-semibold font-pretendard hover:bg-red_0 rounded-b-xl transition-colors"
        onClick={onBottomHandler}
      >
        {bottomTitle || '삭제'}
      </button>
    </div>
  );
};

export default OptionModal;
