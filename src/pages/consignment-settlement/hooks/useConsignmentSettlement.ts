import { useState, useRef, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { IDatasource, IGetRowsParams, GridReadyEvent } from 'ag-grid-community';
import { DateRange } from 'react-day-picker';
import { startOfMonth, format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import createAxios from '@/libs/create-axios-instance';
import { initializeColumnStateManagement, STORAGE_KEYS } from '@/libs/column-state';
import { PaymentData } from '@/components/modules/payment-dialog';
import { useConfirm } from '@/hooks/useConfirm';

interface SelectedPartner {
  id: string;
  name: string;
}

export const useConsignmentSettlement = () => {
  const setConfirm = useConfirm();
  const STORAGE_KEY = STORAGE_KEYS.CONSIGNMENT_SETTLEMENT;
  const gridRef = useRef<AgGridReact>(null);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date();
    return {
      from: startOfMonth(today),
      to: today,
    };
  });
  const [selectedPartner, setSelectedPartner] = useState<SelectedPartner>({
    id: '',
    name: '',
  });

  const dateRangeRef = useRef(dateRange);
  useEffect(() => {
    dateRangeRef.current = dateRange;
  }, [dateRange]);

  const partnerInfoResponse = useQuery({
    queryKey: ['partner_companies', selectedPartner.id],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint: `/partner/partner_companies/${selectedPartner.id}/`,
      }),
    enabled: !!selectedPartner.id,
  });

  const createDataSource = useCallback((): IDatasource => {
    return {
      getRows: async (params: IGetRowsParams) => {
        const { from, to } = dateRangeRef.current;
        if (!selectedPartner.id || !from || !to) {
          params.failCallback();
          return;
        }

        try {
          const page = Math.floor(params.startRow / 50) + 1;
          const size = 50;
          const startDate = format(from, 'yyyy-MM-dd');
          const endDate = format(to, 'yyyy-MM-dd');

          const response = await createAxios({
            method: 'get',
            endpoint: `/partner/partner_companies/${selectedPartner.id}/details/`,
            params: {
              start_date: startDate,
              end_date: endDate,
              filter: JSON.stringify(params.filterModel),
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
  }, [selectedPartner.id]);

  const handlePaymentSubmit = useCallback(
    async (data: PaymentData) => {
      try {
        await createAxios({
          method: 'post',
          endpoint: `/partner/partner_companies/${selectedPartner.id}/payment/`,
          body: {
            payment_date: format(data.processDate!, 'yyyy-MM-dd'),
            payment_amount: Number(data.amount),
            payment_note: data.notes,
          },
        });

        if (gridRef.current?.api && selectedPartner.id && dateRange.from && dateRange.to) {
          const newDataSource = createDataSource();
          gridRef.current.api.setGridOption('datasource', newDataSource);
        }
      } catch (error) {
        console.error('Failed to submit payment:', error);
      }
    },
    [selectedPartner.id, dateRange.from, dateRange.to, createDataSource],
  );

  const handleEdit = useCallback(
    async (data: PaymentData) => {
      try {
        await createAxios({
          method: 'patch',
          endpoint: `/partner/partner_companies/${selectedPartner.id}/payment/`,
          body: {
            detail_id: String(data.id),
            payment_amount: Number(data.amount),
            payment_note: data.notes,
          },
        });

        if (gridRef.current?.api && selectedPartner.id && dateRange.from && dateRange.to) {
          const newDataSource = createDataSource();
          gridRef.current.api.setGridOption('datasource', newDataSource);
        }
      } catch (error) {
        console.error('Failed to edit payment:', error);
      }
    },
    [selectedPartner.id, dateRange.from, dateRange.to, createDataSource],
  );

  const handleDelete = useCallback(
    async (rowData: any) => {
      try {
        const result = await setConfirm({ message: '결제데이터를 삭제하시겠습니까?' });

        if (result) {
          await createAxios({
            method: 'delete',
            endpoint: `/partner/partner_companies/${selectedPartner.id}/payment/`,
            params: { detail_id: rowData.detail_id },
          });

          if (gridRef.current?.api && selectedPartner.id && dateRange.from && dateRange.to) {
            const newDataSource = createDataSource();
            gridRef.current.api.setGridOption('datasource', newDataSource);
          }
        }
      } catch (error) {
        console.error('Failed to delete row:', error);
      }
    },
    [selectedPartner.id, dateRange.from, dateRange.to, createDataSource],
  );

  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      initializeColumnStateManagement(STORAGE_KEY, event.api);

      if (selectedPartner.id && dateRange.from && dateRange.to) {
        const dataSource = createDataSource();
        event.api.setGridOption('datasource', dataSource);
      }
    },
    [selectedPartner.id, dateRange.from, dateRange.to, STORAGE_KEY],
  );

  useEffect(() => {
    if (gridRef.current?.api && selectedPartner.id && dateRange.from && dateRange.to) {
      const dataSource = createDataSource();
      gridRef.current.api.setGridOption('datasource', dataSource);
    }
  }, [selectedPartner.id, dateRange.from, dateRange.to]);

  return {
    gridRef,
    dateRange,
    selectedPartner,
    partnerInfo: partnerInfoResponse.data,
    isPartnerInfoLoading: partnerInfoResponse.isLoading,
    setDateRange,
    setSelectedPartner,
    handleEdit,
    handleDelete,
    onGridReady,
    handlePaymentSubmit,
  };
};
