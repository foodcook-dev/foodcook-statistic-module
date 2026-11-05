const BASE_URL = import.meta.env.VITE_API_URL;
const ERP_BASE_URL = import.meta.env.VITE_ERP_BASE_URL;
const TEST_ERP_BASE_URL = import.meta.env.VITE_TEST_ERP_BASE_URL;

const API = {
  getVegetableAvailableDate: `/order/available-vegetable-purchase-date`,
  getBatchVegetablePurchaseProductManual: `/order/batch-vegetable-purchase-product-manual`,
  patchBatchVegetablePurchaseProductManual: `/order/batch-vegetable-purchase-product-manual`,

  getCompany: `/dashboard/companies/`,

  // 통합매입사
  getIntegratedCompany: `/integrate/integrate_companies/`,
  getIntegratedCompanyExcel: `/integrate/integrate_companies/export/`,

  // 직매입사
  getBuyCompanyList: `/purchase/buy_companies/`,
  getBuyCompanyInfo: (companyId: string) => `/purchase/buy_companies/${companyId}/`,
  getBuyCompanyDetail: (companyId: string) => `/purchase/buy_companies/${companyId}/details/`,
  getBuyCompanyExcel: (companyId: string) => `/purchase/buy_companies/${companyId}/details/export/`,
  buyCompanyPayment: (companyId: string) => `/purchase/buy_companies/${companyId}/payment/`,
  getBuyLog: `/log/buy_company_logs/`,

  // 위탁매입사
  getPartnerCompanyList: `/partner/partner_companies/`,
  getPartnerCompanyInfo: (companyId: string) => `/partner/partner_companies/${companyId}/`,
  getPartnerCompanyDetail: (companyId: string) =>
    `/partner/partner_companies/${companyId}/details/`,
  getPartnerCompanyExcel: (companyId: string) =>
    `/partner/partner_companies/${companyId}/details/export/`,
  partnerCompanyPayment: (companyId: string) => `/partner/partner_companies/${companyId}/payment/`,
  getPartnerLog: `/log/partner_company_logs/`,

  getCompanies: `/dashboard/companies/`,
  getUserList: `/user-dashboard/users/`,
  getBankList: `/v3/user/bank-code-list/`,
  postVerifyBankAccount: `/v3/order/toss/verify-holder-name/`,
  getUserDetail: (userId: number) => `/user-dashboard/users/${userId}/`,
  getSalesCompanyDetail: (companyId: number) => `/user-dashboard/sales-company/${companyId}/`,
  getFranchisePayment: (franchiesId: string) =>
    `/user-dashboard/franchise/${franchiesId}/default-payments/`,
  getOptions: `/user-dashboard/select-options/`,
  postUserCreate: `/user-dashboard/users/`,
  postReferralCodeValidate: `/v3/user/validate-referral-code/`,
  postCertFileUpload: `/user-dashboard/sales-company/ocr-result/`,
  postConfirmSalesCompany: (companyId: number) =>
    `/user-dashboard/sales-company/${companyId}/confirm/`,
  patchUserInfo: (userId: number) => `/user-dashboard/users/${userId}/`,
  postSalesCompanyCreate: (userId: number) => `/user-dashboard/users/${userId}/sales-company/`,
  patchSalesCompanyUpdate: (companyId: number) =>
    `/user-dashboard/sales-company/${companyId}/update/`,
  postSalesBranchCreate: (companyId: number) =>
    `/user-dashboard/sales-company/${companyId}/sales-branch/`,
  patchSalesBranchUpdate: (branchId: number) => `/user-dashboard/sales-branch/${branchId}/update/`,
  postTempPassword: (userId: number) => `/user-dashboard/users/${userId}/temp-password/`,

  // 부분환불
  getPartialRefundInfo: (orderId: string) =>
    `/user-dashboard/order/${orderId}/partial-cancel/init-data/`,
  postPartialRefund: (orderId: string) => `/user-dashboard/order/${orderId}/partial-cancel/`,
  getRefundPartnerCompany: () => `/user-dashboard/partner-companies/`,
};

export const PATH = { base: BASE_URL, erp: ERP_BASE_URL, test_erp: TEST_ERP_BASE_URL, api: API };
