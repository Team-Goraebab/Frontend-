import { FiHardDrive, FiFolder, FiDatabase, FiSettings } from 'react-icons/fi';

interface MountConfigProps {
  type: 'bind' | 'volume';
  alias?: string;
  source: string;
  destination: string;
  name: string;
  driver: string;
  // mode: string;
}

const MountDetail = ({ mount }: { mount: MountConfigProps }) => {
  const items = [
    {
      label: '대상',
      value: mount.destination,
      icon: FiHardDrive,
      bg1: '#ffe6ff',
      bg2: '#e682e6',
    },
    {
      label: mount.type === 'bind' ? '소스' : '볼륨',
      value:
        mount.type === 'bind' ? mount.source || 'N/A' : mount.name || 'N/A',
      icon: FiFolder,
      bg1: '#FFEEDB',
      bg2: '#FFA048',
    },
    {
      label: '드라이버',
      value: mount.driver || 'N/A',
      icon: FiDatabase,
      bg1: '#e6f4ea',
      bg2: '#4caf50',
    },
    {
      label: '모드',
      value: 'rw',
      icon: FiSettings,
      bg1: '#E6D7F7',
      bg2: '#5a67d8',
    },
  ];

  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: item.bg1 }}>
            <item.icon size={16} style={{ color: item.bg2 }} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-grey_4 font-medium">
              {item.label}
            </span>
            <span className="font-semibold text-sm text-grey_7 truncate max-w-[150px]">
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
export default MountDetail;
