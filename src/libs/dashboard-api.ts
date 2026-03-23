import { API } from '@/libs/api';
import { PATH } from '@/constants/api-path';
import { format } from 'date-fns';

export const getCompany = async (): Promise<any> => {
  const response = await API.get(PATH.api.getCompany);
  return response.data;
};

export const getDashboardData = async ({
  dateRange,
  periodType,
  isSelectable,
  selectedPartnerId,
}: {
  dateRange: { from?: Date; to?: Date };
  periodType: string;
  isSelectable: boolean;
  selectedPartnerId?: number;
}): Promise<any> => {
  const endpoint = isSelectable ? '/dashboard/main_by_company/' : '/dashboard/main/';
  const params: any = {
    start_date: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
    end_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
    type: periodType,
  };

  if (isSelectable) params.partner_company_id = selectedPartnerId;

  const response = await API.get(endpoint, { params });
  return response.data;
};
