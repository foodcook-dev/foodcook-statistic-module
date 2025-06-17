import { Route, Routes } from 'react-router-dom';
// github pages에서 HashRouter를 사용?
// import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// import RestrictRoute, { isSignIn } from '@/routes/RestrictRoute';
import BaseLayout from '@/routes/BaseLayout';

import IntegratedSettlement from './integrated-settlement/templates';
import ConsignmentSettlement from './consignment-settlement/templates';

export default function Root() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path="/integrated" element={<IntegratedSettlement />} />
        <Route path="/consignment" element={<ConsignmentSettlement />} />
      </Route>
      {/* <Route path="/*" element={<RestrictRoute allow={isSignIn} redirect="/signIn" />}>
        <Route path="integrated" element={<IntegratedSettlement />} />
        <Route path="consignment" element={<ConsignmentSettlement />} />
      </Route> */}
    </Routes>
  );
}
