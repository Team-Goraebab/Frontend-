import { create } from 'zustand';
import { Volume, Image, Container } from '@/types/type';

interface ContainerStore {
  containers: Container[];
  addContainer: (container: Container) => void;
  assignImageToContainer: (containerId: string, image: Image) => void;
  // assignVolumeToContainer: (containerId: string, volume: Volume) => void;
  assignNetworkToContainer: (containerId: string, networkId: string) => void;
}

export const useContainerStore = create<ContainerStore>((set) => ({
  containers: [],
  addContainer: (container) =>
    set((state) => ({
      containers: [...state.containers, container],
    })),
  assignImageToContainer: (containerId, image) =>
    set((state) => ({
      containers: state.containers.map((container) =>
        container.id === containerId ? { ...container, image } : container
      ),
    })),
  // assignVolumeToContainer: (containerId, volume) =>
  //   set((state) => ({
  //     containers: state.containers.map((container) =>
  //       container.id === containerId ? { ...container, volume } : container
  //     ),
  //   })),
  assignNetworkToContainer: (containerId, networkId) =>
    set((state) => ({
      containers: state.containers.map((container) =>
        container.id === containerId ? { ...container, networkId } : container
      ),
    })),
}));
