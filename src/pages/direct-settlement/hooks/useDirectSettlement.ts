import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { startOfMonth, format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import createAxios from '@/libs/createAxiosInstance';

interface SelectedBuyer {
  id: string;
  name: string;
}

interface UseDirectSettlementReturn {
  dateRange: DateRange;
  selectedBuyer: SelectedBuyer;
  setDateRange: (dateRange: DateRange) => void;
  setSelectedBuyer: (buyer: SelectedBuyer) => void;
  buyerInfo: any;
  buyerDetails: any;
  isBuyerInfoLoading: boolean;
  isBuyerDetailsLoading: boolean;
}

export const useDirectSettlement = (): UseDirectSettlementReturn => {
  const today = new Date();

  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(today),
    to: today,
  });

  const [selectedBuyer, setSelectedBuyer] = useState<SelectedBuyer>({
    id: '',
    name: '',
  });

  const buyerInfoResponse = useQuery({
    queryKey: ['buy_companies', selectedBuyer.id],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint: `/purchase/buy_companies/${selectedBuyer.id}/`,
      }),
    enabled: !!selectedBuyer.id,
  });

  const buyerDetailResponse = useQuery({
    queryKey: ['details', selectedBuyer.id, dateRange.from, dateRange.to],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint: `/purchase/buy_companies/${selectedBuyer.id}/details/`,
        params: {
          start_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
          end_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
        },
      }),
    enabled: !!selectedBuyer.id && !!dateRange.from && !!dateRange.to,
  });

  return {
    dateRange,
    selectedBuyer,
    setDateRange,
    setSelectedBuyer,
    buyerInfo: buyerInfoResponse.data,
    isBuyerInfoLoading: buyerInfoResponse.isLoading,
    buyerDetails: buyerDetailResponse.data,
    isBuyerDetailsLoading: buyerDetailResponse.isLoading,
  };
};
