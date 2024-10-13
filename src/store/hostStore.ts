import { create } from 'zustand';
import { Host } from '@/types/type';

type Network = {
  id: string;
  name: string;
  ip: string;
  hostId: string;
  containers: string[];
};

interface HostStore {
  hosts: Host[];
  networks: Network[];
  addHost: (host: Host) => void;
  deleteHost: (hostId: string) => void;
  deleteNetwork: (hostId: string, networkId: string) => void;
  deleteAllHosts: () => void;
}

// 호스트 및 네트워크 정보를 저장하는 store
export const useHostStore = create<HostStore>((set, get) => ({
  hosts: [],
  networks: [],

  // 호스트 추가
  addHost: (host) =>
    set((state) => ({
      hosts: [...state.hosts, host],
    })),

  // 호스트 삭제
  deleteHost: (hostId) =>
    set((state) => ({
      hosts: state.hosts.filter((host) => host.id !== hostId),
      networks: state.networks.filter((network) => network.hostId !== hostId),
    })),

  // 네트워크 삭제
  deleteNetwork: (hostId, networkId) =>
    set((state) => {
      const updatedNetworks = state.networks.filter(
        (network) => network.id !== networkId || network.hostId !== hostId
      );

      const updatedHosts = state.hosts.map((host) => {
        if (host.id === hostId) {
          return {
            ...host,
            networkName: host.networkName === networkId ? '' : host.networkName,
            networkIp: host.networkIp === networkId ? '' : host.networkIp,
          };
        }
        return host;
      });

      return {
        networks: updatedNetworks,
        hosts: updatedHosts,
      };
    }),

  // 모든 호스트 삭제
  deleteAllHosts: () =>
    set(() => ({
      hosts: [],
      networks: [],
    })),
}));
