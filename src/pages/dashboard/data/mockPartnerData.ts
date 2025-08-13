import { PartnerCompany, PartnerListResponse } from '@/pages/dashboard/types/dashboard';

// 파트너사 mock 데이터
export const mockPartnerData: PartnerCompany[] = [
  {
    partner_company_id: 1,
    b_nm: '장한유통(야채)',
  },
  {
    partner_company_id: 3,
    b_nm: '유나팩',
  },
  {
    partner_company_id: 4,
    b_nm: '싱싱닭고기',
  },
  {
    partner_company_id: 5,
    b_nm: '강철',
  },
  {
    partner_company_id: 7,
    b_nm: '초인유통(야채)',
  },
];

// 파트너사 목록 조회 API 시뮬레이션
export const fetchPartnerList = async (
  searchKeyword?: string,
  page?: number,
  pageSize?: number,
): Promise<PartnerListResponse> => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(
    `[${timestamp}] 파트너사 목록 API 호출 - 검색어: ${searchKeyword}, 페이지: ${page}, 페이지크기: ${pageSize}`,
  );

  // 실제 API 호출 시뮬레이션을 위한 딜레이
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 300));

  let filteredPartners = [...mockPartnerData];

  // 검색 기능
  if (searchKeyword && searchKeyword.trim()) {
    filteredPartners = filteredPartners.filter(
      (partner) =>
        partner.b_nm.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        partner.partner_company_id.toString().includes(searchKeyword),
    );
  }

  // 페이징 처리
  const totalCount = filteredPartners.length;
  if (page && pageSize) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    filteredPartners = filteredPartners.slice(startIndex, endIndex);
  }

  const response: PartnerListResponse = {
    partners: filteredPartners,
    total_count: totalCount,
  };

  console.log(
    `[${timestamp}] 파트너사 목록 반환 완료 - 총 ${totalCount}개 중 ${filteredPartners.length}개 반환`,
  );

  return response;
};

// 특정 파트너사 정보 조회
export const fetchPartnerById = async (partnerId: number): Promise<PartnerCompany | null> => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 파트너사 상세 API 호출 - ID: ${partnerId}`);

  // 실제 API 호출 시뮬레이션을 위한 딜레이
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 200));

  const partner = mockPartnerData.find((p) => p.partner_company_id === partnerId);

  if (partner) {
    console.log(`[${timestamp}] 파트너사 상세 반환 완료 - ${partner.b_nm}`);
  } else {
    console.log(`[${timestamp}] 파트너사를 찾을 수 없음 - ID: ${partnerId}`);
  }

  return partner || null;
};

// 파트너사 생성 시뮬레이션
export const createPartner = async (
  partnerData: Omit<PartnerCompany, 'partner_company_id'>,
): Promise<PartnerCompany> => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 파트너사 생성 API 호출 - 이름: ${partnerData.b_nm}`);

  // 실제 API 호출 시뮬레이션을 위한 딜레이
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1500 + 500));

  // 새로운 ID 생성 (기존 ID 중 최대값 + 1)
  const maxId = Math.max(...mockPartnerData.map((p) => p.partner_company_id));
  const newPartner: PartnerCompany = {
    partner_company_id: maxId + 1,
    b_nm: partnerData.b_nm,
  };

  // mock 데이터에 추가 (실제로는 서버에 저장)
  mockPartnerData.push(newPartner);

  console.log(
    `[${timestamp}] 파트너사 생성 완료 - ID: ${newPartner.partner_company_id}, 이름: ${newPartner.b_nm}`,
  );

  return newPartner;
};

// 파트너사 수정 시뮬레이션
export const updatePartner = async (
  partnerId: number,
  partnerData: Partial<Omit<PartnerCompany, 'partner_company_id'>>,
): Promise<PartnerCompany | null> => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 파트너사 수정 API 호출 - ID: ${partnerId}`);

  // 실제 API 호출 시뮬레이션을 위한 딜레이
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1200 + 400));

  const partnerIndex = mockPartnerData.findIndex((p) => p.partner_company_id === partnerId);

  if (partnerIndex === -1) {
    console.log(`[${timestamp}] 수정할 파트너사를 찾을 수 없음 - ID: ${partnerId}`);
    return null;
  }

  // 파트너사 정보 업데이트
  const updatedPartner = {
    ...mockPartnerData[partnerIndex],
    ...partnerData,
  };

  mockPartnerData[partnerIndex] = updatedPartner;

  console.log(`[${timestamp}] 파트너사 수정 완료 - ID: ${partnerId}, 이름: ${updatedPartner.b_nm}`);

  return updatedPartner;
};

// 파트너사 삭제 시뮬레이션
export const deletePartner = async (partnerId: number): Promise<boolean> => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 파트너사 삭제 API 호출 - ID: ${partnerId}`);

  // 실제 API 호출 시뮬레이션을 위한 딜레이
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 300));

  const partnerIndex = mockPartnerData.findIndex((p) => p.partner_company_id === partnerId);

  if (partnerIndex === -1) {
    console.log(`[${timestamp}] 삭제할 파트너사를 찾을 수 없음 - ID: ${partnerId}`);
    return false;
  }

  const deletedPartner = mockPartnerData[partnerIndex];
  mockPartnerData.splice(partnerIndex, 1);

  console.log(`[${timestamp}] 파트너사 삭제 완료 - ID: ${partnerId}, 이름: ${deletedPartner.b_nm}`);

  return true;
};

// 파트너사 통계 정보 조회
export const fetchPartnerStats = async (): Promise<{
  total_partners: number;
  active_partners: number;
  recent_additions: number;
}> => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 파트너사 통계 API 호출`);

  // 실제 API 호출 시뮬레이션을 위한 딜레이
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 800 + 200));

  const stats = {
    total_partners: mockPartnerData.length,
    active_partners: mockPartnerData.length, // 모든 파트너사가 활성 상태로 가정
    recent_additions: Math.floor(Math.random() * 3) + 1, // 최근 추가된 파트너사 수 (임의 생성)
  };

  console.log(`[${timestamp}] 파트너사 통계 반환 완료 - 총 ${stats.total_partners}개 파트너사`);

  return stats;
};
