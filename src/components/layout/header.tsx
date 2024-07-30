'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MENU_ITEMS } from '@/data/menu';
import { useMenuStore } from '@/store/store';

const Header = () => {
  const { activeId, setActiveId } = useMenuStore();
  console.log('선택한 header menu ::', activeId);
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState(0);
  const [barLeft, setBarLeft] = useState(0);

  useEffect(() => {
    if (navRef.current) {
      const activeIndex = MENU_ITEMS.findIndex((item) => item.id === activeId);
      const activeItem = navRef.current.children[activeIndex];
      if (activeItem) {
        setBarWidth(activeItem.clientWidth);
        setBarLeft(
          activeItem.getBoundingClientRect().left -
            navRef.current.getBoundingClientRect().left
        );
      }
    }
  }, [activeId]);

  const handleNavigation = (path: string, id: number) => {
    setActiveId(id);
    router.push(path);
  };

  return (
    <header className="fixed w-full p-4 bg-header_bg shadow z-10">
      <div className="container mx-auto flex justify-center items-center relative">
        <nav className="flex space-x-6 relative" ref={navRef}>
          {MENU_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavigation(item.path, item.id)}
              className={`flex flex-col items-center cursor-pointer ${
                activeId === item.id ? 'text-blue_2' : 'text-gray-600'
              }`}
            >
              <item.icon className="text-2xl" />
            </div>
          ))}
          <div
            className="absolute bottom-0 h-1 bg-blue_2 rounded-tl rounded-tr transition-all duration-300"
            style={{
              width: `${barWidth}px`,
              left: `${barLeft - 24}px`,
              top: 37,
            }}
          />
        </nav>
      </div>
    </header>
  );
};

export default Header;
