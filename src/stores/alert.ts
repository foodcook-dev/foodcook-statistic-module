import { create } from 'zustand';

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: (() => void) | null;
  showAlert: (config: {
    title: string;
    message: string;
    confirmText?: string;
    onConfirm?: () => void;
  }) => void;
  closeAlert: () => void;
}

const useAlertStore = create<AlertState>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '',
  onConfirm: null,
  showAlert: ({ title, message, confirmText, onConfirm }) =>
    set({
      isOpen: true,
      title,
      message,
      confirmText,
      onConfirm: onConfirm ?? null,
    }),
  closeAlert: () =>
    set({
      isOpen: false,
      title: '',
      message: '',
      confirmText: '',
      onConfirm: null,
    }),
}));

export default useAlertStore;
