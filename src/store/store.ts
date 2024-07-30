import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MenuState {
  activeId: number;
  setActiveId: (id: number) => void;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      activeId: 1,
      setActiveId: (id: number) => set({ activeId: id }),
    }),
    {
      name: 'menu-storage', // localStorage에 저장될 키 이름
    }
  )
);
