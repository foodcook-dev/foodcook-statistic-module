import { ERP_API } from '@/libs/api';
import { PATH } from '@/constants/api-path';
import {
  UserListResponse,
  UserDetailResponse,
  SalesCompanyDetailResponse,
} from '@/types/user-management';

// 사용자 목록 조회
export const getUserList = async (params: {
  page: number;
  pageSize: number;
  keyword?: string;
  platform?: string;
  verificationStatus?: string;
}): Promise<UserListResponse> => {
  const response = await ERP_API.get(PATH.api.getUserList, {
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

// 사용자 상세 정보 조회
export const getUserDetail = async (userId: number): Promise<UserDetailResponse> => {
  const response = await ERP_API.get(PATH.api.getUserDetail(userId));
  return response.data;
};

// 판매사업자 상세 정보 조회
export const getSalesCompanyDetail = async (
  companyId: number,
): Promise<SalesCompanyDetailResponse> => {
  const response = await ERP_API.get(PATH.api.getSalesCompanyDetail(companyId));
  return response.data;
};

// 프랜차이즈 기본 결제 수단 조회
export const getFranchisePayment = async (franchiesId: string) => {
  const response = await ERP_API.get(PATH.api.getFranchisePayment(franchiesId));
  return response.data;
};

// 옵션 데이터 조회 (예: 플랫폼, 사업자 유형 등)
export const getOptions = async (params: { type: string }) => {
  const response = await ERP_API.get(PATH.api.getOptions, {
    params: {
      field: params.type,
      // search: params.keyword,
    },
  });
  return response.data;
};

// 사용자 수기 생성
export const postUserCreate = async (data: FormData) => {
  const response = await ERP_API.post(PATH.api.postUserCreate, data);
  return response.data;
};

// 추천인 코드 검증
export const postReferralCodeValidate = async (code: string) => {
  const response = await ERP_API.post(PATH.api.postReferralCodeValidate, {
    referral_code: code,
  });
  return response.data;
};

// 사업자등록증 파일 업로드 및 OCR 결과 반환
export const postCertFileUpload = async (data: FormData) => {
  const response = await ERP_API.post(PATH.api.postCertFileUpload, data);
  return response.data;
};

// 판매사업자 승인
export const postSalesCompanyConfirm = async (companyId: number, confirm: boolean) => {
  const response = await ERP_API.post(PATH.api.postConfirmSalesCompany(companyId), {
    is_requesting: confirm,
  });
  return response.data;
};

// 사용자 정보 수정
export const patchUserUpdate = async (userId: number, data: FormData) => {
  const response = await ERP_API.patch(PATH.api.patchUserInfo(userId), data);
  return response.data;
};

// 판매사업자 정보 수정
export const patchSalesCompanyUpdate = async (companyId: number, data: FormData) => {
  const response = await ERP_API.patch(PATH.api.patchSalesCompanyUpdate(companyId), data);
  return response.data;
};

// 판매사업장 지점 정보 생성
export const postSalesBranchCreate = async (companyId: number, data: FormData) => {
  const response = await ERP_API.post(PATH.api.postSalesBranchCreate(companyId), data);
  return response.data;
};

// 판매사업장 지점 정보 수정
export const patchSalesBranchUpdate = async (branchId: number, data: FormData) => {
  const response = await ERP_API.patch(PATH.api.patchSalesBranchUpdate(branchId), data);
  return response.data;
};
