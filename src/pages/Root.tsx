import { Route, Routes } from 'react-router-dom';
import BaseLayout from '@/routes/BaseLayout';
import { MainDashboard, SalesDashboard } from '@/pages/dashboard/templates';
import IntegratedSettlement from './integrated-settlement/templates';
import DirectSettlement from './direct-settlement/templates';
import ConsignmentSettlement from './consignment-settlement/templates';
import VegetablePurchase from './vegetable-purchase/templates';

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
      </Route>
    </Routes>
  );
}
