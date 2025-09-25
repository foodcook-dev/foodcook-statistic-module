import { useState, useCallback, useEffect } from 'react';
import { type CellBase, type Matrix } from 'react-spreadsheet';
import { format } from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import createAxios from '@/libs/create-axios-instance';
import useFetch from '@/hooks/useFetch';
import { OrderApiResponse } from '../types';
import useConfirmStore from '@/store/confirm';
import useAlertStore from '@/store/alert';

// readonly 열 설정 (0: 매입사, 1: 상품ID, 2: 상품명, 3: 판매수량, 5: 평균판매금액, 6: 판매설정금액, 7: 기준매입단가)
const readOnlyColumns = [0, 1, 2, 3, 5, 6, 7];

export function usePurchase() {
  const queryClient = useQueryClient();
  const [purchaseData, setPurchaseData] = useState<OrderApiResponse>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { showConfirm } = useConfirmStore();
  const { setAlertMessage } = useAlertStore();

  const { data: availableDates } = useQuery({
    queryKey: ['availableDates'],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint: '/order/available-vegetable-purchase-date',
        baseURL: 'https://admin.cookerp.shop',
      }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['purchaseData', selectedDate],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint: '/order/batch-vegetable-purchase-product-manual',
        baseURL: 'https://admin.cookerp.shop',
        params: {
          estimated_delivery_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        },
      }),
    enabled: !!selectedDate,
  });

  useEffect(() => {
    if (!isLoading) setPurchaseData(addReadOnlyAttributes(data));
  }, [isLoading, data]);

  const { request: purchaseRequest } = useFetch({
    requestFn: async () => {
      return await createAxios({
        method: 'patch',
        endpoint: `/order/batch-vegetable-purchase-product-manual`,
        baseURL: 'https://admin.cookerp.shop',
        body: {
          estimated_delivery_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
          table_data: purchaseData?.table_data as any,
        },
      });
    },
    onSuccess: () => {
      setSelectedDate(undefined);
      setAlertMessage('매입 주문이 생성되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['availableDates'] });
    },
    showSpinner: true,
    spinnerMessage: '매입 생성중',
  });

  const calculateSummaryBySupplier = useCallback(() => {
    const supplierTotals: Record<string, number> = {};
    const productSets: Record<string, Set<string>> = {};
    let lastSupplier = '';

    // table_data가 존재하고 배열인지 확인
    if (!purchaseData?.table_data || !Array.isArray(purchaseData.table_data)) {
      return {};
    }

    purchaseData.table_data.forEach((row, index) => {
      const currentSupplier = String(row[0]?.value || '').trim();
      const productId = String(row[1]?.value || '').trim();
      const amount = row[9]?.value; // 합계금액
      const numericAmount = typeof amount === 'number' ? amount : parseFloat(String(amount)) || 0;

      if (index === 0 && !currentSupplier) {
        return;
      }

      const effectiveSupplier = currentSupplier || lastSupplier;

      if (effectiveSupplier && numericAmount > 0) {
        // 금액 합계
        supplierTotals[effectiveSupplier] =
          (supplierTotals[effectiveSupplier] || 0) + numericAmount;

        // 상품 종류(ID 기준) 집합
        if (productId) {
          if (!productSets[effectiveSupplier]) productSets[effectiveSupplier] = new Set();
          productSets[effectiveSupplier].add(productId);
        }
      }

      if (currentSupplier) {
        lastSupplier = currentSupplier;
      }
    });

    const result: Record<string, { total: number; productCount: number }> = {};
    const suppliers = new Set([...Object.keys(supplierTotals), ...Object.keys(productSets)]);

    suppliers.forEach((s) => {
      result[s] = {
        total: supplierTotals[s] || 0,
        productCount: productSets[s]?.size || 0,
      };
    });

    return result;
  }, [purchaseData]);

  const addReadOnlyAttributes = useCallback((inputData: OrderApiResponse): OrderApiResponse => {
    return {
      ...inputData,
      table_data: inputData?.table_data.map((row) =>
        row.map((cell, colIndex) => {
          if (cell) {
            const shouldBeReadOnly = readOnlyColumns.includes(colIndex);
            return {
              ...cell,
              readOnly: shouldBeReadOnly,
            } as CellBase;
          }
          return cell;
        }),
      ),
    };
  }, []);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  }, []);

  const handlePurchaseOrder = useCallback(() => {
    if (!purchaseData?.table_data) {
      return;
    }

    // 빈값 체크할 컬럼들
    const requiredColumns = [
      { index: 4, name: '매입수량' },
      { index: 8, name: '매입단가' },
      { index: 9, name: '합계금액' },
      { index: 10, name: '기준매입단가수정여부' },
    ];

    let firstError: string | null = null;

    outerLoop: for (let rowIndex = 0; rowIndex < purchaseData.table_data.length; rowIndex++) {
      const row = purchaseData.table_data[rowIndex];

      // 빈값 체크
      for (const { index, name } of requiredColumns) {
        const cellValue = row[index]?.value;

        if (cellValue === null || cellValue === undefined || cellValue === '') {
          firstError = `${rowIndex + 1}행 ${name} 항목이 비어있습니다.`;
          break outerLoop;
        }
      }

      // 숫자 유효성 검사 (매입수량, 매입단가, 합계금액)
      const numberColumns = [
        { index: 4, name: '매입수량' },
        { index: 8, name: '매입단가' },
        { index: 9, name: '합계금액' },
      ];

      for (const { index, name } of numberColumns) {
        const cellValue = row[index]?.value;
        const numericValue = parseFloat(String(cellValue));

        if (isNaN(numericValue) || numericValue < 0) {
          firstError = `${rowIndex + 1}행 ${name} 항목은 0 이상의 숫자만 입력 가능합니다.`;
          break outerLoop;
        }
      }

      // Y/N 유효성 검사 (기준매입단가수정여부)
      const flagValue = String(row[10]?.value || '')
        .trim()
        .toUpperCase();
      if (flagValue !== 'Y' && flagValue !== 'N') {
        firstError = `${rowIndex + 1}행 기준매입단가 수정여부는 "Y" 또는 "N" 값만 입력 가능합니다.`;
        break outerLoop;
      }
    }

    if (firstError) {
      setAlertMessage(firstError);
      return;
    }

    showConfirm({
      title: '매입하기',
      message:
        '매입 진행 후에는 해당 날짜의 데이터를 수정할 수 없습니다.\n매입을 진행하시겠습니까?',
      onConfirm: () => purchaseRequest(),
    });
  }, [purchaseData]);

  const handleChange = useCallback(
    (newData: Matrix<CellBase>) => {
      const updatedData = newData.map((row, rowIndex) => {
        const prevRow = purchaseData?.table_data[rowIndex] || [];
        const updatedRow = [...row];

        // readonly 열의 값이 변경되었는지 확인하고 원래 값으로 복원
        readOnlyColumns.forEach((colIndex) => {
          if (prevRow[colIndex] && updatedRow[colIndex]) {
            updatedRow[colIndex] = { ...prevRow[colIndex] };
          }
        });

        const prevQty = parseFloat(String(prevRow[4]?.value ?? 0)) || 0; // 수량
        const prevPrice = parseFloat(String(prevRow[8]?.value ?? 0)) || 0; // 매입단가
        const prevTotal = (() => {
          const v = prevRow[9]?.value; // 합계금액
          return typeof v === 'number' ? v : parseFloat(String(v)) || 0;
        })();

        const qty = parseFloat(String(updatedRow[4]?.value ?? 0)) || 0; // 수량
        const price = parseFloat(String(updatedRow[8]?.value ?? 0)) || 0; // 매입단가
        const currentTotalCell = updatedRow[9]; // 합계금액
        const currentTotal = (() => {
          const v = currentTotalCell?.value;
          return typeof v === 'number' ? v : parseFloat(String(v)) || 0;
        })();

        const qtyChanged = qty !== prevQty;
        const priceChanged = price !== prevPrice;
        const totalChanged = currentTotal !== prevTotal;

        if (qtyChanged || priceChanged) {
          // 수량과 단가가 모두 숫자이고 0이 아닐 때 계산 (마이너스 값도 허용)
          updatedRow[9] = { value: qty !== 0 && price > 0 ? qty * price : 0 }; // 합계금액
        } else if (totalChanged) {
          // 사용자가 합계를 직접 수정한 경우
          updatedRow[9] = currentTotalCell; // 합계금액
        }

        return updatedRow;
      });

      if (purchaseData) {
        setPurchaseData({
          ...purchaseData,
          table_data: updatedData.map((row) => row.map((cell) => cell as CellBase)),
        });
      }
    },
    [purchaseData, selectedDate],
  );

  const isDateDisabled = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return !availableDates?.available_date?.includes(dateString);
  };

  return {
    selectedDate,
    purchaseData,
    isCalendarOpen,
    availableDates,
    setIsCalendarOpen,
    handleDateSelect,
    handleChange,
    calculateSummaryBySupplier,
    handlePurchaseOrder,
    isDateDisabled,
  };
}
