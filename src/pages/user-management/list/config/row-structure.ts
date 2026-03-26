export type UserRow = {
  id: number;
  username: string;
  nickname: string;
  email: string | null;
  phone_num: string | null;
  platform_display: string;
  date_joined: string;
  referral_code: string;
  last_month_sales: number;
  sales_company_id: number;
  b_nm: string;
  is_sales_verified: boolean;
  is_nice_verified: boolean;
  is_deleted: boolean;
};
