import { useState, useRef, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { IDatasource, IGetRowsParams, GridReadyEvent } from 'ag-grid-community';
import { DateRange } from 'react-day-picker';
import { startOfMonth, format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import createAxios from '@/libs/createAxiosInstance';

interface SelectedPartner {
  id: string;
  name: string;
}

interface UseDirectSettlementReturn {
  gridRef: React.RefObject<AgGridReact | null>;
  dateRange: DateRange;
  selectedPartner: SelectedPartner;
  partnerInfo: any;
  isPartnerInfoLoading: boolean;
  setDateRange: (dateRange: DateRange) => void;
  setSelectedPartner: (partner: SelectedPartner) => void;
  onGridReady: (event: GridReadyEvent) => void;
}

export const useConsignmentSettlement = (): UseDirectSettlementReturn => {
  const gridRef = useRef<AgGridReact>(null);
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

  const createDataSource = useCallback((): IDatasource => {
    return {
      getRows: async (params: IGetRowsParams) => {
        if (!selectedPartner.id || !dateRange.from || !dateRange.to) {
          params.failCallback();
          return;
        }

        try {
          const page = Math.floor(params.startRow / 50) + 1;
          const size = 50;

          const response = await createAxios({
            method: 'get',
            endpoint: `/partner/partner_companies/${selectedPartner.id}/details/`,
            params: {
              start_date: format(dateRange.from, 'yyyy-MM-dd'),
              end_date: format(dateRange.to, 'yyyy-MM-dd'),
              page,
              size,
            },
          });

          const rowsThisBlock = response?.items || [];
          const totalRows = response?.total || 0;

          params.successCallback(rowsThisBlock, totalRows);
        } catch (error) {
          console.error('Failed to fetch data:', error);
          params.failCallback();
        }
      },
    };
  }, [selectedPartner.id, dateRange.from, dateRange.to]);

  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      event.api.sizeColumnsToFit();

      if (selectedPartner.id && dateRange.from && dateRange.to) {
        const dataSource = createDataSource();
        event.api.setGridOption('datasource', dataSource);
      }
    },
    [selectedPartner.id, dateRange.from, dateRange.to, createDataSource],
  );

  useEffect(() => {
    if (gridRef.current?.api && selectedPartner.id && dateRange.from && dateRange.to) {
      const dataSource = createDataSource();
      gridRef.current.api.setGridOption('datasource', dataSource);
    }
  }, [selectedPartner.id, dateRange.from, dateRange.to, createDataSource]);

  return {
    gridRef,
    dateRange,
    selectedPartner,
    partnerInfo: partnerInfoResponse.data,
    isPartnerInfoLoading: partnerInfoResponse.isLoading,
    setDateRange,
    setSelectedPartner,
    onGridReady,
  };
};
