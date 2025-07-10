import { useState, useCallback, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { IDatasource, IGetRowsParams, GridReadyEvent } from 'ag-grid-community';
import { DateRange } from 'react-day-picker';
import { startOfMonth, format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import createAxios from '@/libs/create-axios-instance';
import { initializeColumnStateManagement, STORAGE_KEYS } from '@/libs/column-state';
import { PaymentData } from '@/components/modules/payment-dialog';

type SelectedBuyer = {
  id: string;
  name: string;
};

export const useDirectSettlement = () => {
  const STORAGE_KEY = STORAGE_KEYS.DIRECT_SETTLEMENT;
  const gridRef = useRef<AgGridReact>(null);
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

  const createDataSource = useCallback((): IDatasource => {
    return {
      getRows: async (params: IGetRowsParams) => {
        if (!selectedBuyer.id || !dateRange.from || !dateRange.to) {
          params.failCallback();
          return;
        }

        try {
          const page = Math.floor(params.startRow / 50) + 1;
          const size = 50;

          const response = await createAxios({
            method: 'get',
            endpoint: `/purchase/buy_companies/${selectedBuyer.id}/details/`,
            params: {
              start_date: format(dateRange.from, 'yyyy-MM-dd'),
              end_date: format(dateRange.to, 'yyyy-MM-dd'),
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
  }, [selectedBuyer.id, dateRange.from, dateRange.to]);

  const handlePaymentSubmit = useCallback(
    async (data: PaymentData) => {
      try {
        await createAxios({
          method: 'post',
          endpoint: `/purchase/buy_companies/${selectedBuyer.id}/payment/`,
          body: {
            payment_date: format(data.processDate!, 'yyyy-MM-dd'),
            payment_amount: Number(data.amount),
            manager: data.manager,
            payment_note: data.notes,
          },
        });

        if (gridRef.current?.api && selectedBuyer.id && dateRange.from && dateRange.to) {
          const newDataSource = createDataSource();
          gridRef.current.api.setGridOption('datasource', newDataSource);
        }
      } catch (error) {
        console.error('Failed to submit payment:', error);
      }
    },
    [selectedBuyer.id, dateRange.from, dateRange.to, createDataSource],
  );

  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      initializeColumnStateManagement(STORAGE_KEY, event.api);

      if (selectedBuyer.id && dateRange.from && dateRange.to) {
        const dataSource = createDataSource();
        event.api.setGridOption('datasource', dataSource);
      }
    },
    [selectedBuyer.id, dateRange.from, dateRange.to, createDataSource, STORAGE_KEY],
  );

  useEffect(() => {
    if (gridRef.current?.api && selectedBuyer.id && dateRange.from && dateRange.to) {
      const dataSource = createDataSource();
      gridRef.current.api.setGridOption('datasource', dataSource);
    }
  }, [selectedBuyer.id, dateRange.from, dateRange.to, createDataSource]);

  return {
    gridRef,
    dateRange,
    selectedBuyer,
    buyerInfo: buyerInfoResponse.data,
    isBuyerInfoLoading: buyerInfoResponse.isLoading,
    setDateRange,
    setSelectedBuyer,
    handlePaymentSubmit,
    onGridReady,
  };
};
