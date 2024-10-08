import { FaBox, FaImages, FaNetworkWired, FaDatabase } from 'react-icons/fa';

{/* 메뉴의 id 값을 통해 sidebar를 랜더링합니다. */}

export const MENU_ITEMS = [
  { id: 1, name: 'Container', path: '/', icon: FaBox },
  { id: 2, name: 'Image', path: '/', icon: FaImages },
  { id: 3, name: 'Network', path: '/', icon: FaNetworkWired },
  { id: 4, name: 'Volume', path: '/', icon: FaDatabase },
];
