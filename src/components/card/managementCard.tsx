'use client';

import React from 'react';
import { IconType } from 'react-icons';

interface ManagementCardProps {
  icon: IconType;
  title: string;
  cardData: { label: string; value: string | number }[];
}

const ManagementCard = ({
                          icon: Icon,
                          title,
                          cardData,
                        }: ManagementCardProps) => {
  return (
    <div className="bg-white dark:bg-grey_7 p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <div>
          <h3 className="flex gap-4 pb-4 text-lg font-semibold">
            <Icon className="text-4xl text-blue_4" />
            {title}
          </h3>
          {cardData.map((item, index) => (
            <div key={index} className="flex items-center mt-[5px] space-x-3.5">
              <span
                className="text-sm py-1 w-[80px] rounded-md font-bold text-center text-blue_6 bg-blue_1 dark:text-blue_6 dark:bg-blue_1">
                {item.label}
              </span>
              <span className="font-semibold text-sm truncate max-w-[150px]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagementCard;
