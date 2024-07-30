'use client';

import HostCard from '@/components/card/hostCard';

const NetworkPage = () => {
  return (
    <>
      <HostCard ip="12.34.56.67" />
      <HostCard ip="12.34.56.67" status={false} />
    </>
  );
};

export default NetworkPage;
