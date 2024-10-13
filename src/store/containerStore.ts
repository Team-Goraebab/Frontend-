import { create } from 'zustand';
import { Image, Container } from '@/types/type';

interface ContainerStore {
  containers: Container[];
  addContainer: (container: Container) => void;
  assignImageToContainer: (containerId: string, image: Image) => void;
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
        container.id === containerId ? { ...container, image } : container,
      ),
    })),
  assignNetworkToContainer: (containerId, networkId) =>
    set((state) => ({
      containers: state.containers.map((container) =>
        container.id === containerId ? { ...container, networkId } : container,
      ),
    })),
}));
