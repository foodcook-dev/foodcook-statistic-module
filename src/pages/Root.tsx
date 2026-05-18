import { Route, Routes } from 'react-router-dom';
import BaseLayout from '@/routes/BaseLayout';
import { MainDashboard, SalesDashboard } from '@/pages/dashboard';
import IntegratedSettlement from '@/pages/purchaser-dashboard/integrated';
import DirectSettlement from '@/pages/purchaser-dashboard/direct';
import ConsignmentSettlement from '@/pages/purchaser-dashboard/consignment';
import VegetablePurchase from '@/pages/vegetable-purchase';
import UserManagementList from '@/pages/user-management/list';
import UserManagementDetail from '@/pages/user-management/detail';
import UserManagementCreate from '@/pages/user-management/create';
import UserEdit from '@/pages/user-management/user/edit';
import SalesCompanyCreate from '@/pages/user-management/sales-company/create';
import SalesCompanyEdit from '@/pages/user-management/sales-company/edit';
import SalesBranchCreate from '@/pages/user-management/sales-branch/create';
import SalesBranchEdit from '@/pages/user-management/sales-branch/edit';
import PartialRefund from '@/pages/partial-refund';

export default function Root() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path="/" element={<IntegratedSettlement />} />

        {/* Settlement : 매입사 대시보드 - integrated(통합), direct(직매입), consignment(위탁매입) */}
        <Route path="/integrated" element={<IntegratedSettlement />} />
        <Route path="/direct" element={<DirectSettlement />} />
        <Route path="/consignment" element={<ConsignmentSettlement />} />

        {/* Dashboard : 통합매출 대시보드 */}
        <Route path="/dashboard/main" element={<MainDashboard />} />
        <Route path="/dashboard/sales" element={<SalesDashboard />} />

        {/* Purchase : 야채 매입 */}
        <Route path="/purchase/vegetable" element={<VegetablePurchase />} />

        {/* User Management : 사용자 통합 관리 */}
        <Route path="/user-management">
          <Route index element={<UserManagementList />} />
          <Route path="create" element={<UserManagementCreate />} />
          <Route path=":id" element={<UserManagementDetail />} />
          <Route path=":id/edit" element={<UserEdit />} />
          <Route path=":id/sales-company/create" element={<SalesCompanyCreate />} />
          <Route path="sales-company/:companyId/edit" element={<SalesCompanyEdit />} />
          <Route path="sales-company/:companyId/branch/create" element={<SalesBranchCreate />} />
          <Route
            path="sales-company/:companyId/branch/:branchId/edit"
            element={<SalesBranchEdit />}
          />
        </Route>

        {/* 부분 환불 등록 페이지 */}
        <Route path="/partial-refund" element={<PartialRefund />} />
      </Route>
    </Routes>
  );
}
