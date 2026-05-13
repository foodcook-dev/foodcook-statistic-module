import { useState, useRef, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { IDatasource, IGetRowsParams, GridReadyEvent } from 'ag-grid-community';
import { DateRange } from 'react-day-picker';
import { startOfMonth, format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import { initializeColumnStateManagement, STORAGE_KEYS } from '@/libs/column-state';
import { PaymentData } from '@/components/modules/custom-dialog/payment-dialog';
import { useConfirm } from '@/hooks/useConfirm';
import { useAlert } from '@/hooks/useAlert';
import {
  getPartnerCompany,
  getPartnerCompanyDetails,
  postPartnerCompanyPayment,
  patchPartnerCompanyPayment,
  deletePartnerCompanyPayment,
} from '@/libs/purchaser-dashboard-api';
import useSpinnerStore from '@/stores/spinner';
import { Vendor } from '@/types/settlement';

const PAGE_SIZE = 50;
const STORAGE_KEY = STORAGE_KEYS.CONSIGNMENT_SETTLEMENT;

export const useConsignmentSettlement = () => {
  const location = useLocation();
  const gridRef = useRef<AgGridReact>(null);
  const today = new Date();
  const { setLoading } = useSpinnerStore();
  const setConfirm = useConfirm();
  const setAlert = useAlert();
  const [dateRange, setDateRange] = useState<DateRange>(
    location.state?.dateRange || {
      from: startOfMonth(today),
      to: today,
    },
  );
  const [selectedPartner, setSelectedPartner] = useState<Vendor>({
    id: location.state?.id || '',
    name: location.state?.name || '',
  });

  const selectedPartnerIdRef = useRef<string>(selectedPartner.id);
  useEffect(() => {
    selectedPartnerIdRef.current = selectedPartner.id;
  }, [selectedPartner.id]);

  const dateRangeRef = useRef(dateRange);
  useEffect(() => {
    dateRangeRef.current = dateRange;
  }, [dateRange]);

  const partnerInfoResponse = useQuery({
    queryKey: ['partner_companies', selectedPartner.id],
    queryFn: () => getPartnerCompany(selectedPartner.id),
    enabled: !!selectedPartner.id,
  });

  const createDataSource = useCallback((): IDatasource => {
    return {
      getRows: async (params: IGetRowsParams) => {
        const { from, to } = dateRangeRef.current;
        if (!selectedPartnerIdRef.current || !from || !to) {
          params.failCallback();
          return;
        }

        try {
          const page = Math.floor(params.startRow / PAGE_SIZE) + 1;
          const startDate = format(from, 'yyyy-MM-dd');
          const endDate = format(to, 'yyyy-MM-dd');

          const response = await getPartnerCompanyDetails({
            companyId: selectedPartnerIdRef.current,
            params: {
              startDate,
              endDate,
              filter: JSON.stringify(params.filterModel),
              page,
              pageSize: PAGE_SIZE,
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

  const refreshGridData = useCallback(() => {
    if (gridRef.current?.api && selectedPartner.id && dateRange.from && dateRange.to) {
      const newDataSource = createDataSource();
      gridRef.current.api.setGridOption('datasource', newDataSource);
    }
  }, [createDataSource, selectedPartner.id, dateRange.from, dateRange.to]);

  const { mutate: submitPaymentRequest } = useMutation({
    mutationFn: async (data: PaymentData) => {
      await postPartnerCompanyPayment({
        companyId: selectedPartnerIdRef.current,
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
      await patchPartnerCompanyPayment({
        companyId: selectedPartnerIdRef.current,
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
      await deletePartnerCompanyPayment({
        companyId: selectedPartnerIdRef.current,
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

  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      initializeColumnStateManagement(STORAGE_KEY, event.api);

      if (selectedPartner.id && dateRange.from && dateRange.to) {
        const dataSource = createDataSource();
        event.api.setGridOption('datasource', dataSource);
      }
    },
    [selectedPartner.id, dateRange.from, dateRange.to, STORAGE_KEY, createDataSource],
  );

  useEffect(() => {
    refreshGridData();
  }, [refreshGridData]);

  return {
    gridRef,
    dateRange,
    selectedPartner,
    partnerInfo: partnerInfoResponse.data,
    isPartnerInfoLoading: partnerInfoResponse.isLoading,
    setDateRange,
    setSelectedPartner,
    handlePaymentSubmit: submitPaymentRequest,
    handleEdit: editPaymentRequest,
    handleDelete,
    onGridReady,
  };
};
