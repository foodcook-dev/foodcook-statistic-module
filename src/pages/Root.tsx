import { Route, Routes } from 'react-router-dom';
import BaseLayout from '@/routes/BaseLayout';
import { MainDashboard, SalesDashboard } from '@/pages/dashboard';
import IntegratedSettlement from '@/pages/purchaser-dashboard/integrated';
import DirectSettlement from '@/pages/purchaser-dashboard/direct';
import ConsignmentSettlement from '@/pages/purchaser-dashboard/consignment';
import VegetablePurchase from '@/pages/vegetable-purchase';
import UserManagementList from '@/pages/user-management/user-list';
import UserManagementDetail from '@/pages/user-management/user-detail';
import UserManagementCreate from '@/pages/user-management/user-create';
import UserManagementEdit from '@/pages/user-management/user-edit';
import SalesCompanyEdit from '@/pages/user-management/sales-company-edit';
import SalesBranchCreate from '@/pages/user-management/sales-branch-create';
import SalesBranchEdit from '@/pages/user-management/sales-branch-edit';

export default function Root() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        {/* Settlement */}
        <Route path="/" element={<IntegratedSettlement />} />
        <Route path="/integrated" element={<IntegratedSettlement />} />
        <Route path="/direct" element={<DirectSettlement />} />
        <Route path="/consignment" element={<ConsignmentSettlement />} />

        {/* Dashboard */}
        <Route path="/dashboard/main" element={<MainDashboard />} />
        <Route path="/dashboard/sales" element={<SalesDashboard />} />

        {/* Purchase */}
        <Route path="/purchase/vegetable" element={<VegetablePurchase />} />

        {/* User Management */}
        <Route path="/user-management" element={<UserManagementList />} />
        <Route path="/user-management/create" element={<UserManagementCreate />} />
        <Route path="/user-management/:id" element={<UserManagementDetail />} />
        <Route path="/user-management/:id/edit" element={<UserManagementEdit />} />
        <Route
          path="/user-management/sales-company/:companyId/edit"
          element={<SalesCompanyEdit />}
        />
        <Route
          path="/user-management/sales-company/:companyId/branch/create"
          element={<SalesBranchCreate />}
        />
        <Route
          path="/user-management/sales-company/:companyId/branch/:branchId/edit"
          element={<SalesBranchEdit />}
        />
      </Route>
    </Routes>
  );
}
