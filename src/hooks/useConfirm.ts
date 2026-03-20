import useConfirmStore from '@/stores/confirm';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export const useConfirm = () => {
  const { showConfirm } = useConfirmStore();

  const setConfirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      showConfirm({
        title: options.title,
        message: options.message,
        confirmText: options.confirmText,
        cancelText: options.cancelText,
        onConfirm: () => {
          options.onConfirm?.();
          resolve(true);
        },
        onCancel: () => resolve(false),
      });
    });
  };

  return setConfirm;
};
