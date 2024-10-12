import React, { ReactNode } from 'react';
import { HiPlus } from 'react-icons/hi';
import { Loader2 } from 'lucide-react';

interface BtnProps {
  title: string;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

/**
 *
 * @param title 버튼 텍스트
 * @param onClick 클릭 핸들러
 * @param isLoading 로딩 상태
 * @param disabled 비활성화 상태
 * @param icon 커스텀 아이콘 (옵션)
 * @param children 자식 요소 (옵션)
 * @returns
 */
const LargeButton = ({ title, onClick, isLoading = false, disabled = false, icon, children }: BtnProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        p-2 w-full text-blue_6 rounded-lg font-bold 
        border border-blue_6 font-pretendard
        transition-all duration-100 ease-in-out
        active:transform active:scale-90
        focus:outline-none
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex gap-2 items-center justify-center">
        {isLoading ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : icon ? (
          icon
        ) : (
          <HiPlus size={20} className="font-bold" />
        )}
        {children || <span>{isLoading ? '처리 중...' : title}</span>}
      </div>
    </button>
  );
};

export default LargeButton;
