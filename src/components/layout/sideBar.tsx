import React from 'react';
import { Button, Card } from '@/components';

interface SidebarProps {
  data: any[];
}

const Sidebar = ({ data }: SidebarProps) => {
  return (
    <div className="fixed top-0 left-0 w-[300px] h-full flex flex-col bg-white p-4 border-r-2 border-grey_2 pt-20">
      <div className="flex-grow overflow-y-auto scrollbar-hide">
        {data.map((item, index) => (
          <Card
            key={index}
            id={item.id}
            size={item.size}
            tags={item.tags}
            status={item.status}
          />
        ))}
      </div>
      <div className="flex-shrink-0">
        <Button title={'추가하기'} />
      </div>
    </div>
  );
};

export default Sidebar;
