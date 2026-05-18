import { PartialRefundInfo } from '@/types/partial-refund';

export const initialRefundInfo: PartialRefundInfo = {
  order_id: 0,
  order_tax_amount: 0,
  order_tax_free_amount: 0,
  order_amount: 0,
  point_amount: 0,
  available_point_price: 0,
  refund_reason: null,
  refund_method: null,
  memo: null,
  order_items: [],
};
