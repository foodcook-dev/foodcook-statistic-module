import { useState, useCallback, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { IDatasource, IGetRowsParams, GridReadyEvent } from 'ag-grid-community';
import { DateRange } from 'react-day-picker';
import { startOfMonth, format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import createAxios from '@/libs/create-axios-instance';
import { initializeColumnStateManagement, STORAGE_KEYS } from '@/libs/column-state';
import { PaymentData } from '@/components/modules/payment-dialog';
import useFetch from '@/hooks/useFetch';
import { useConfirm } from '@/hooks/useConfirm';
import useAlertStore from '@/store/alert';
import { useLocation } from 'react-router-dom';

const PAGE_SIZE = 50;
const MESSAGES = {
  PAYMENT_CREATED: '결제 정보가 입력되었습니다.',
  DELETE_CONFIRM: '결제데이터를 삭제하시겠습니까?',
} as const;

type SelectedBuyer = {
  id: string;
  name: string;
};

export const useDirectSettlement = () => {
  const location = useLocation();
  const setConfirm = useConfirm();
  const { setAlertMessage } = useAlertStore();
  const STORAGE_KEY = STORAGE_KEYS.DIRECT_SETTLEMENT;
  const gridRef = useRef<AgGridReact>(null);
  const [dateRange, setDateRange] = useState<DateRange>(
    location.state?.dateRange || {
      from: startOfMonth(new Date()),
      to: new Date(),
    },
  );
  const [selectedBuyer, setSelectedBuyer] = useState<SelectedBuyer>({
    id: location.state?.id || '',
    name: location.state?.name || '',
  });

  const dateRangeRef = useRef(dateRange);
  useEffect(() => {
    dateRangeRef.current = dateRange;
  }, [dateRange]);

  const buyerInfoResponse = useQuery({
    queryKey: ['buy_companies', selectedBuyer.id],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint: `/purchase/buy_companies/${selectedBuyer.id}/`,
      }),
    enabled: !!selectedBuyer.id,
  });

  const createDataSource = useCallback((): IDatasource => {
    return {
      getRows: async (params: IGetRowsParams) => {
        const { from, to } = dateRangeRef.current;
        if (!selectedBuyer.id || !from || !to) {
          params.failCallback();
          return;
        }

        try {
          const page = Math.floor(params.startRow / PAGE_SIZE) + 1;
          const startDate = format(from, 'yyyy-MM-dd');
          const endDate = format(to, 'yyyy-MM-dd');

          const response = await createAxios({
            method: 'get',
            endpoint: `/purchase/buy_companies/${selectedBuyer.id}/details/`,
            params: {
              start_date: startDate,
              end_date: endDate,
              filter: JSON.stringify(params.filterModel),
              page,
              size: PAGE_SIZE,
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
  }, [selectedBuyer.id]);

  const refreshGridData = useCallback(() => {
    if (gridRef.current?.api && selectedBuyer.id && dateRange.from && dateRange.to) {
      const newDataSource = createDataSource();
      gridRef.current.api.setGridOption('datasource', newDataSource);
    }
  }, [createDataSource, selectedBuyer.id, dateRange.from, dateRange.to]);

  const { request: submitPaymentRequest } = useFetch({
    requestFn: async (data: PaymentData) => {
      return await createAxios({
        method: 'post',
        endpoint: `/purchase/buy_companies/${selectedBuyer.id}/payment/`,
        body: {
          payment_date: format(data.processDate!, 'yyyy-MM-dd'),
          payment_amount: Number(data.amount),
          payment_note: data.notes,
        },
      });
    },
    onSuccess: () => {
      refreshGridData();
      setAlertMessage(MESSAGES.PAYMENT_CREATED);
    },
  });

  const { request: editPaymentRequest } = useFetch({
    requestFn: async (data: PaymentData) => {
      return await createAxios({
        method: 'patch',
        endpoint: `/purchase/buy_companies/${selectedBuyer.id}/payment/`,
        body: {
          detail_id: String(data.id),
          payment_amount: Number(data.amount),
          payment_note: data.notes,
        },
      });
    },
    onSuccess: () => {
      refreshGridData();
    },
    showSpinner: true,
    spinnerMessage: '결제 정보 수정 중',
  });

  const { request: deletePaymentRequest } = useFetch({
    requestFn: async (rowData: any) => {
      return await createAxios({
        method: 'delete',
        endpoint: `/purchase/buy_companies/${selectedBuyer.id}/payment/`,
        params: { detail_id: rowData.detail_id },
      });
    },
    onSuccess: () => {
      refreshGridData();
    },
    showSpinner: true,
    spinnerMessage: '결제 정보 삭제 중',
  });

  const handleDelete = async (rowData: any) => {
    const result = await setConfirm({ message: MESSAGES.DELETE_CONFIRM });
    if (result) await deletePaymentRequest(rowData);
  };

  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      initializeColumnStateManagement(STORAGE_KEY, event.api);

      if (selectedBuyer.id && dateRange.from && dateRange.to) {
        const dataSource = createDataSource();
        event.api.setGridOption('datasource', dataSource);
      }
    },
    [selectedBuyer.id, dateRange.from, dateRange.to, STORAGE_KEY],
  );

  useEffect(() => {
    refreshGridData();
  }, [refreshGridData]);

  return {
    gridRef,
    dateRange,
    selectedBuyer,
    buyerInfo: buyerInfoResponse.data,
    isBuyerInfoLoading: buyerInfoResponse.isLoading,
    setDateRange,
    setSelectedBuyer,
    handlePaymentSubmit: submitPaymentRequest,
    handleEdit: editPaymentRequest,
    handleDelete,
    onGridReady,
  };
};
