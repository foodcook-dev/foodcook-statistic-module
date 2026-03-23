export type UserRow = {
  id: number;
  username: string;
  nickname: string;
  email: string | null;
  phone_num: string | null;
  date_joined: string;
  referral_code: string;
  last_month_sales: number;
  b_nm: string;
  is_sales_verified: boolean;
  is_nice_verified: boolean;
  is_deleted: boolean;
};
