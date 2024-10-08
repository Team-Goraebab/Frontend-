export const IMAGE_CARD_DATA = [
  {
    id: 'sha-image',
    size: '124.2MB',
    tags: 'httpd/latest',
    status: 'primary',
  },
  {
    id: 'sha-24546wdjnas930m-gkdlxkduwldk',
    size: '35.2MB',
    tags: 'httpd/latest',
    status: 'secondary',
  },
  {
    id: 'suyoooi-24546wdjnas930m',
    size: '1.2MB',
    tags: 'httpd/latest',
    status: 'accent',
  },
  {
    id: 'suyoooi-24546wdjnas930m',
    size: '1.2MB',
    tags: 'httpd/latest',
    status: 'secondary',
  },
  {
    id: 'suyoooi-123123container',
    size: '1.2MB',
    tags: 'httpd/latest',
    status: 'primary',
  },
];

export const CONTAINER_CARD_DATA = [
  {
    id: 'sha-container',
    name: 'conatiner 실행 테스트 1',
    ip: '177.17.0.7',
    active: 'running',
    size: '124.2MB',
    tags: 'httpd/latest',
    status: 'primary',
  },
  {
    id: 'sha-24546wdjnas930m-gkdlxkduwldk',
    name: 'conatiner 실행 테스트 2',
    ip: '155.15.0.5',
    active: 'running',
    size: '35.2MB',
    tags: 'httpd/latest',
    status: 'accent',
  },
  {
    id: 'sha-container',
    name: 'conatiner 실행 테스트 3',
    ip: '178.18.0.8',
    active: 'stopped',
    size: '124.2MB',
    tags: 'httpd/latest',
    status: 'accent',
  },
  {
    id: 'sha-24546wdjnas930m-gkdlxkduwldk',
    name: 'conatiner 실행 테스트 4',
    ip: '123.12.0.3',
    active: 'running',
    size: '35.2MB',
    tags: 'httpd/latest',
    status: 'secondary',
  },
  {
    id: 'sha-container',
    name: 'conatiner 실행 테스트 5',
    ip: '166.16.0.6',
    active: 'stopped',
    size: '124.2MB',
    tags: 'httpd/latest',
    status: 'accent',
  },
];

export const NETWORK_CARD_DATA = [
  {
    id: 'sha-network',
    size: '124.2MB',
    tags: 'httpd/latest',
    status: 'accent',
  },
  {
    id: 'sha-24546network930m-network',
    size: '35.2MB',
    tags: 'httpd/latest',
    status: 'secondary',
  },
];

export const VOLUME_CARD_DATA = [
  {
    id: 'volume',
    size: '124.2MB',
    tags: 'httpd/latest',
    status: 'primary',
  },
  {
    id: 'sha-24546network930m-network',
    size: '35.2MB',
    tags: 'httpd/latest',
    status: 'primary',
  },
];

export const HOST_DATA = {
  hostNm: 'Host Name',
  ip: '12.34.56.67',
  status: true,
};

export const NETWORK_DATA = {
  networkIp: '172.17.0.1',
  containers: [
    { id: '1', name: 'naver-backend', ip: '172.17.0.2', status: 'running' },
    { id: '2', name: 'naver-frontend', ip: '172.17.0.3', status: 'stopped' },
    { id: '3', name: 'naver-frontend', ip: '172.17.0.3', status: 'running' },
  ],
};
