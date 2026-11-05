import { API } from '@/libs/api';
import { PATH } from '@/constants/api-path';
import { getFilenameFromDisposition } from '@/utils/download';
import {
  DirectCompanyDetailResponse,
  IntegratedCompanyResponse,
  ConsignmentCompanyDetailResponse,
  SettlementType,
  DirectCompanyListItem,
  ConsignmentCompanyListItem,
  DirectCompanyInfo,
  ConsignmentCompanyInfo,
  SettlementLogItem,
} from '@/types/settlement';

// 엑셀 파일 공통 요청
const getExcelFile = async (
  url: string,
  params: Record<string, string>,
): Promise<{ blob: Blob; filename: string | null }> => {
  const response = await API.get<Blob>(url, { params, responseType: 'blob' });
  return {
    blob: response.data,
    filename: getFilenameFromDisposition(response.headers['content-disposition']),
  };
};

// 통합 매입사: 기간 내 전체 매입사(직매입·위탁) 정산 목록 조회 (페이지네이션 + 총 매입액)
export const getIntegratedCompany = async (params: {
  startDate: string;
  endDate: string;
  filter: string;
  sort: string;
  page: number;
  pageSize: number;
}): Promise<IntegratedCompanyResponse> => {
  const response = await API.get<IntegratedCompanyResponse>(PATH.api.getIntegratedCompany, {
    params: {
      start_date: params.startDate,
      end_date: params.endDate,
      filter: params.filter,
      sort: params.sort,
      page: params.page,
      size: params.pageSize,
    },
  });

  return response.data;
};

// 통합 매입사: 엑셀 다운로드 (필터, 정렬 적용)
export const getIntegratedCompanyExcel = async (params: {
  startDate: string;
  endDate: string;
  filter: string;
  sort: string;
}) =>
  getExcelFile(PATH.api.getIntegratedCompanyExcel, {
    start_date: params.startDate,
    end_date: params.endDate,
    filter: params.filter,
    sort: params.sort,
  });

// 직매입사 선택 목록 조회
export const getDirectCompanyList = async (): Promise<DirectCompanyListItem[]> => {
  const response = await API.get<DirectCompanyListItem[]>(PATH.api.getBuyCompanyList);
  return response.data;
};

// 직매입사 기본 정보 조회
export const getDirectCompany = async (companyId: string): Promise<DirectCompanyInfo> => {
  const response = await API.get<DirectCompanyInfo>(PATH.api.getBuyCompanyInfo(companyId));
  return response.data;
};

// 직매입사 기간 내 상세 내역(전기이월·매입·반품·결제) 조회 (페이지네이션 + 총 매입액)
export const getDirectCompanyDetails = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: {
    startDate: string;
    endDate: string;
    filter: string;
    page: number;
    pageSize: number;
  };
}): Promise<DirectCompanyDetailResponse> => {
  const response = await API.get<DirectCompanyDetailResponse>(
    PATH.api.getBuyCompanyDetail(companyId),
    {
      params: {
        start_date: params.startDate,
        end_date: params.endDate,
        filter: params.filter,
        page: params.page,
        size: params.pageSize,
      },
    },
  );

  return response.data;
};

// 직매입사: 기간 내 상세 내역 엑셀 다운로드 (필터 적용)
export const getDirectCompanyExcel = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: { startDate: string; endDate: string; filter: string };
}) =>
  getExcelFile(PATH.api.getBuyCompanyExcel(companyId), {
    start_date: params.startDate,
    end_date: params.endDate,
    filter: params.filter,
  });

// 직매입사 결제 내역 등록
export const postDirectCompanyPayment = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: {
    amount: number;
    date: string;
    note: string;
  };
}): Promise<any> => {
  const response = await API.post(PATH.api.buyCompanyPayment(companyId), {
    payment_date: params.date,
    payment_amount: params.amount,
    payment_note: params.note,
  });
  return response.data;
};

