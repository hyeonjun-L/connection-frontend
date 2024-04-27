import { create } from 'zustand';
import { INewNotifications } from '@/types/notifications';

interface notificationsStore {
  newNotifications: INewNotifications | null;
  setNewNotifications: (newNotifications: INewNotifications | null) => void;
}

export const useNotificationsStore = create<notificationsStore>((set) => ({
  newNotifications: null,
  setNewNotifications: (newNotifications) => set({ newNotifications }),
}));
