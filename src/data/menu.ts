import { FaBox, FaImages, FaNetworkWired, FaDatabase } from 'react-icons/fa';
import { FiSettings, FiGrid, FiBell, FiCpu, FiTool, FiBox, FiImage, FiVolume } from 'react-icons/fi';
import { PiNetworkX } from 'react-icons/pi';
import { GiFishingNet, GiNetworkBars } from 'react-icons/gi';
import { LuNetwork } from 'react-icons/lu';

{
  /* 메뉴의 id 값을 통해 sidebar를 랜더링합니다. */
}

export const MENU_ITEMS = [
  { id: 1, name: 'Container', path: '/', icon: FiBox },
  { id: 2, name: 'Image', path: '/', icon: FiImage },
  { id: 3, name: 'Network', path: '/', icon: LuNetwork },
  { id: 4, name: 'Volume', path: '/', icon: FiCpu },
];

export const MANAGEMENT_MENU = [
  // 일반 적인 정보 (도커 데몬의 기본 정보 혹은 버전 정보)
  { id: 1, label: 'General', icon: FiSettings, component: 'General' },
  // 시스템 자원 사용량 (메모리, CPU, 디스크) 관리 및 모니터링
  { id: 2, label: 'Resources', icon: FiCpu, component: 'Resources' },
  // 도커 엔진의 상태와 관련된 설정
  { id: 3, label: 'Docker Engine', icon: FiGrid, component: 'Engine' },
  // 빌더 관련 정보로, 도커 이미지 빌드 시 관련된 설정과 빌더들
  // { id: 4, label: 'Builders', icon: FiTool, component: 'Builders' },
  // 쿠버네티스 api를 사용해야 해서 일단 보류..
  // { id: 5, label: 'Kubernetes', icon: FiTool },
  // 시스템 알림을 관리하며, 도커 이벤트를 트리거할 수 있는 요소들에 대한 알림을 설정
  // { id: 6, label: 'Notifications', icon: FiBell, component: 'Notifications' },
];
