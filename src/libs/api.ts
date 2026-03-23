import axios from 'axios';
import { PATH } from '@/constants/api-path';
import { getCurrentToken } from '@/utils/token';

const createInstance = (baseURL?: string) => {
  const instance = axios.create({
    baseURL: baseURL || PATH.base,
  });

  instance.interceptors.request.use(
    (config) => {
      const newConfig = { ...config };
      const token = getCurrentToken();

      if (token) {
        newConfig.headers.Authorization = `Bearer ${token}`;
      }

      // newConfig.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmlja25hbWUiOiJcdWJjMzBcdWMxYTFcdWQ1NThcdWM5YzBcdWI5YzhcdWMxMzhcdWM2OTRcdWQxNGNcdWMyYTRcdWQyYjhcdWM3ODVcdWIyYzhcdWIyZTQoYWRtaW4pIiwicGhvbmVfbnVtIjoiMDEwMzQzMzU2NzMiLCJwaG9uZV9udW1iZXIiOiIwMTAzNDMzNTY3MyIsImVtYWlsIjoieWFyZ2V1NThAZ21haWwuY29tIiwiY2FydCI6IjEiLCJwb2ludCI6eyJpZCI6NCwicG9pbnQiOjEwNjQ5fSwiZXhwIjoxNzc5MTcxNzkxLCJpYXQiOjE3NzM5ODc3OTF9.NjejLPfDqbAQnuscIsi-YUqoK-eFL7Iw0hGQ9rL77SE`;
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

  return instance;
};

export const API = createInstance();
export { createInstance };
