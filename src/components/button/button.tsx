import React from 'react';

interface BtnProps {
  title: string;
  color?: string;
  onClick: () => void;
}

/**
 *
 * @param title 버튼 텍스트
 * @param color 버튼 색상
 * @param onClick 클릭 핸들러
 * @returns
 */
const Button = ({ title, color, onClick }: BtnProps) => {
  return (
    <button
      className={`px-4 py-1.5 rounded-md border ${
        color === 'grey'
          ? `text-grey_3 border-grey_3 hover:text-white hover:bg-grey_3`
          : 'text-blue_3 border-blue_3 hover:text-white hover:bg-blue_3'
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
