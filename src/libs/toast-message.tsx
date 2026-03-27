import { JSX } from 'react';
import { toast } from 'react-toastify';

type toastProps = {
  content: string | (() => JSX.Element);
  autoClose?: number;
  theme?: string;
  iconType?: string;
};

export const showToastMessage = ({ content, autoClose = 2000, theme = 'dark' }: toastProps) => {
  const message = () => {
    if (typeof content === 'string') {
      return <div style={toastWrapper}>{content}</div>;
    }
    return content();
  };

  toast(message, {
    position: 'bottom-center',
    autoClose,
    hideProgressBar: true,
    closeOnClick: true,
    closeButton: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme,
  });
};

const toastWrapper = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
};
