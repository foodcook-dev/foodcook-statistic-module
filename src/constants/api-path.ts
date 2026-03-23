// TODO: 추후 실서버, 개발서버, 로컬서버에 따라 BASE_URL을 변경할 수 있도록 설정해야함
const BASE_URL = import.meta.env.VITE_API_URL;

const API = {
  getVegetableAvailableDate: `/order/available-vegetable-purchase-date/`,
  getBatchVegetablePurchaseProductManual: `/order/batch-vegetable-purchase-product-manual/`,
  patchBatchVegetablePurchaseProductManual: `/order/batch-vegetable-purchase-product-manual/`,

  getCompany: `/dashboard/companies/`,

  getIntegratedCompany: `/integrate/integrate_companies/`,

  getBuyCompanyList: `/purchase/buy_companies/`,
  getBuyCompany: (companyId: string) => `/purchase/buy_companies/${companyId}/`,
  buyCompanyPayment: (companyId: string) => `/purchase/buy_companies/${companyId}/payment/`,
  getBuyLog: `/log/buy_company_logs/`,

  getPartnerCompanyList: `/partner/partner_companies/`,
  getPartnerCompany: (companyId: string) => `/partner/partner_companies/${companyId}/`,
  partnerCompanyPayment: (companyId: string) => `/partner/partner_companies/${companyId}/payment/`,
  getPartnerLog: `/log/partner_company_logs/`,

  getCompanies: `/dashboard/companies/`,
  getUserList: `/user-dashboard/users/`,
  getUserDetail: (userId: number) => `/user-dashboard/users/${userId}/`,
  getOptions: `/user-dashboard/select-options/`,
  postUserCreate: `/user-dashboard/users/`,
  postReferralCodeValidate: `/v3/user/validate-referral-code/`,
  postCertFileUpload: `/user-dashboard/sales-company/ocr-result/`,
};

export const PATH = { base: BASE_URL, api: API };

export const ERP_BASE_URL = {
  Dev: 'https://admin.cookerp.shop',
  Prod: 'https://admin.xn--wv4b09focz31b.com',
} as const;
