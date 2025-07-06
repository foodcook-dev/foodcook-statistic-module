import { useState, useCallback, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { IDatasource, IGetRowsParams, GridReadyEvent } from 'ag-grid-community';
import { DateRange } from 'react-day-picker';
import { startOfMonth, format } from 'date-fns';
import createAxios from '@/libs/createAxiosInstance';
import { initializeColumnStateManagement, STORAGE_KEYS } from '@/libs/column-state-storage';

type UseIntegratedSettlementReturn = {
  gridRef: React.RefObject<AgGridReact | null>;
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
  onGridReady: (event: GridReadyEvent) => void;
  error: string | null;
};

export const useIntegratedSettlement = (): UseIntegratedSettlementReturn => {
  const STORAGE_KEY = STORAGE_KEYS.INTEGRATED_SETTLEMENT;
  const gridRef = useRef<AgGridReact>(null);
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(today),
    to: today,
  });
  const [error, setError] = useState<string | null>(null);

  const createDataSource = useCallback((): IDatasource => {
    return {
      getRows: async (params: IGetRowsParams) => {
        if (!dateRange.from || !dateRange.to) {
          params.failCallback();
          return;
        }

        try {
          const page = Math.floor(params.startRow / 50) + 1;
          const size = 50;

          const response = await createAxios({
            method: 'get',
            endpoint: `/integrate/integrate_companies/`,
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
        } catch (e: any) {
          console.error('Failed to fetch data:', e);
          setError(e.error);
          params.failCallback();
        }
      },
    };
  }, [dateRange.from, dateRange.to]);

  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      initializeColumnStateManagement(STORAGE_KEY, event.api);

      if (dateRange.from && dateRange.to) {
        const dataSource = createDataSource();
        event.api.setGridOption('datasource', dataSource);
      }
    },
    [dateRange.from, dateRange.to, createDataSource, STORAGE_KEY],
  );

  useEffect(() => {
    setError(null);
    if (gridRef.current?.api && dateRange.from && dateRange.to) {
      const dataSource = createDataSource();
      gridRef.current.api.setGridOption('datasource', dataSource);
    }
  }, [dateRange.from, dateRange.to, createDataSource]);

  return {
    gridRef,
    dateRange,
    setDateRange,
    onGridReady,
    error,
  };
};
