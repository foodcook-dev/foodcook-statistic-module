import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PartialRefundInfo, RequestPartialRefundInfo } from '@/types/partial-refund';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAlert } from '@/hooks/useAlert';
import { initialRefundInfo } from '@/constants/partial-refund/refund-values';
import { getPartialRefundInfo, postPartialRefund } from '@/libs/partial-refund';
import { showToastMessage } from '@/libs/toast-message';

export function usePartialRefundForm() {
  const setAlert = useAlert();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';
  const orderItemIds = searchParams.get('orderitemIds')?.split(',').filter(Boolean) ?? [];

  const [partialRefundForm, setPartialRefundForm] = useState<PartialRefundInfo>({
    ...initialRefundInfo,
  });
  const [selectedItemIds, setSelectedItemIds] = useState<Array<number>>(orderItemIds.map(Number));

  const { data: refundData } = useQuery<PartialRefundInfo>({
    queryKey: ['partialRefundInfo', orderId],
    queryFn: () => getPartialRefundInfo(orderId),
  });

  useEffect(() => {
    if (refundData) setPartialRefundForm(refundData);
  }, [refundData]);

  const { mutate: submitPartialRefund } = useMutation({
    mutationKey: ['submitPartialRefund', orderId],
    mutationFn: (data: RequestPartialRefundInfo) => postPartialRefund(orderId, data),
    onSuccess: () => {
      setPartialRefundForm({ ...initialRefundInfo });
      showToastMessage({ content: '부분 환불이 성공적으로 요청되었습니다.' });

      const resolveParentOrigin = () => {
        const tryParse = (v?: string | null) => {
          try {
            return v ? new URL(v).origin : '';
          } catch {
            return '';
          }
        };

        const locked =
          (window as any).__PARENT_ORIGIN || sessionStorage.getItem('parent_origin_locked');
        const lockedOrigin = tryParse(locked);
        if (lockedOrigin) return lockedOrigin;

        return '*';
      };

      const parentOrigin = resolveParentOrigin();
      window.parent?.postMessage({ type: 'PARTIAL_REFUND_SUCCESS' }, parentOrigin);
    },
    onError: () => setAlert({ message: '부분 환불 처리 중 오류가 발생했습니다.' }),
  });

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const field = name as keyof PartialRefundInfo;

      setPartialRefundForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  // 체크박스 토글
  const onItemSelectToggle = useCallback((itemId: number) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
        setPartialRefundForm((form) => ({
          ...form,
          order_items: form.order_items.map((item) =>
            item.id === itemId
              ? { ...item, refund_amount: 0, restock_quantity: 0, settlement_exempt: false }
              : item,
          ),
        }));
      } else {
        next.add(itemId);
      }
      return Array.from(next);
    });
  }, []);

  // 체크박스 동기화: order_items의 최신 상태를 기준으로 selectedItemIds 갱신
  const syncCheckboxByItem = useCallback(
    (
      itemId: number,
      item: { refund_amount: number; restock_quantity: number; settlement_exempt: boolean },
    ) => {
      const hasAnyValue =
        item.refund_amount > 0 || item.restock_quantity > 0 || item.settlement_exempt;

      setSelectedItemIds((prev) => {
        const next = new Set(prev);
        if (hasAnyValue) {
          next.add(itemId);
        } else {
          next.delete(itemId);
        }
        return Array.from(next);
      });
    },
    [],
  );

  // 환불 금액 변경
  const onItemRefundAmountChange = useCallback(
    (itemId: number, value: string) => {
      const numericValue = value === '' ? 0 : Math.max(0, Number(value.replace(/[^0-9]/g, '')));

      setPartialRefundForm((prev) => {
        const updatedItems = prev.order_items.map((item) => {
          if (item.id !== itemId) return item;

          if (numericValue > item.available_refund_amount) {
            const alreadyRefunded = item.price - item.available_refund_amount;
            if (alreadyRefunded > 0) {
              setAlert({
                message: `이미 ${alreadyRefunded.toLocaleString()}원이 환불된 상품입니다.\n잔여 환불 가능 금액(${item.available_refund_amount.toLocaleString()}원)까지만 입력할 수 있습니다.`,
              });
            } else {
              setAlert({
                message: `상품 주문 금액(${(item.price * item.count).toLocaleString()}원)을 초과하여 환불할 수 없습니다.`,
              });
            }
          }

          const cappedValue = Math.min(numericValue, item.available_refund_amount);
          return {
            ...item,
            refund_amount: cappedValue,
            restock_quantity: cappedValue > 0 ? item.restock_quantity : 0,
          };
        });

        const updated = updatedItems.find((i) => i.id === itemId);
        if (updated) syncCheckboxByItem(itemId, updated);

        return { ...prev, order_items: updatedItems };
      });
    },
    [setAlert, syncCheckboxByItem],
  );

  // 재고 반품 수량 변경
  const onItemRestockQuantityChange = useCallback(
    (itemId: number, value: string) => {
      const numericValue = value === '' ? 0 : Math.max(0, Number(value.replace(/[^0-9]/g, '')));

      setPartialRefundForm((prev) => {
        const updatedItems = prev.order_items.map((item) =>
          item.id === itemId
            ? { ...item, restock_quantity: Math.min(numericValue, item.count) }
            : item,
        );

        const updated = updatedItems.find((i) => i.id === itemId);
        if (updated) syncCheckboxByItem(itemId, updated);

        return { ...prev, order_items: updatedItems };
      });
    },
    [syncCheckboxByItem],
  );

  // 정산제외 토글
  const onItemSettlementExemptToggle = useCallback(
    (itemId: number) => {
      setPartialRefundForm((prev) => {
        const updatedItems = prev.order_items.map((item) =>
          item.id === itemId ? { ...item, settlement_exempt: !item.settlement_exempt } : item,
        );

        const updated = updatedItems.find((i) => i.id === itemId);
        if (updated) syncCheckboxByItem(itemId, updated);

        return { ...prev, order_items: updatedItems };
      });
    },
    [syncCheckboxByItem],
  );

  // 합계 계산
  const totalRefundAmount = useMemo(
    () =>
      partialRefundForm.order_items
        .filter((item) => item.refund_amount > 0)
        .reduce((sum, item) => sum + item.refund_amount, 0),
    [partialRefundForm.order_items],
  );

  // 유효성 검사
  const validate = useCallback(() => {
    const next: Partial<Record<keyof PartialRefundInfo, string>> = {};

    const emptyAmountItems = partialRefundForm.order_items.filter(
      (item) => selectedItemIds.includes(item.id) && item.refund_amount <= 0,
    );

    if (selectedItemIds.length === 0) {
      setAlert({ message: '환불할 상품을 선택해주세요.' });
      return false;
    }
    if (totalRefundAmount <= 0) {
      setAlert({ message: '부분환불 처리할 금액을 입력해주세요.' });
      return false;
    }
    if (emptyAmountItems.length > 0) {
      const names = emptyAmountItems.map((item) => item.name).join(',\n');
      setAlert({
        message: `선택한 상품의 환불 금액을 입력해주세요.\n(${names})`,
      });
      return false;
    }

    return Object.keys(next).length === 0;
  }, [partialRefundForm, totalRefundAmount, setAlert]);

  // 부분 환불
  const handlePartialRefund = () => {
    if (validate()) {
      submitPartialRefund({
        refund_reason: partialRefundForm.refund_reason,
        memo: partialRefundForm.memo,
        order_items: partialRefundForm.order_items
          .filter((item) => selectedItemIds.includes(item.id))
          .map((item) => ({
            id: item.id,
            refund_amount: item.refund_amount,
            restock_quantity: item.restock_quantity,
            settlement_exempt: item.settlement_exempt,
          })),
      });
    }
  };

  return {
    orderId,
    form: partialRefundForm,
    selectedItemIds,
    totalRefundAmount,
    onChange,
    onItemSelectToggle,
    onItemRestockQuantityChange,
    onItemRefundAmountChange,
    onItemSettlementExemptToggle,
    handlePartialRefund,
  };
}
