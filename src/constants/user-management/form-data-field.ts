import { SalesBranchInfo, SalesCompanyInfo, UserInfo } from '@/types/user-management';

export const toUserFields = (info: UserInfo) => ({
  fields: {
    username: info.username,
    password: info.password,
    nickname: info.nickname,
    phone_num: info.phone_num,
    email: info.email,
    recommender: info.recommender || '',
    tier: info.tier || '',
    referral_code: info.referral_code || '',
    memo: info.memo || '',
  },
});

export const toUserEditFields = (info: UserInfo) => ({
  fields: {
    nickname: info.nickname,
    phone_num: info.phone_num,
    email: info.email,
    tier: info.tier || '',
    recommender: info.recommender || '',
    referral_code: info.referral_code || '',
    memo: info.memo || '',
  },
});

export const toSalesCompanyFields = (info: SalesCompanyInfo, prefix?: string) => ({
  fields: {
    owner_name: info.owner_name,
    b_nm: info.b_nm,
    b_no: info.b_no,
    address: info.address + (info.address_detail ? ', ' + info.address_detail : ''),
    zip_code: info.zip_code,
    tax_type: info.tax_type,
    driver: info.driver || '',
    platform: info.platform || '',
    franchise: info.franchise || '',
    manager: info.manager || '',
    start_dt: info.start_dt || '',
    email: info.email,
    b_sector: info.b_sector || '',
    b_type: info.b_type || '',
    note: info.note || '',
    is_meet_pay_available: info.is_meet_pay_available,
    is_card_pay_available: info.is_card_pay_available,
    is_deposit_pay_available: info.is_deposit_pay_available,
    is_fixed_account_pay_available: info.is_fixed_account_pay_available,
    is_test: info.is_test,
    delivery_available_days: info.delivery_available_days || {},
    dongwon_sales_company_code: info.dongwon_sales_company_code || '',
    jette_sales_company_code: info.jette_sales_company_code || '',
    foodist_sales_company_code: info.foodist_sales_company_code || '',
  },
  files: { cert_image: info.cert_image as File | undefined },
  prefix,
});

export const toSalesBranchFields = (info: SalesBranchInfo) => ({
  fields: {
    branch_type: info.branch_type,
    allias: info.allias,
    manager: info.manager || '',
    b_no: info.b_no,
    owner_name: info.owner_name,
    start_dt: info.start_dt || '',
    b_sector: info.b_sector || '',
    b_type: info.b_type || '',
    zip_code: info.zip_code,
    address: info.address,
    address_detail: info.address_detail || '',
    delivery_memo: info.delivery_memo || '',
    phone_num: info.phone_num || '',
    gate_password: info.gate_password || '',
    delivery_available_days: info.delivery_available_days || {},
    is_active: info.is_active,
    is_confirmed: info.is_confirmed,
    is_default: info.is_default,
  },
  files: { cert_image: info.cert_image as File | undefined },
});
