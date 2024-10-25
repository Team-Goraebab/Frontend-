'use client';

import React, { useState } from 'react';
import { FiList } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

const BlueprintButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-7 right-[250px] inline-block">
      <button
        onClick={toggleMenu}
        className="w-12 h-12 rounded-full bg-blue_4 shadow-lg flex items-center justify-center transition duration-300 ease-in-out hover:bg-blue_5"
        data-tooltip-id="blueprint-tooltip"
        data-tooltip-content="설계도 목록"
      >
        <div className="relative">
          <FiList className="text-white w-6 h-6" />
        </div>
      </button>
      <Tooltip id="blueprint-tooltip" place="left" />
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-40 bg-white shadow-lg rounded-xl border border-grey_2 z-[9999]">
          <button className="w-full py-2 text-grey_6 text-xs font-semibold hover:bg-grey_0 rounded-t-xl transition-colors relative">
            설계도 1
            <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-grey_2" />
          </button>
          <button className="w-full py-2 text-grey_6 text-xs font-semibold hover:bg-grey_0 transition-colors relative">
            설계도 2
            <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-grey_2" />
          </button>
          <button className="w-full py-2 text-grey_6 text-xs font-semibold hover:bg-grey_0 rounded-b-xl transition-colors">
            설계도 3
          </button>
        </div>
      )}
    </div>
  );
};

export default BlueprintButton;
