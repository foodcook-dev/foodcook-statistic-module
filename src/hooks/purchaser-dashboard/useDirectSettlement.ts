import { useState, useCallback, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useLocation } from 'react-router-dom';
import { IDatasource, IGetRowsParams, GridReadyEvent } from 'ag-grid-community';
import { DateRange } from 'react-day-picker';
import { startOfMonth, format } from 'date-fns';
import { useQuery, useMutation } from '@tanstack/react-query';

import { initializeColumnStateManagement, STORAGE_KEYS } from '@/libs/column-state';
import { PaymentData } from '@/components/modules/custom-dialog/payment-dialog';
import { useConfirm } from '@/hooks/useConfirm';
import { useAlert } from '@/hooks/useAlert';
import { downloadBlob } from '@/utils/download';
import {
  getBuyCompany,
  getBuyCompanyDetails,
  getBuyCompanyExcel,
  postBuyCompanyPayment,
  patchBuyCompanyPayment,
  deleteBuyCompanyPayment,
} from '@/libs/purchaser-dashboard-api';
import useSpinnerStore from '@/stores/spinner';
import { Vendor } from '@/types/settlement';

const PAGE_SIZE = 50;
const STORAGE_KEY = STORAGE_KEYS.DIRECT_SETTLEMENT;

export const useDirectSettlement = () => {
  const location = useLocation();
  const { setLoading } = useSpinnerStore();
  const setConfirm = useConfirm();
  const setAlert = useAlert();
  const gridRef = useRef<AgGridReact>(null);
  // 그리드 하단 요약 줄: 조회 조건(기간·필터)을 반영한 행 수와 매입액 총합 (조회 전·실패 시 null)
  const [isDownloading, setIsDownloading] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState<number | null>(null);
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>(
    location.state?.dateRange || {
      from: startOfMonth(today),
      to: today,
    },
  );
  const [selectedBuyer, setSelectedBuyer] = useState<Vendor>({
    id: location.state?.id || '',
    name: location.state?.name || '',
  });

  const selectedBuyerIdRef = useRef<string>(selectedBuyer.id);
  useEffect(() => {
    selectedBuyerIdRef.current = selectedBuyer.id;
  }, [selectedBuyer.id]);

  const dateRangeRef = useRef(dateRange);
  useEffect(() => {
    dateRangeRef.current = dateRange;
  }, [dateRange]);

  const buyerInfoResponse = useQuery({
    queryKey: ['buy_companies', selectedBuyer.id],
    queryFn: () => getBuyCompany(selectedBuyer.id),
    enabled: !!selectedBuyer.id,
  });

  const createDataSource = useCallback((): IDatasource => {
    return {
      getRows: async (params: IGetRowsParams) => {
        const { from, to } = dateRangeRef.current;
        if (!selectedBuyerIdRef.current || !from || !to) {
          params.failCallback();
          return;
        }

        try {
          const page = Math.floor(params.startRow / PAGE_SIZE) + 1;

          const response = await getBuyCompanyDetails({
            companyId: selectedBuyerIdRef.current,
            params: {
              startDate: format(from, 'yyyy-MM-dd'),
              endDate: format(to, 'yyyy-MM-dd'),
              filter: JSON.stringify(params.filterModel),
              page,
              pageSize: PAGE_SIZE,
            },
          });
          const rowsThisBlock = response?.items || [];
          const totalRows = response?.total || 0;
          setTotalCount(totalRows);
          setTotalPurchaseAmount(response?.total_purchase_amount ?? null);

          params.successCallback(rowsThisBlock, totalRows);
        } catch (error) {
          console.error('Failed to fetch data:', error);
          setTotalCount(null);
          setTotalPurchaseAmount(null);
          params.failCallback();
        }
      },
    };
  }, [selectedBuyer.id]);

  const refreshGridData = useCallback(() => {
    if (gridRef.current?.api && selectedBuyer.id && dateRange.from && dateRange.to) {
      // 매입사·기간이 바뀌면 이전 조회의 요약이 잠깐이라도 남지 않도록 비운다.
      setTotalCount(null);
      setTotalPurchaseAmount(null);
      const newDataSource = createDataSource();
      gridRef.current.api.setGridOption('datasource', newDataSource);
    }
  }, [createDataSource, selectedBuyer.id, dateRange.from, dateRange.to]);

  const { mutate: submitPaymentRequest } = useMutation({
    mutationFn: async (data: PaymentData) => {
      return await postBuyCompanyPayment({
        companyId: selectedBuyerIdRef.current,
        params: {
          date: format(data.processDate!, 'yyyy-MM-dd'),
          amount: Number(data.amount),
          note: data.notes,
        },
      });
    },
    onSuccess: () => {
      refreshGridData();
      setAlert({ message: '결제 정보가 입력되었습니다.' });
    },
  });

  const { mutate: editPaymentRequest } = useMutation({
    mutationFn: async (data: PaymentData) => {
      return await patchBuyCompanyPayment({
        companyId: selectedBuyerIdRef.current,
        params: {
          id: String(data.id),
          amount: Number(data.amount),
          note: data.notes,
        },
      });
    },
    onMutate: () => setLoading(true, '결제 정보 수정 중'),
    onSettled: () => setLoading(false),
    onSuccess: () => refreshGridData(),
  });

  const { mutate: deletePaymentRequest } = useMutation({
    mutationFn: async (rowData: any) => {
      return await deleteBuyCompanyPayment({
        companyId: selectedBuyerIdRef.current,
        id: rowData.detail_id,
      });
    },
    onMutate: () => setLoading(true, '결제 정보 삭제 중'),
    onSettled: () => setLoading(false),
    onSuccess: () => refreshGridData(),
  });

  const handleDelete = async (rowData: any) => {
    const result = await setConfirm({
      title: '삭제 확인',
      message: '결제데이터를 삭제하시겠습니까?',
    });
    if (result) await deletePaymentRequest(rowData);
  };

  // 현재 선택된 매입사의 조회기간·필터 그대로 상세 내역 엑셀 다운로드
  const downloadExcel = useCallback(async () => {
    const { from, to } = dateRangeRef.current;
    if (!selectedBuyer.id || !from || !to) return;

    const startDate = format(from, 'yyyy-MM-dd');
    const endDate = format(to, 'yyyy-MM-dd');

    setIsDownloading(true);
    try {
      const { blob, filename } = await getBuyCompanyExcel({
        companyId: selectedBuyer.id,
        params: {
          startDate,
          endDate,
          filter: JSON.stringify(gridRef.current?.api?.getFilterModel() ?? {}),
        },
      });
      downloadBlob(blob, filename ?? `직매입_${selectedBuyer.name}_${startDate}_${endDate}.xlsx`);
    } catch (e) {
      console.error('Failed to download excel:', e);
      setAlert({ message: '엑셀 다운로드에 실패했습니다.\n잠시 후 다시 시도해주세요.' });
    } finally {
      setIsDownloading(false);
    }
  }, [selectedBuyer.id, selectedBuyer.name, setAlert]);

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
    totalCount,
    totalPurchaseAmount,
    downloadExcel,
    isDownloading,
  };
};
