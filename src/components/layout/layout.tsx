'use client';

import React, { useState } from 'react';
import { Header, PanButtons, Sidebar, ZoomButtons } from '@/components';
import {
  IMAGE_CARD_DATA,
  CONTAINER_CARD_DATA,
  NETWORK_CARD_DATA,
  VOLUME_CARD_DATA,
} from '@/data/mock';
import { useMenuStore } from '@/store/store';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { activeId } = useMenuStore();
  const [isHandMode, setIsHandMode] = useState(false);

  /**
   * activeId에 따른 카드 데이터 변경
   */
  let cardData: any[];
  switch (activeId) {
    case 1:
      cardData = CONTAINER_CARD_DATA;
      break;
    case 2:
      cardData = IMAGE_CARD_DATA;
      break;
    case 3:
      cardData = NETWORK_CARD_DATA;
      break;
    case 4:
      cardData = VOLUME_CARD_DATA;
      break;
    default:
      cardData = [];
      break;
  }

  return (
    <div className="relative flex h-screen bg-basic_1">
      <Header />
      <Sidebar data={cardData} />
      <div className="flex flex-col flex-1 ml-[300px] mt-[56px]">
        <div className="flex-1 overflow-y-auto bg-basic_1 p-4 bg-grey_0">
          <main className={`relative ${isHandMode ? 'hand-mode' : ''}`}>
            {children}
          </main>
          <div className="flex flex-col">
            <ZoomButtons />
            <PanButtons setIsHandMode={setIsHandMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
