'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tooltip } from 'react-tooltip';
import { MENU_ITEMS } from '@/data/menu';
import { useMenuStore } from '@/store/menuStore';
import { FiSettings } from 'react-icons/fi';
import Image from 'next/image';
import { FaQuestion } from 'react-icons/fa';
import HelpModal from '../modal/helpModal';

const Header = () => {
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);

  const { activeId, setActiveId } = useMenuStore();
  const [barWidth, setBarWidth] = useState<number>(0);
  const [barLeft, setBarLeft] = useState<number>(0);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const handleNavigation = (path: string, id: number) => {
    setActiveId(id);
    router.push(path);
  };

  const handleHelp = () => {
    setIsHelpOpen(true);
  };

  useEffect(() => {
    if (navRef.current) {
      const activeIndex = MENU_ITEMS.findIndex((item) => item.id === activeId);
      if (activeIndex !== -1) {
        const activeItem = navRef.current.children[activeIndex];
        if (activeItem) {
          setBarWidth(activeItem.clientWidth);
          setBarLeft(
            activeItem.getBoundingClientRect().left -
            navRef.current.getBoundingClientRect().left,
          );
        }
      }
    }
  }, [activeId]);

  return (
    <header className="fixed w-full py-4 px-8 bg-blue_5 text-white z-[999]">
      <div className="mx-auto flex justify-between items-center relative">
        <div>
          <Image
            src={require('../../../public/images/GORAEBAB.svg')}
            alt={'logo'}
            width={150}
          />
        </div>
        <div className="flex-grow"></div>
        <nav
          className="flex space-x-6 relative items-center justify-center"
          ref={navRef}
        >
          {MENU_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavigation(item.path, item.id)}
              className={`flex flex-col items-center cursor-pointer font-semibold text-sm transition-colors duration-300 ${
                activeId === item.id
                  ? 'text-blue-400'
                  : 'text-white hover:text-white'
              }`}
              data-tooltip-id={`tooltip-${item.name}`}
              data-tooltip-content={item.name}
            >
              <item.icon className="text-xl mb-1" />
              <Tooltip id={`tooltip-${item.name}`} />
            </div>
          ))}
          <div
            className="absolute bottom-0 h-1 bg-blue-400 rounded-tl rounded-tr transition-all duration-500"
            style={{
              width: `${barWidth}px`,
              left: `${barLeft - 24}px`,
              top: 36,
            }}
          />
        </nav>
        <div className="flex-grow" />
        <div className="flex items-center space-x-4">
          <div
            onClick={() => handleNavigation('/management', 6)}
            className={`cursor-pointer transition-colors duration-300 ${
              activeId === 6 ? 'text-blue-400' : 'text-white hover:text-white'
            }`}
          >
            <FiSettings
              className="text-xl"
              data-tooltip-id="management-tooltip"
            />
            <Tooltip id="management-tooltip" content="Management" />
          </div>
          <div
            onClick={handleHelp}
            className="cursor-pointer text-white hover:text-white transition-colors duration-300"
          >
            <FaQuestion className="text-xl" data-tooltip-id="help" />
            <Tooltip id="help" content="Help" />
          </div>
        </div>
      </div>
      {isHelpOpen && <HelpModal />}
    </header>
  );
};

export default Header;
