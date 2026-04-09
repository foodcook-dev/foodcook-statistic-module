export type UserListResponse = {
  count: number;
  nice_verified_count: number;
  business_verified_count: number;
  next: string;
  previous: string | null;
  results: Array<{
    id: number;
    username: string;
    nickname: string;
    email: string | null;
    phone_num: string;
    date_joined: string;
    recommender: string | null;
    referral_code: string | null;
    last_month_sales: number;
    b_nm: string;
    is_sales_verified: boolean;
    is_deleted: boolean;
    is_nice_verified: boolean;
  }>;
};

export type UserDetailResponse = {
  id: number;
  username: string;
  nickname: string;
  email: string | null;
  phone_num: string;
  date_joined: string;
  recommender: number | null;
  recommender_display: string | null;
  referral_code: string | null;
  last_month_sales: number;
  b_nm: string;
  tier: number | null;
  tier_display: string | null;
  memo: string;
  is_sales_verified: boolean;
  is_deleted: boolean;
  is_nice_verified: boolean;
  nice_verification_info: {
    id: number;
    authority: string;
    ci: string;
    di: string;
    name: string;
    birthdate: string;
    gender: string;
    national_info: string;
    mobile_co: string;
    mobile_no: string;
    verified_at: string;
  };
};

export type SalesCompanyDetailResponse = {
  id: number;
  branch: number;
  branch_display: string;
  platform: string;
  platform_display: string;
  franchise: number | null;
  franchise_display: string | null;
  b_nm: string;
  b_no: string;
  owner_name: string;
  zip_code: string | null;
  address: string;
  start_dt: string;
  tax_type: string;
  tax_type_display: string;
  b_sector: string;
  b_type: string;
  cert_image: string;
  email: string;
  note: string | null;
  driver: number | null;
  driver_display: string | null;
  manager: number | null;
  manager_display: string | null;
  is_meet_pay_available: boolean;
  is_card_pay_available: boolean;
  is_deposit_pay_available: boolean;
  is_fixed_account_pay_available: boolean;
  delivery_available_days: Record<string, unknown>;
  dongwon_sales_company_code: string | null;
  jette_sales_company_code: string | null;
  foodist_sales_company_code: string | null;
  is_test: boolean;
  is_confirmed: boolean;
  sales_branch_info: [
    {
      id: number;
      type: string;
      allias: string;
      manager: number | null;
      manager_display: string | null;
      b_no: string;
      owner_name: string;
      start_dt: string;
      b_sector: string;
      b_type: string;
      cert_image: string | null;
      zip_code: string | null;
      address: string;
      address_detail: string;
      delivery_memo: string | null;
      gate_password: string | null;
      phone_num: string | null;
      delivery_available_days: Record<string, unknown> | null;
      is_active: boolean;
      is_confirmed: boolean;
      is_default: boolean;
      created_at: string;
      updated_at: string;
    },
  ];
};

export type UserInfo = {
  username: string;
  password: string;
  nickname: string;
  phone_num: string;
  email: string;
  referral_code: string;
  recommender: number | null;
  tier: number;
  memo: string;
};

export interface SalesCompanyInfo {
  owner_name: string;
  b_nm: string;
  b_no: string;
  address: string;
  address_detail: string;
  cert_image: File | null;
  zip_code: string;
  tax_type: string;
  driver: number | null;
  platform: string;
  franchise: number | null;
  manager: number | null;
  start_dt: string;
  email: string;
  b_sector: string;
  b_type: string;
  note: string;
  is_meet_pay_available: boolean;
  is_card_pay_available: boolean;
  is_deposit_pay_available: boolean;
  is_fixed_account_pay_available: boolean;
  is_test: boolean;
  delivery_available_days: Record<string, unknown>;
  dongwon_sales_company_code: string;
  jette_sales_company_code: string;
  foodist_sales_company_code: string;
}

export interface CreateUserPayload extends UserInfo {
  sales_company_info: SalesCompanyInfo;
}

export type SalesCompanyErrors = Partial<Record<keyof SalesCompanyInfo, string>> & {
  payment_methods?: string;
};

export interface SalesBranchInfo {
  cert_image: File | null;
  branch_type: string;
  allias: string;
  manager: number | null;
  b_no: string;
  owner_name: string;
  start_dt: string;
  b_sector: string;
  b_type: string;
  zip_code: string;
  address: string;
  address_detail: string;
  delivery_memo: string;
  phone_num: string;
  gate_password: string;
  delivery_available_days: Record<string, boolean>;
  is_active: boolean;
  is_confirmed: boolean;
  is_default: boolean;
}
