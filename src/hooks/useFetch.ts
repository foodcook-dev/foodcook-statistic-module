import { useState } from 'react';
import ResponseError from '@/libs/response-error';
import useAlertStore from '@/store/alert';

export type FetchOptions<T, U> = {
  requestFn: (args: U) => Promise<T> | null | void;
  onSuccess?: (params?: any) => void;
  onError?: (e: ResponseError) => void;
  onFetching?: () => void;
  onSettled?: () => void;
};

export default function useFetch<T, U>({
  requestFn,
  onSuccess,
  onError,
  onFetching,
  onSettled,
}: FetchOptions<T, U>) {
  const { setAlertMessage } = useAlertStore();
  const [state, setState] = useState<any>();
  const request: (args?: U) => Promise<void> | null = async (params?: any) => {
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
      onSettled?.();
    }
  };

  return { response: state, request };
}
