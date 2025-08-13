import { useState, useEffect, useCallback } from 'react';
import { PartnerCompany, PartnerListResponse } from '@/pages/dashboard/types/dashboard';
import { fetchPartnerList } from '@/pages/dashboard/data/mockPartnerData';

interface UsePartnerDataOptions {
  initialLoad?: boolean;
  searchKeyword?: string;
  page?: number;
  pageSize?: number;
}

interface UsePartnerDataReturn {
  partners: PartnerCompany[];
  currentPartner: PartnerCompany | null;
  error: string | null;
  // 액션
  loadPartners: (options?: {
    searchKeyword?: string;
    page?: number;
    pageSize?: number;
  }) => Promise<void>;

  // 유틸리티
  refetch: () => Promise<void>;
}

export const usePartnerData = (options: UsePartnerDataOptions = {}): UsePartnerDataReturn => {
  const { initialLoad = true, searchKeyword = '', page = 1, pageSize = 10 } = options;

  const [partners, setPartners] = useState<PartnerCompany[]>([]);
  const [currentPartner, setCurrentPartner] = useState<PartnerCompany | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 파트너사 목록 로드
  const loadPartners = useCallback(
    async (loadOptions?: { searchKeyword?: string; page?: number; pageSize?: number }) => {
      try {
        setError(null);

        const response: PartnerListResponse = await fetchPartnerList(
          loadOptions?.searchKeyword || searchKeyword,
          loadOptions?.page || page,
          loadOptions?.pageSize || pageSize,
        );

        setPartners(response.partners);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '파트너사 목록을 불러오는데 실패했습니다.';
        setError(errorMessage);
        console.error('파트너사 목록 로드 실패:', err);
      } finally {
      }
    },
    [searchKeyword, page, pageSize],
  );

  // 리패치
  const refetch = useCallback(async () => {
    await Promise.all([loadPartners()]);
  }, [loadPartners]);

  // 초기 로드
  useEffect(() => {
    if (initialLoad) {
      loadPartners();
    }
  }, [initialLoad, loadPartners]);

  return {
    // 데이터
    partners,
    currentPartner,
    error,

    // 액션
    loadPartners,

    // 유틸리티
    refetch,
  };
};
