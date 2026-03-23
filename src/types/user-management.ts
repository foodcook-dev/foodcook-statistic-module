export type UserListResponse = {
  count: number;
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
  recommender: string | null;
  referral_code: string | null;
  last_month_sales: number;
  b_nm: string;
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

export type UserInfoForm = {
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

export interface CreateUserPayload extends UserInfoForm {
  sales_company_info: SalesCompanyInfo;
}

export type SalesCompanyErrors = Partial<Record<keyof SalesCompanyInfo, string>> & {
  payment_methods?: string;
};
