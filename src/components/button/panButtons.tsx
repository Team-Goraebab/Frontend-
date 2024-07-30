'use client';

import React, { useEffect, useState } from 'react';
import { FaMousePointer, FaHandPaper } from 'react-icons/fa';

interface PanBtnProps {
  setIsHandMode: (isHandMode: boolean) => void;
}

const PanButtons = ({ setIsHandMode }: PanBtnProps) => {
  const [isHandMode, setIsHandModeLocal] = useState(false);

  useEffect(() => {
    setIsHandMode(isHandMode);

    const handlePan = (event: MouseEvent) => {
      if (isHandMode && event.buttons === 1) {
        event.preventDefault();
        window.scrollBy(-event.movementX, -event.movementY);
      }
    };

    window.addEventListener('mousemove', handlePan);
    return () => {
      window.removeEventListener('mousemove', handlePan);
    };
  }, [isHandMode]);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (isHandMode && mainElement) {
      mainElement.classList.add('hand-mode');
      const handleMouseDown = () => {
        mainElement.classList.add('grabbing');
      };
      const handleMouseUp = () => {
        mainElement.classList.remove('grabbing');
      };
      mainElement.addEventListener('mousedown', handleMouseDown);
      mainElement.addEventListener('mouseup', handleMouseUp);
      return () => {
        mainElement.removeEventListener('mousedown', handleMouseDown);
        mainElement.removeEventListener('mouseup', handleMouseUp);
      };
    } else if (mainElement) {
      mainElement.classList.remove('hand-mode');
      mainElement.classList.remove('grabbing');
    }
  }, [isHandMode]);

  const handleMouseClick = () => {
    setIsHandModeLocal(false);
    setIsHandMode(false);
  };

  const handleHandClick = () => {
    setIsHandModeLocal(true);
    setIsHandMode(true);
  };

  return (
    <div className="fixed bottom-4 left-[445px] transform translate-x-4 w-[130px] h-[50px] p-3 bg-white rounded-lg shadow-lg flex items-center justify-between z-50">
      <button
        className={`p-2 rounded-full ${
          !isHandMode ? 'bg-blue_1 text-blue_2' : 'text-black'
        }`}
        onClick={handleMouseClick}
      >
        <FaMousePointer size={20} />
      </button>
      <div className="mx-2 border-r h-full"></div>
      <button
        className={`p-2 rounded-full ${
          isHandMode ? 'bg-blue_1 text-blue_2' : 'text-black'
        }`}
        onClick={handleHandClick}
      >
        <FaHandPaper size={20} />
      </button>
    </div>
  );
};

export default PanButtons;
