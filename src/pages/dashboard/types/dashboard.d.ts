// 대시보드 API 타입 정의
export interface DashboardChartData {
  date: string;
  sales_amount: number;
  purchase_amount: number;
  cost_to_sales_ratio: number;
}

export interface PartnerCompany {
  partner_company_id: number;
  b_nm: string;
}

export interface PartnerListResponse {
  partners: PartnerCompany[];
  total_count: number;
}

export interface DashboardApiResponse {
  partner_company_id: number | null;
  partner_company_name: string | null;
  realtime_revenue: number;
  total_revenue: number;
  unique_user_count: number;
  average_order_amount: number;
  inventory_asset: number;
  revenue: number;
  partial_cancel_revenue: number;
  vat: number;
  sales_revenue: number;
  app_revenue: number;
  external_revenue: number;
  total_tax_amount: number;
  total_tax_free_amount: number;
  gross_profit_margin: number;
  chart_data: DashboardChartData[];
}
