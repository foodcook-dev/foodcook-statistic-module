import { useState, useCallback, useEffect } from 'react';
import { type CellBase, type Matrix } from 'react-spreadsheet';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import createAxios from '@/libs/create-axios-instance';
import useFetch from '@/hooks/useFetch';
import { OrderApiResponse } from '../types';
import useConfirmStore from '@/store/confirm';
import useAlertStore from '@/store/alert';
import { readOnlyColumns, expectedKeys } from '../structure';
import { ERP_BASE_URL } from '@/constants/api-path';

export function usePurchase() {
  const [purchaseData, setPurchaseData] = useState<OrderApiResponse>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAllReadOnly, setIsAllReadOnly] = useState(false);
  const { showConfirm } = useConfirmStore();
  const { setAlertMessage } = useAlertStore();

  const { data: availableDates } = useQuery({
    queryKey: ['availableDates'],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint: '/order/available-vegetable-purchase-date',
        baseURL: ERP_BASE_URL.Prod,
      }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['purchaseData', selectedDate],
    queryFn: () =>
      createAxios({
        method: 'get',
        endpoint: '/order/batch-vegetable-purchase-product-manual',
        baseURL: ERP_BASE_URL.Prod,
        params: {
          estimated_delivery_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        },
      }),
    enabled: !!selectedDate,
  });

  useEffect(() => {
    if (!isLoading) {
      if (data?.table_data) {
        try {
          let mismatchFound = false;
          outer: for (let rowIndex = 0; rowIndex < data.table_data.length; rowIndex++) {
            const row: any[] = data.table_data[rowIndex];
            for (let colIndex = 0; colIndex < expectedKeys.length; colIndex++) {
              const expected = expectedKeys[colIndex];
              const actual = row?.[colIndex]?.key;
              if (actual && actual !== expected) {
                console.warn('컬럼 key 순서 불일치로 데이터 바인딩 중단', {
                  rowIndex,
                  colIndex,
                  expected,
                  actual,
                });
                setSelectedDate(undefined);
                setAlertMessage(
                  `${rowIndex + 1}행 ${colIndex + 1}열 컬럼 키가 예상(${expected})과 다릅니다: ${actual}`,
                );
                mismatchFound = true;
                break outer;
              }
            }
          }
          if (mismatchFound) return; // 데이터 연결 중단
        } catch (e) {
          console.warn('컬럼 key 순서 검사 중 오류', e);
          setAlertMessage('컬럼 구조 검사 중 오류가 발생했습니다.');
          return;
        }
      }
      setPurchaseData(addReadOnlyAttributes(data));
    }
  }, [isLoading, data, isAllReadOnly, setAlertMessage]);

  const { request: purchaseRequest } = useFetch({
    requestFn: async () => {
      return await createAxios({
        method: 'patch',
        endpoint: `/order/batch-vegetable-purchase-product-manual`,
        baseURL: ERP_BASE_URL.Prod,
        body: {
          estimated_delivery_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
          table_data: purchaseData?.table_data as any,
        },
      });
    },
    onSuccess: () => {
      const resolveParentOrigin = () => {
        const tryParse = (v?: string | null) => {
          try {
            return v ? new URL(v).origin : '';
          } catch {
            return '';
          }
        };

        // 핸드셰이크로 잠긴 값 우선
        const locked =
          (window as any).__PARENT_ORIGIN || sessionStorage.getItem('parent_origin_locked');
        const lockedOrigin = tryParse(locked);
        if (lockedOrigin) return lockedOrigin;

        // fallback
        return '*';
      };

      const parentOrigin = resolveParentOrigin();
      if (selectedDate) {
        window.parent?.postMessage(
          {
            type: 'VEG_PURCHASE_SUCCESS',
            payload: { date: format(selectedDate, 'yyyy-MM-dd') },
          },
          parentOrigin,
        );
      }
    },
    showSpinner: true,
    spinnerMessage: '매입 생성중',
  });

  const calculateSummary = useCallback(() => {
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

  const addReadOnlyAttributes = (inputData: OrderApiResponse): OrderApiResponse => {
    return {
      ...inputData,
      table_data: inputData?.table_data.map((row) =>
        row.map((cell, colIndex) => {
          if (cell) {
            const shouldBeReadOnly = isAllReadOnly || readOnlyColumns.includes(colIndex);
            return {
              ...cell,
              readOnly: shouldBeReadOnly,
            } as CellBase;
          }
          return cell;
        }),
      ),
    };
  };

  const isDateUnavailable = useCallback(
    (date: Date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      return !availableDates?.available_date?.includes(dateString);
    },
    [availableDates],
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (date && availableDates?.available_date) {
      const dateString = format(date, 'yyyy-MM-dd');
      setIsAllReadOnly(!availableDates.available_date.includes(dateString));
    } else {
      setIsAllReadOnly(false);
    }
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

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
      title: '야채 매입 작성',
      message:
        '해당 페이지에서의 매입 작성은 최초 1회만 가능합니다.\n수정은 해당 주문건 발주서 수정을 통해 가능합니다.',
      onConfirm: () => purchaseRequest(),
    });
  }, [purchaseData]);

  const handleChange = useCallback(
    (newData: Matrix<CellBase>) => {
      // 붙여넣기 등으로 넘어온 newData가 기존 행 수보다 길면 잘라 강제 행 추가를 방지
      const originalRowCount = purchaseData?.table_data.length ?? 0;
      // 열 추가 방지: 기존 테이블의 최대 열 수 (항상 number 보장)
      const originalColCount: number = purchaseData?.table_data
        ? purchaseData.table_data.reduce((max, row) => Math.max(max, row.length), 0)
        : 0;

      let constrainedData = newData;
      if (originalRowCount && newData.length > originalRowCount) {
        constrainedData = newData.slice(0, originalRowCount);
      }

      // 각 행 열 수 제한
      if (originalColCount > 0) {
        constrainedData = constrainedData.map((r) =>
          r.length > originalColCount ? r.slice(0, originalColCount) : r,
        );
      }

      const updatedData = constrainedData.map((row, rowIndex) => {
        const prevRow = purchaseData?.table_data[rowIndex] || [];
        // prevRow와 new row의 최대 길이를 기존 열 수 한도로 제한
        const targetCols = originalColCount || Math.max(prevRow.length, row.length);
        const maxCols = targetCols;

        const mergedRow: any[] = new Array(maxCols).fill(null).map((_, colIndex) => {
          const incomingCell = row[colIndex] as any;
          const prevCell = prevRow[colIndex] as any;

          // 읽기전용 컬럼: 항상 이전 셀 유지
          if (readOnlyColumns.includes(colIndex)) {
            return prevCell ? { ...prevCell } : (prevCell ?? incomingCell ?? null);
          }

          // 변경되지 않은 컬럼(신규 셀 없음): 이전 셀 유지
          if (!incomingCell) {
            return prevCell ? { ...prevCell } : (incomingCell ?? null);
          }

          // 기존 셀이 있다면 메타 유지 + 값만 덮어쓰기
          if (prevCell) {
            let nextValue = incomingCell?.value as any;
            if (colIndex === 10 && typeof nextValue === 'string') {
              nextValue = nextValue.trim().toUpperCase();
            }
            return { ...prevCell, value: nextValue } as CellBase;
          }

          // prevCell이 없는 드문 경우: 새 셀 생성(읽기전용 규칙 반영)
          const shouldBeReadOnly = isAllReadOnly || readOnlyColumns.includes(colIndex);
          return { ...(incomingCell as any), readOnly: shouldBeReadOnly } as any;
        });

        // 합계(9열) 계산/유지 로직
        const prevQty = parseFloat(String(prevRow[4]?.value ?? 0)) || 0; // 이전 수량
        const prevPrice = parseFloat(String(prevRow[8]?.value ?? 0)) || 0; // 이전 매입단가
        const prevTotal = (() => {
          const v = prevRow[9]?.value; // 이전 합계금액
          return typeof v === 'number' ? v : parseFloat(String(v)) || 0;
        })();

        const qty = parseFloat(String(mergedRow[4]?.value ?? 0)) || 0; // 현재 수량
        const price = parseFloat(String(mergedRow[8]?.value ?? 0)) || 0; // 현재 매입단가
        const currentTotalCell = mergedRow[9]; // 현재 합계금액 셀
        const currentTotal = (() => {
          const v = currentTotalCell?.value;
          return typeof v === 'number' ? v : parseFloat(String(v)) || 0;
        })();

        const qtyChanged = qty !== prevQty;
        const priceChanged = price !== prevPrice;
        const totalChanged = currentTotal !== prevTotal;

        let nextRow = [...mergedRow];

        if (qtyChanged || priceChanged) {
          const calculatedTotal = qty !== 0 && price > 0 ? qty * price : 0;
          const prevCell = prevRow[9] as any;
          nextRow[9] = {
            ...prevCell,
            value: calculatedTotal,
          } as any;

          if ((prevCell as any)?.key === 'total_purchase_price') {
            nextRow[9] = {
              ...prevCell,
              value: calculatedTotal,
              key: 'total_purchase_price',
            } as any;
          }

          // 수량 또는 가격이 변경된 경우 기준매입단가 수정여부를 Y로 설정
          const prevFlagCell = prevRow[10] as any;
          nextRow[10] = {
            ...prevFlagCell,
            value: 'Y',
          } as any;
        } else if (totalChanged) {
          const prevCell = prevRow[9] as any;
          nextRow[9] = {
            ...prevCell,
            value: currentTotal,
          } as any;

          if ((prevCell as any)?.key === 'total_purchase_price') {
            nextRow[9] = {
              ...prevCell,
              value: currentTotal,
              key: 'total_purchase_price',
            } as any;
          }

          // 합계금액이 직접 변경된 경우에도 기준매입단가 수정여부를 Y로 설정
          const prevFlagCell = prevRow[10] as any;
          nextRow[10] = {
            ...prevFlagCell,
            value: 'Y',
          } as any;
        }

        return nextRow;
      });

      if (purchaseData) {
        setPurchaseData({
          ...purchaseData,
          table_data: updatedData.map((row) => row.map((cell) => cell as CellBase)),
        });
      }
    },
    [purchaseData, selectedDate, isAllReadOnly],
  );

  return {
    selectedDate,
    purchaseData,
    isCalendarOpen,
    availableDates,
    isAllReadOnly,
    setIsCalendarOpen,
    handleDateSelect,
    handleChange,
    calculateSummary,
    handlePurchaseOrder,
    isDateUnavailable,
  };
}
