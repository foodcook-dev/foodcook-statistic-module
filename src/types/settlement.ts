export type Vendor = {
  id: string;
  name: string;
};

type Dash = '-';

// 직매입: direct, 위탁매입: consignment
export type SettlementType = 'direct' | 'consignment';

// 서버 매입 유형 값 (응답의 type 필드)
export type ServerCompanyType = 'buy' | 'partner';

/** 페이지네이션 목록 응답 공통 형태 */
export type PaginatedResponse<T> = {
  items: T[];
  /** 현재 페이지 (1부터 시작) */
  page: number;
  /** 전체 페이지 수 */
  pages: number;
  /** 페이지당 행 수 */
  size: number;
  /** 전체 행 수 */
  total: number;
};

/** 정산 대시보드 목록 응답: 페이지네이션 + 조회 조건(기간·필터)을 반영한 매입액 총합 */
export type SettlementPageResponse<T> = PaginatedResponse<T> & {
  total_purchase_amount: number;
};

/** 통합 정산 목록의 매입사 한 행 (getIntegratedCompany 응답 items) */
export type IntegratedCompanyItem = {
  company_id: number;
  b_nm: string;
  type: ServerCompanyType;
  payment_period?: string;
  payment_date: string | Dash;
  b_no: string;
  previous_balance: number;
  sales_amount: number | Dash;
  tax_purchase: number;
  tax_free_purchase: number;
  purchase_amount: number;
  commission_rate: number;
  app_fee: number;
  other_fee: number;
  expected_settlement: number;
  discount_amount: number;
  payment_amount: number;
  invoice_total: number;
  last_purchase_date: string | Dash;
  last_payment_date: string | Dash;
  total_product_inventory_value: number | Dash;
  tax_invoice_email: string | Dash;
  memo: string;
  balance: number;
};

export type IntegratedCompanyResponse = SettlementPageResponse<IntegratedCompanyItem>;

/** 직매입사 상세 내역 한 행 (getDirectCompanyDetails 응답 items) */
export type DirectCompanyDetailItem = {
  detail_id: number | null;
  type: '전기이월' | '반품' | '매입' | '결제';
  process_date: string | Dash;
  purchase_amount: number;
  purchase_tax_amount: number;
  purchase_tax_free_amount: number;
  payment_amount: number;
  discount_amount: number;
  invoice_total: number;
  balance: number;
  memo: string;
};

export type DirectCompanyDetailResponse = SettlementPageResponse<DirectCompanyDetailItem>;

/** 위탁매입사 상세 내역 한 행 (getConsignmentCompanyDetails 응답 items) */
export type ConsignmentCompanyDetailItem = {
  detail_id: string | null;
  type: '전기이월' | '반품' | '매입' | '결제';
  process_date: string | Dash;
  sales_amount: number;
  tax_purchase: number;
  tax_free_purchase: number;
  purchase_amount: number;
  commission_rate: number;
  app_fee: number;
  other_fee: number;
  expected_settlement: number;
  discount_amount: number;
  payment_amount: number;
  invoice_total: number;
  balance: number;
  note: string;
};

export type ConsignmentCompanyDetailResponse = SettlementPageResponse<ConsignmentCompanyDetailItem>;
