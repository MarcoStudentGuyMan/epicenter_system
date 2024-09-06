import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DrawerProvide } from '../src/Tenant/drawerContextT'; // Adjust path if necessary


import LoginT from './Tenant/login_t';
import DashboardT from './Tenant/dashboard_t';
import ProfileT from './Tenant/profile_t';

function TenantLayout() {
  return (
    <DrawerProvide>
      <div className="tenant-layout">
       
        <main className="tenant-content">
          <Routes>
            <Route path="login_tenant" element={<LoginT />} />
            <Route path="dashboard_tenant" element={<DashboardT />} />
            <Route path="profile_tenant" element={<ProfileT />} />
            {/* Add other tenant routes here */}
          </Routes>
        </main>
       
      </div>
    </DrawerProvide>
  );
}

export default TenantLayout;
