import { API } from '@/libs/api';
import { PATH } from '@/constants/api-path';
import { UserListResponse, UserDetailResponse } from '@/types/user-management';

export const getUserList = async (params: {
  page: number;
  pageSize: number;
  keyword?: string;
  platform?: string;
  verificationStatus?: string;
}): Promise<UserListResponse> => {
  const response = await API.get(PATH.api.getUserList, {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search: params.keyword,
      platform: params.platform,
      business_verification_status: params.verificationStatus,
    },
  });

  return response.data;
};

export const getUserDetail = async (userId: number): Promise<UserDetailResponse> => {
  const response = await API.get(PATH.api.getUserDetail(userId));
  return response.data;
};

export const getOptions = async (params: { type: string }) => {
  const response = await API.get(PATH.api.getOptions, {
    params: {
      field: params.type,
      // search: params.keyword,
    },
  });
  return response.data;
};

export const postUserCreate = async (data: FormData) => {
  const response = await API.post(PATH.api.postUserCreate, data);
  return response.data;
};

export const postReferralCodeValidate = async (code: string) => {
  const response = await API.post(PATH.api.postReferralCodeValidate, {
    referral_code: code,
  });
  return response.data;
};

export const postCertFileUpload = async (data: FormData) => {
  const response = await API.post(PATH.api.postCertFileUpload, data);
  return response.data;
};
