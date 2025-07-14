import axios from 'axios';
import { PATH } from '@/constants/api-path';
import { Instance } from '@/types/api';
import ResponseError from '@/libs/response-error';
import { createSearchParams, getCurrentToken } from '@/libs/utils';
// import { decryption } from '@/libs/hash';

const instance = axios.create({
  baseURL: PATH.base,
});

instance.interceptors.request.use(
  (config) => {
    const newConfig = { ...config };

    // iframe URL 파라미터에서 토큰을 가져와서 사용
    const token = getCurrentToken();

    // if (token) {
    //   newConfig.headers.Authorization = `Bearer ${token}`;
    // }

    newConfig.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGhvbmVfbnVtIjoiMDEwMzQzMzU2NzMiLCJwaG9uZV9udW1iZXIiOiIwMTAzNDMzNTY3MyIsImVtYWlsIjoieWFyZ2V1NThAZ21haWwuY29tIn0.OyqgJy7_fE4gleCI5yvi7muDkoiRHtf0ZE0-vlro3zc`;

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
