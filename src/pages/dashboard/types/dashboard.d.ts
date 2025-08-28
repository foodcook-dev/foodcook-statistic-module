import { DateRange } from 'react-day-picker';

export interface DashboardChartData {
  date: string;
  sales_amount: number;
  purchase_amount: number;
  cost_to_sales_ratio: number;
}

export interface DashboardResponse {
  partner_company_id: number | null; // 파트너사 ID
  realtime_revenue: number; // 실시간 매출
  total_revenue: number; // 총 매출
  average_user_count: number; // 주문 유저 수
  average_order_amount: number; // 평균 주문 금액
  inventory_asset: number; // 재고 자산
  revenue: number; // 매출액
  partial_cancel_revenue: number; // 부분 환불액
  vat: number; // 부가세
  sales_revenue: number; // 매출 주문액
  app_revenue: number; // 앱 매출액
  external_revenue: number; // 타사 매출액
  total_tax_amount: number; // 총 과세 금액
  total_tax_free_amount: number; // 총 비과세 금액
  purchase_amount: number; // 매입액
  gross_profit_margin: number; // GP 마진율
  delivery_info: string; // 출고 정보 (주문건 기간 or 휴무일 여부)
  chart_data: DashboardChartData[];
}

export interface DetailCardProps {
  isLoading: boolean;
  isFetching: boolean;
  data: DashboardResponse;
  dateRange: DateRange;
  periodType: string;
}

export interface SimpleRowProps {
  label: string;
  value: number | undefined;
  className?: string;
}

export interface ExpandableRowProps {
  label: string;
  value: number | undefined;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}
