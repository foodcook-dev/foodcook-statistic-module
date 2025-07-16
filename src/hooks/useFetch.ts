import { useState } from 'react';
import ResponseError from '@/libs/response-error';
import useAlertStore from '@/store/alert';
import useSpinnerStore from '@/store/spinner';

export type FetchOptions<T, U> = {
  requestFn: (args: U) => Promise<T> | null | void;
  onSuccess?: (params?: any) => void;
  onError?: (e: ResponseError) => void;
  onFetching?: () => void;
  onSettled?: () => void;
  showSpinner?: boolean;
  spinnerMessage?: string;
};

export default function useFetch<T, U>({
  requestFn,
  onSuccess,
  onError,
  onFetching,
  onSettled,
  showSpinner = false,
  spinnerMessage = '처리 중...',
}: FetchOptions<T, U>) {
  const { setAlertMessage } = useAlertStore();
  const { setLoading } = useSpinnerStore();
  const [state, setState] = useState<any>();

  const request: (args?: U) => Promise<void> | null = async (params?: any) => {
    if (showSpinner) {
      setLoading(true, spinnerMessage);
    }
    onFetching?.();

    try {
      const response = await requestFn(params);
      setState(response);

      if (onSuccess || response) {
        onSuccess?.(response);
      }
    } catch (e) {
      if (onError) {
        onError?.(e as ResponseError);
      } else {
        if (e instanceof ResponseError && typeof e.error === 'string') {
          return setAlertMessage(e.error);
        }
        return setAlertMessage(String(e));
      }
    } finally {
      if (showSpinner) {
        setLoading(false);
      }
      onSettled?.();
    }
  };

  return { response: state, request };
}
