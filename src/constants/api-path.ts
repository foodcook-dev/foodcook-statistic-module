const BASE_URL = import.meta.env.VITE_API_URL;
const ERP_BASE_URL = import.meta.env.VITE_ERP_BASE_URL;

const API = {
  getVegetableAvailableDate: `/order/available-vegetable-purchase-date`,
  getBatchVegetablePurchaseProductManual: `/order/batch-vegetable-purchase-product-manual`,
  patchBatchVegetablePurchaseProductManual: `/order/batch-vegetable-purchase-product-manual`,

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
  patchSalesCompanyUpdate: (companyId: number) =>
    `/user-dashboard/sales-company/${companyId}/update/`,
  patchSalesBranchUpdate: (branchId: number) => `/user-dashboard/sales-branch/${branchId}/update/`,
};

export const PATH = { base: BASE_URL, erp: ERP_BASE_URL, api: API };
