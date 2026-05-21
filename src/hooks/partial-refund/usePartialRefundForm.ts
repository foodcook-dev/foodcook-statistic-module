import { useEffect, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAlert } from '@/hooks/useAlert';
import { getPartialRefundInfo, postPartialRefund } from '@/libs/partial-refund';
import {
  PartialRefundInfo,
  RequestPartialRefundInfo,
  FormEdits,
  EditableItemFields,
} from '@/types/partial-refund';
import { showToastMessage } from '@/libs/toast-message';

const emptyItemEdit: EditableItemFields = {
  refund_amount: 0,
  refund_count: 0,
  restock_quantity: 0,
  settlement_exempt: false,
  partner_company_id: null,
};

export function usePartialRefundForm() {
  const setAlert = useAlert();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';
  const initialItemIds = useMemo(
    () => searchParams.get('orderitemIds')?.split(',').filter(Boolean).map(Number) ?? [],
    [searchParams],
  );

  const { data: refundData, error } = useQuery<PartialRefundInfo>({
    queryKey: ['partialRefundInfo', orderId],
    queryFn: () => getPartialRefundInfo(orderId),
  });

  const [edits, setEdits] = useState<FormEdits>({
    refund_reason: '',
    memo: '',
    items: new Map(),
  });

  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!refundData || initialized) return;

    // 환불 가능한 상품 중에서 initialItemIds에 해당하는 상품을 edits에 초기화
    const validIds = new Set(
      refundData.order_items.map((i) => {
        if (i.available_refund_amount > 0) return i.id;
      }),
    );
    const initialMap = new Map<number, EditableItemFields>();
    initialItemIds.forEach((id) => {
      if (validIds.has(id)) {
        initialMap.set(id, { ...emptyItemEdit });
      }
    });

    setEdits((prev) => ({ ...prev, items: initialMap }));
    setInitialized(true);
  }, [refundData, initialized, initialItemIds]);

  useEffect(() => {
    if (error) {
      setAlert({
        title: '오류',
        message: (error as any)?.detail || '환불 정보를 불러오는 중 오류가 발생했습니다.',
      });
    }
  }, [error]);

  const orderItems = useMemo(() => {
    if (!refundData) return [];
    return refundData.order_items.map((item) => ({
      ...item,
      ...(edits.items.get(item.id) ?? emptyItemEdit),
    }));
  }, [refundData, edits.items]);

  const selectedItemIds = useMemo(() => Array.from(edits.items.keys()), [edits.items]);

  const updateItem = useCallback(
    (itemId: number, updater: (prev: EditableItemFields) => EditableItemFields) => {
      setEdits((prev) => {
        const newItems = new Map(prev.items);
        const current = newItems.get(itemId) ?? emptyItemEdit;
        newItems.set(itemId, updater(current));
        return { ...prev, items: newItems };
      });
    },
    [],
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setEdits((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const onItemSelectToggle = useCallback((itemId: number) => {
    setEdits((prev) => {
      const newItems = new Map(prev.items);
      if (newItems.has(itemId)) {
        newItems.delete(itemId);
      } else {
        newItems.set(itemId, { ...emptyItemEdit });
      }
      return { ...prev, items: newItems };
    });
  }, []);

  // 환불 금액은 0 이상, 주문 금액 이하로 제한
  const onItemRefundAmountChange = useCallback(
    (itemId: number, value: string) => {
      const numericValue = value === '' ? 0 : Math.max(0, Number(value.replace(/[^0-9]/g, '')));
      const item = refundData?.order_items.find((i) => i.id === itemId);
      if (!item) return;

      updateItem(itemId, (prev) => ({
        ...prev,
        refund_amount: Math.min(numericValue, item.price * item.count),
      }));
    },
    [refundData, setAlert, updateItem],
  );

  // 환불 수량, 재고 수량은 0 이상, 주문 수량 이하로 제한
  const onItemCountChange = useCallback(
    (itemId: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      const numericValue = value === '' ? 0 : Math.max(0, Number(value.replace(/[^0-9]/g, '')));
      const item = refundData?.order_items.find((i) => i.id === itemId);
      if (!item) return;

      updateItem(itemId, (prev) => ({
        ...prev,
        [id]: Math.min(numericValue, item.count),
      }));
    },
    [refundData, updateItem],
  );

  const onItemSettlementExemptToggle = useCallback(
    (itemId: number) => {
      updateItem(itemId, (prev) => {
        const next = !prev.settlement_exempt;
        return {
          ...prev,
          settlement_exempt: next,
          partner_company_id: next ? prev.partner_company_id : null,
        };
      });
    },
    [updateItem],
  );

  const onItemPartnerCompanyChange = useCallback(
    (itemId: number, value: number | null) => {
      updateItem(itemId, (prev) => {
        return {
          ...prev,
          settlement_exempt: true,
          partner_company_id: value,
        };
      });
    },
    [updateItem],
  );

  const totalRefundAmount = useMemo(
    () => Array.from(edits.items.values()).reduce((sum, item) => sum + item.refund_amount, 0),
    [edits.items],
  );

  const form = useMemo(
    () => ({
      ...(refundData ?? {}),
      refund_reason: edits.refund_reason,
      memo: edits.memo,
      order_items: orderItems,
    }),
    [refundData, edits.refund_reason, edits.memo, orderItems],
  );

  const { mutate: submitPartialRefund } = useMutation({
    mutationFn: (data: RequestPartialRefundInfo) => postPartialRefund(orderId, data),
    onSuccess: () => {
      setEdits({ refund_reason: '', memo: '', items: new Map() });
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
    onError: (err) =>
      setAlert({
        title: '오류',
        message: (err as any)?.detail || '부분 환불 처리 중 오류가 발생했습니다.',
      }),
  });

  const validate = useCallback(() => {
    if (selectedItemIds.length === 0) {
      setAlert({ title: '상품 미선택', message: '환불할 상품을 선택해 주세요.' });
      return false;
    }
    const emptyAmountItems = orderItems.filter(
      (item) => selectedItemIds.includes(item.id) && item.refund_amount <= 0,
    );
    if (emptyAmountItems.length > 0) {
      setAlert({
        title: '환불 금액 입력',
        message: `선택한 상품의 환불 금액을 입력해 주세요.\n\n${emptyAmountItems
          .map((i) => i.name)
          .join(',\n')}`,
      });
      return false;
    }

    const emptyPartnerId = orderItems.filter(
      (item) =>
        selectedItemIds.includes(item.id) &&
        item.settlement_exempt === true &&
        !item.partner_company_id,
    );
    if (emptyPartnerId.length > 0) {
      setAlert({
        title: '파트너사 선택',
        message: `아래 상품의 정산을 제외할 파트너사를 선택해 주세요.\n\n${emptyPartnerId
          .map((i) => i.name)
          .join(',\n')}`,
      });
      return false;
    }
    return true;
  }, [selectedItemIds, totalRefundAmount, orderItems, setAlert]);

  const handlePartialRefund = () => {
    if (!validate()) return;
    submitPartialRefund({
      refund_reason: edits.refund_reason,
      memo: edits.memo,
      order_items: Array.from(edits.items.entries()).map(([id, fields]) => ({
        id,
        ...fields,
      })),
    });
  };

  return {
    orderId,
    form,
    selectedItemIds,
    totalRefundAmount,
    onChange,
    onItemSelectToggle,
    onItemCountChange,
    onItemRefundAmountChange,
    onItemSettlementExemptToggle,
    onItemPartnerCompanyChange,
    handlePartialRefund,
  };
}
