import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { startOfMonth, format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import createAxios from '@/libs/createAxiosInstance';

interface SelectedPartner {
  id: string;
  name: string;
}

interface UseDirectSettlementReturn {
  dateRange: DateRange;
  selectedPartner: SelectedPartner;
  setDateRange: (dateRange: DateRange) => void;
  setSelectedPartner: (partner: SelectedPartner) => void;
  partnerInfo: any;
  partnerDetails: any;
  isPartnerInfoLoading: boolean;
  isPartnerDetailsLoading: boolean;
}

export const useConsignmentSettlement = (): UseDirectSettlementReturn => {
  const today = new Date();

  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(today),
    to: today,
  });

  const [selectedPartner, setSelectedPartner] = useState<SelectedPartner>({
    id: '',
    name: '',
  });

  const partnerInfoResponse = useQuery({
    queryKey: ['partner_companies', selectedPartner.id],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint: `/partner/partner_companies/${selectedPartner.id}/`,
      }),
    enabled: !!selectedPartner.id,
  });

  const partnerDetailResponse = useQuery({
    queryKey: ['details', selectedPartner.id, dateRange.from, dateRange.to],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint: `/partner/partner_companies/${selectedPartner.id}/details/`,
        params: {
          start_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
          end_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
        },
      }),
    enabled: !!selectedPartner.id && !!dateRange.from && !!dateRange.to,
  });

  return {
    dateRange,
    selectedPartner,
    setDateRange,
    setSelectedPartner,
    partnerInfo: partnerInfoResponse.data,
    isPartnerInfoLoading: partnerInfoResponse.isLoading,
    partnerDetails: partnerDetailResponse.data,
    isPartnerDetailsLoading: partnerDetailResponse.isLoading,
  };
};
