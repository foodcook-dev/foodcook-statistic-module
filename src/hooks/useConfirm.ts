import useConfirmStore from '@/store/confirm';

interface ConfirmOptions {
  title?: string;
  message: string;
}

export const useConfirm = () => {
  const { showConfirm } = useConfirmStore();

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      showConfirm({
        title: options.title,
        message: options.message,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  return confirm;
};