// 직매입사 결제 내역 수정 (금액·비고)
export const patchDirectCompanyPayment = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: {
    id: string;
    amount: number;
    note: string;
  };
}): Promise<any> => {
  const response = await API.patch(PATH.api.buyCompanyPayment(companyId), {
    detail_id: params.id,
    payment_amount: params.amount,
    payment_note: params.note,
  });
  return response.data;
};

// 직매입사 결제 내역 삭제
export const deleteDirectCompanyPayment = async ({
  companyId,
  id,
}: {
  companyId: string;
  id: string;
}): Promise<any> => {
  const response = await API.delete(PATH.api.buyCompanyPayment(companyId), {
    params: {
      detail_id: id,
    },
  });
  return response.data;
};

// 위탁매입사 선택 목록 조회
export const getConsignmentCompanyList = async (): Promise<ConsignmentCompanyListItem[]> => {
  const response = await API.get<ConsignmentCompanyListItem[]>(PATH.api.getPartnerCompanyList);
  return response.data;
};

// 위탁매입사 기본 정보 조회
export const getConsignmentCompany = async (companyId: string): Promise<ConsignmentCompanyInfo> => {
  const response = await API.get<ConsignmentCompanyInfo>(PATH.api.getPartnerCompanyInfo(companyId));
  return response.data;
};

// 위탁매입사 기간 내 상세 내역(전기이월·매입·반품·결제) 조회 (페이지네이션 + 총 매입액)
export const getConsignmentCompanyDetails = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: {
    startDate: string;
    endDate: string;
    filter: string;
    page: number;
    pageSize: number;
  };
}): Promise<ConsignmentCompanyDetailResponse> => {
  const response = await API.get<ConsignmentCompanyDetailResponse>(
    PATH.api.getPartnerCompanyDetail(companyId),
    {
      params: {
        start_date: params.startDate,
        end_date: params.endDate,
        filter: params.filter,
        page: params.page,
        size: params.pageSize,
      },
    },
  );

  return response.data;
};

// 위탁매입사: 기간 내 상세 내역 엑셀 다운로드 (필터 적용)
export const getConsignmentCompanyExcel = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: { startDate: string; endDate: string; filter: string };
}) =>
  getExcelFile(PATH.api.getPartnerCompanyExcel(companyId), {
    start_date: params.startDate,
    end_date: params.endDate,
    filter: params.filter,
  });

// 위탁매입사 결제 내역 등록
export const postConsignmentCompanyPayment = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: {
    amount: number;
    date: string;
    note: string;
  };
}): Promise<any> => {
  const response = await API.post(PATH.api.partnerCompanyPayment(companyId), {
    payment_date: params.date,
    payment_amount: params.amount,
    payment_note: params.note,
  });
  return response.data;
};

// 위탁매입사 결제 내역 수정 (금액·비고)
export const patchConsignmentCompanyPayment = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: {
    id: string;
    amount: number;
    note: string;
  };
}): Promise<any> => {
  const response = await API.patch(PATH.api.partnerCompanyPayment(companyId), {
    detail_id: params.id,
    payment_amount: params.amount,
    payment_note: params.note,
  });
  return response.data;
};

// 위탁매입사 결제 내역 삭제
export const deleteConsignmentCompanyPayment = async ({
  companyId,
  id,
}: {
  companyId: string;
  id: string;
}): Promise<any> => {
  const response = await API.delete(PATH.api.partnerCompanyPayment(companyId), {
    params: {
      detail_id: id,
    },
  });
  return response.data;
};

// 상세 내역 한 건의 변경 이력 조회 (direct: 직매입사, consignment: 위탁매입사)
export const getLog = async ({
  type,
  companyId,
  detailId,
}: {
  type: SettlementType;
  companyId: string;
  detailId: string;
}): Promise<SettlementLogItem[]> => {
  const endpoint = type === 'direct' ? PATH.api.getBuyLog : PATH.api.getPartnerLog;

  const response = await API.get<SettlementLogItem[]>(endpoint, {
    params: {
      company_id: companyId,
      detail_id: detailId,
    },
  });

  return response.data;
};
