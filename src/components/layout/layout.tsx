'use client';

import React, { useState, useEffect } from 'react';
import { Header, PanButtons, Sidebar } from '@/components';
import {
  IMAGE_CARD_DATA,
  CONTAINER_CARD_DATA,
  NETWORK_CARD_DATA,
  VOLUME_CARD_DATA,
} from '@/data/mock';
import AddHostButton from '../button/addHostButton';
import SaveButton from '../button/saveButton';
import DeleteBlueprintButton from '../button/deleteBlueprintButton';
import { SnackbarProvider } from 'notistack';
import { usePathname } from 'next/navigation';
import Splash from '@/components/splash/splash';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isHandMode, setIsHandMode] = useState(false);
  const [loading, setLoading] = useState(true); // 스플래시 화면 표시 여부를 위한 상태

  useEffect(() => {
    // 스플래시 화면을 3초 동안 표시
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  
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
  const isSimpleLayout =
    pathname.includes('management') || pathname.includes('dashboard');

  if (loading) {
    return <Splash />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <SnackbarProvider maxSnack={3}>
        <Header />
        <div className="relative flex h-screen bg-basic_1 overflow-hidden">
          {isSimpleLayout ? (
            <div className="flex flex-col flex-1">
              <div className="flex-1 bg-basic_1 bg-grey_0">
                <main className={`relative ${isHandMode ? 'hand-mode' : ''}`}>
                  {children}
                </main>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 ml-[300px]">
              <div className="flex-1 bg-basic_1 bg-grey_0">
                <main className={`relative ${isHandMode ? 'hand-mode' : ''}`}>
                  {children}
                </main>
                <Sidebar />
                <PanButtons />
                <AddHostButton />
                <DeleteBlueprintButton />
                <SaveButton />
              </div>
            </div>
          )}
        </div>
      </SnackbarProvider>
    </DndProvider>
  );
};

export default Layout;
