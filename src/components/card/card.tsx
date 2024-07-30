import React, { useState, useEffect, useRef } from 'react';
import { Modal, OptionModal } from '@/components';

interface CardProps {
  id: string;
  size: string;
  tags: string;
  /**
   * primary
   * secondary
   * accent
   */
  status: string;
}

/**
 *
 * @param status card의 상태 값
 * @returns status에 따른 색상을 반환
 */
const getStatusColors = (status: string) => {
  switch (status) {
    case 'primary':
      return { bg1: '#d2d1f6', bg2: '#4C48FF' };
    case 'secondary':
      return { bg1: '#f6d4d6', bg2: '#FF4853' };
    case 'accent':
      return { bg1: '#f6e3d1', bg2: '#FFA048' };
    default:
      return { bg1: '#d1d1d1', bg2: '#7F7F7F' };
  }
};

const Card = ({ id, size, tags, status }: CardProps) => {
  const { bg1, bg2 } = getStatusColors(status);
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const items = [
    { label: 'ID', value: id },
    { label: 'SIZE', value: size },
    { label: 'TAGS', value: tags },
  ];

  const handleOptionClick = () => {
    setShowOptions(!showOptions);
  };

  const handleGetInfo = () => {
    console.log('정보 가져오기 클릭됨');
    setShowOptions(false);
  };

  const handleDelete = () => {
    console.log('삭제하기 클릭됨');
    setShowModal(true);
    setShowOptions(false);
  };

  const handleConfirmDelete = () => {
    console.log('삭제가 확인되었습니다.');
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cardRef]);

  return (
    <div
      ref={cardRef}
      className="relative flex items-start px-3 pt-1 pb-3 bg-grey_0 shadow rounded-lg mb-4"
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-lg"
        style={{ backgroundColor: bg2 }}
      />
      <div className="ml-4 flex flex-col w-full">
        <div className="flex justify-end text-grey_4 text-sm mb-3 relative">
          <span
            className="font-semibold text-xs cursor-pointer"
            onClick={handleOptionClick}
          >
            •••
          </span>
          {showOptions && (
            <div className="absolute top-4 left-16">
              <OptionModal
                onTopHandler={handleGetInfo}
                onBottomHandler={handleDelete}
              />
            </div>
          )}
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex items-center mt-[5px] space-x-3.5">
            <span
              className="text-xs py-1 w-[60px] rounded-md font-bold text-center"
              style={{ backgroundColor: bg1, color: bg2 }}
            >
              {item.label}
            </span>
            <span className="font-semibold text-xs truncate max-w-[150px]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Card;
