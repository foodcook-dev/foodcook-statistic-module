import { create } from 'zustand';

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  showConfirm: (config: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) => void;
  closeConfirm: () => void;
}

const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '확인',
  cancelText: '취소',
  onConfirm: null,
  onCancel: null,
  showConfirm: ({
    title = '',
    message,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm,
    onCancel,
  }) =>
    set({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
    }),
  closeConfirm: () =>
    set({
      isOpen: false,
      title: '',
      message: '',
      confirmText: '확인',
      cancelText: '취소',
      onConfirm: null,
      onCancel: null,
    }),
}));

export default useConfirmStore;
