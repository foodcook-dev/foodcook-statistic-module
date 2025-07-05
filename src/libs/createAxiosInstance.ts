import axios from 'axios';
import { PATH } from '@/constants/apiPath';
import { Instance } from '@/types/api';
import ResponseError from '@/libs/responseError';
import { createSearchParams, getCurrentToken } from '@/libs/utils';
// import { decryption } from '@/libs/hash';

const instance = axios.create({
  baseURL: PATH.base,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

instance.interceptors.request.use(
  (config) => {
    const newConfig = { ...config };

    // iframe URL 파라미터에서 토큰을 가져와서 사용
    const token = getCurrentToken();

    if (token) {
      newConfig.headers.Authorization = `Bearer ${token}`;
    }

    // TODO: 추후 기존 토큰 처리 로직으로 대체 가능
    // const encryptedUserData = localStorage.getItem('userData');
    // let accessToken = '';

    // if (encryptedUserData) {
    //   try {
    //     const decrypted = decryption(encryptedUserData);
    //     const parsed = JSON.parse(decrypted);
    //     accessToken = parsed?.accessToken || '';
    //   } catch (e) {
    //     console.error('유저 데이터 복호화/파싱 실패:', e);
    //   }
    // }

    // newConfig.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
    return newConfig;
  },
  (err) => Promise.reject(err),
);

instance.interceptors.response.use(undefined, (error) => {
  const { response } = error;

  if (response.status === 302) {
    return Promise.resolve({
      data: { ...response.data, status: response.status },
    });
  }

  if (response.status === 500) {
    return Promise.reject({
      status: 500,
      code: 99999,
      message: 'Network Error',
    });
  }

  return Promise.reject({
    ...response.data,
    status: response.status,
  });
});

const customAxios: Instance = async ({ method, endpoint, params, body }) => {
  try {
    const { data } = await instance({
      method,
      url: `${endpoint}${createSearchParams(params)}`,
      data: body,
    });

    return data;
  } catch (e) {
    throw new ResponseError(e);
  }
};

export default customAxios;
