import useAlertStore from '@/stores/alert';

interface AlertOptions {
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

export const useAlert = () => {
  const { showAlert } = useAlertStore();

  const setAlert = (options: AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      showAlert({
        title: options.title ?? '알림',
        message: options.message,
        confirmText: options.confirmText ?? '확인',
        onConfirm: () => {
          options.onConfirm?.();
          resolve();
        },
      });
    });
  };

  return setAlert;
};
