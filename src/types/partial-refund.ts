export type OrderItem = {
  id: number;
  product_id: number;
  partner_company_name: string;
  name: string;
  price: number;
  tax_state: boolean;
  count: number;
  available_refund_amount: number;
  refund_amount: number;
  restock_quantity: number;
  settlement_exempt: boolean;
};

export type PartialRefundInfo = {
  order_id: number; // 환불 대상 주문 ID
  order_tax_amount: number; // 주문 총 과세 금액
  order_tax_free_amount: number; // 주문 총 비과세 금액
  order_amount: number; // 주문 총 금액
  point_amount: number; // 사용된 포인트 금액
  available_point_price: number; // 환불 가능 포인트 금액
  refund_reason: string | null; // 환불 사유
  refund_method: string | null; // 환불 방법
  memo: string | null; // 관리자 메모
  order_items: OrderItem[];
};

type RequestOrderItem = {
  id: number;
  refund_amount: number;
  restock_quantity: number;
  settlement_exempt: boolean;
};

export type RequestPartialRefundInfo = {
  refund_reason: string | null; // 환불 사유
  memo: string | null; // 관리자 메모
  order_items: RequestOrderItem[];
};
