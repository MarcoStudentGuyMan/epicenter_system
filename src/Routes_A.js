import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DrawerProvider } from '../src/Admin/drawerContext'; // Adjust path if necessary

import LoginA from './Admin/login_a';
import DashboardA from './Admin/dashboard_a';
import ProfileA from './Admin/profile_a';
import StallA from './Admin/stalls_a';
import TenantA from './Admin/tenants_a';
import EpicenterA from './Admin/epicentersite_a';
import EmailA from './Admin/email_a';
import UnitStallA from './Admin/unit_stall_a';
import MiniSiteA from './Admin/minisite_a';
import MessageA from './Admin/message_a';
import RentAutoA from './Admin/rentauto_a';
import RentBalA from './Admin/rentbalance_a';

function AdminLayout() {
  return (
    <DrawerProvider>
      <div className="admin-layout">
      
        <main className="admin-content">
          <Routes>
            <Route path="login_admin" element={<LoginA />} />
            <Route path="dashboard_admin" element={<DashboardA />} />
            <Route path="profile_admin" element={<ProfileA />} />
            <Route path="stall_admin" element={<StallA />} />
            <Route path="tenant_admin" element={<TenantA />} />
            <Route path="epicentersite_admin" element={<EpicenterA />} />
            <Route path="email_admin" element={<EmailA />} />
            <Route path="unit_stall_admin" element={<UnitStallA />} />
            <Route path="minisite_admin" element={<MiniSiteA />} />
            <Route path="message_admin" element={<MessageA />} />
            <Route path="rentbalance_admin" element={<RentBalA />} />
            <Route path="rentautomation_admin" element={<RentAutoA />} />
            {/* Add admin edit routes if necessary */}
          </Routes>
        </main>
       
      </div>
    </DrawerProvider>
  );
}

export default AdminLayout;
