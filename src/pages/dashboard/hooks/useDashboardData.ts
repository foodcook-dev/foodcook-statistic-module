import { useQuery } from '@tanstack/react-query';
import { DashboardApiResponse } from '@/pages/dashboard/types/dashboard';
import { fetchDashboardData } from '@/pages/dashboard/data/mockDashboardData';

interface UseDashboardDataParams {
  startDate?: string;
  endDate?: string;
  partnerId?: number;
  enabled?: boolean; // 쿼리 실행 여부를 제어
}

interface UseDashboardDataReturn {
  data: DashboardApiResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useDashboardData = ({
  startDate,
  endDate,
  partnerId,
  enabled = true,
}: UseDashboardDataParams = {}): UseDashboardDataReturn => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard', startDate, endDate, partnerId],
    queryFn: () => fetchDashboardData(startDate, endDate, partnerId),
    enabled,
    staleTime: 0, // 데이터를 항상 stale로 간주하여 자동 리페치 허용
    gcTime: 2 * 60 * 1000, // 2분간 캐시 유지 (구 cacheTime)
    refetchOnWindowFocus: false,
    refetchInterval: 10 * 1000, // 10초마다 자동 리페치
    refetchIntervalInBackground: true, // 백그라운드에서도 리페치 실행
    retry: 2,
  });

  return {
    data,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};
