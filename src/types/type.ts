export interface Volume {
  id: string;
  name: string;
  driver: string;
  mountPoint: string;
  capacity: string;
  status: string;
}

export interface Image {
  id: string;
  name: string;
  tag: string;
  source: 'local' | 'dockerHub';
  size: string;
}

export interface Network {
  id: string;
  name: string;
  subnet: string;
  gateway: string;
  driver: string;
}

export type ThemeColor = {
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
};

export type Host = {
  id: string;
  hostNm: string;
  ip: string;
  isRemote: boolean;
  themeColor: ThemeColor;
  networkName: string;
  networkIp: string;
  className?: string;
};

export interface Container {
  id: string;
  name: string;
  ip: string;
  size: string;
  tag: string;
  active: string;
  status: string;
  network: string;
  image: Image; // Image 객체를 기대
  volume?: Volume[]; // 전체 Volume 객체를 저장
  networkId?: string; // 연결된 네트워크 ID
}
