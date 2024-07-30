'use client';

import React, { useState, useEffect } from 'react';
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa';

const ZoomButtons = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  /**
   * 최대 200%까지 확대
   */
  const handleZoomIn = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.min(prev + 10, 200);
      updateZoom(newZoom);
      return newZoom;
    });
  };

  /**
   * 최소 50%까지 축소
   */
  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 10, 50);
      updateZoom(newZoom);
      return newZoom;
    });
  };

  const updateZoom = (zoom: number) => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.zoom = `${zoom}%`;
    }
  };

  /**
   * wheel로 zoomIn, zoomOut
   * @param event WheelEvent
   */
  const handleWheel = (event: WheelEvent) => {
    if (isShiftPressed) {
      console.log('Shift 키 눌렀음:::');
      // Shift 키를 누르고 있을 때만 확대/축소
      event.preventDefault();
      if (event.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    } else {
      console.log('Shift 키 누르지 않음');
    }
  };

  /**
   * shift key 감지
   * @param event keyboardEvent
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      setIsShiftPressed(true);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      setIsShiftPressed(false);
    }
  };

  useEffect(() => {
    console.log('이벤트 리스너 추가됨');
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      console.log('이벤트 리스너 제거됨');
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isShiftPressed]);

  return (
    <div className="fixed bottom-4 left-[300px] transform translate-x-4 w-[130px] h-[50px] p-3 bg-white rounded-lg shadow-lg flex items-center justify-between z-50">
      <button onClick={handleZoomOut}>
        <FaSearchMinus size={20} />
      </button>
      <span className="text-lg font-semibold text-grey_6">{zoomLevel}%</span>
      <button onClick={handleZoomIn}>
        <FaSearchPlus size={20} />
      </button>
    </div>
  );
};

export default ZoomButtons;
