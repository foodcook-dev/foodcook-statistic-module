import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { IDatasource, IGetRowsParams, GridReadyEvent, CellClickedEvent } from 'ag-grid-community';
import { DateRange } from 'react-day-picker';
import { startOfMonth, format } from 'date-fns';
import { initializeColumnStateManagement, STORAGE_KEYS } from '@/libs/column-state';
import { getIntegratedCompany } from '@/libs/purchaser-dashboard-api';
import { IntegratedCompanyItem } from '@/types/settlement';

type UseIntegratedSettlementReturn = {
  gridRef: React.RefObject<AgGridReact | null>;
  dateRange: DateRange;
  handleCellClick: (event: CellClickedEvent<IntegratedCompanyItem>) => void;
  setDateRange: (dateRange: DateRange) => void;
  onGridReady: (event: GridReadyEvent) => void;
  error: string | null;
  totalPurchaseAmount: number | null;
  isFiltered: boolean;
  totalCount: number | null;
  resetFilters: () => void;
};

const STORAGE_KEY = STORAGE_KEYS.INTEGRATED_SETTLEMENT;

export const useIntegratedSettlement = (): UseIntegratedSettlementReturn => {
  const navigate = useNavigate();
  const gridRef = useRef<AgGridReact>(null);
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(today),
    to: today,
  });
  const [error, setError] = useState<string | null>(null);
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState<number | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const createDataSource = useCallback((): IDatasource => {
    return {
      getRows: async (params: IGetRowsParams) => {
        if (!dateRange.from || !dateRange.to) {
          params.failCallback();
          return;
        }

        try {
          const page = Math.floor(params.startRow / 100) + 1;
          const size = 100;

          const response = await getIntegratedCompany({
            startDate: format(dateRange.from, 'yyyy-MM-dd'),
            endDate: format(dateRange.to, 'yyyy-MM-dd'),
            filter: JSON.stringify(params.filterModel),
            sort: JSON.stringify(params.sortModel),
            page,
            pageSize: size,
          });

          const rowsThisBlock = response?.items ?? [];
          const totalRows = response?.total ?? 0;
          setTotalPurchaseAmount(response?.total_purchase_amount ?? null);
          setIsFiltered(Object.keys(params.filterModel ?? {}).length > 0);

          setTotalCount(totalRows);
          params.successCallback(rowsThisBlock, totalRows);
        } catch (e: any) {
          console.error('Failed to fetch data:', e);
          setError(e.error);
          setTotalPurchaseAmount(null);
          setTotalCount(null);
          params.failCallback();
        }
      },
    };
  }, [dateRange.from, dateRange.to]);

  const resetFilters = useCallback(() => {
    // 필터 모델이 바뀌면 그리드가 datasource를 다시 호출해 목록과 총 매입액이 함께 갱신된다.
    gridRef.current?.api?.setFilterModel(null);
  }, []);

  const handleCellClick = (event: CellClickedEvent<IntegratedCompanyItem>) => {
    if (event.colDef?.field === 'b_nm' && event.data) {
      const row = event.data;
      const state = { id: row.company_id, name: row.b_nm, dateRange };
      if (row.type === 'buy') {
        navigate('/direct', { state });
      } else if (row.type === 'partner') {
        navigate('/consignment', { state });
      }
    }
  };

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
    setTotalPurchaseAmount(null);
    setTotalCount(null);
    if (gridRef.current?.api && dateRange.from && dateRange.to) {
      const dataSource = createDataSource();
      gridRef.current.api.setGridOption('datasource', dataSource);
    }
  }, [dateRange.from, dateRange.to, createDataSource]);

  return {
    gridRef,
    dateRange,
    handleCellClick,
    setDateRange,
    onGridReady,
    error,
    totalPurchaseAmount,
    isFiltered,
    totalCount,
    resetFilters,
  };
};
