import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Homepage/navbar';
import Home from './Homepage/home';
import Location from './Homepage/location';
import Community from './Homepage/community';
import JoinUs from './Homepage/joinus';
import Footer from './Homepage/footer';
import LoginA from './Admin/login_a';
import LoginT from './Tenant/login_t';
import LoginHere from './Homepage/loginHere';
import DashboardA from './Admin/dashboard_a';
import ProfileA from './Admin/profile_a';
import StallA from './Admin/stalls_a';
import TenantA from './Admin/tenants_a';
import EpicenterA from './Admin/epicentersite_a';
import EmailA from './Admin/email_a';
import DashboardT from './Tenant/dashboard_t';
import EditTenantA from './Admin/edit_tenant_a';
import EditStallA from './Admin/edit_stall_a';
import UnitStallA from './Admin/unit_stall_a';
import EditUnitStallA from './Admin/edit_unit_stall_a';
import RentBalT from './Tenant/rentbal_t';

import ProfileT from './Tenant/profile_t';
import MiniSiteA from './Admin/minisite_a';
import MessageA from './Admin/message_a';
import RentAutoA from './Admin/rentauto_a';
import RentBalA from './Admin/rentbalance_a';
import MessageT from './Tenant/message_t';
import MinisiteT from './Tenant/minisite_t';
import EmailT from './Tenant/email_t';
import './App.css';
import { Outlet } from 'react-router-dom';

import { DrawerProvider } from '../src/Admin/drawerContext'; // Import the provider
import AssignAdminRole from './Component/AdminRole';
import PrivateRoute from './Component/PrivateRoute';

function Layout() {   //footer homepage layout
    return (
      <div className="layout-container">
        <Navbar />
        <div className="content">
          <Outlet />
        </div>
        <Footer />
      </div>
    );
}

function App() { 
    return (
      <DrawerProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="location" element={<Location />} />
              <Route path="community" element={<Community />} />
              <Route path="join-us" element={<JoinUs />} />
            </Route>

            {/* ADMIN UI/dashboard components */}
            <Route path="/loginHere" element={<LoginHere />} />
            <Route path="/login_admin" element={<LoginA />} />

            {/* Private admin routes */}
            <Route 
              path="/dashboard_admin" 
              element={
                <PrivateRoute>
                  <DashboardA />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile_admin" 
              element={
                <PrivateRoute>
                  <ProfileA />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/stall_admin" 
              element={
                <PrivateRoute>
                  <StallA />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/tenant_admin" 
              element={
                <PrivateRoute>
                  <TenantA />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/epicentersite_admin" 
              element={
                <PrivateRoute>
                  <EpicenterA />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/email_admin" 
              element={
                <PrivateRoute>
                  <EmailA />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/unit_stall_admin" 
              element={
                <PrivateRoute>
                  <UnitStallA />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/edit_unit_stall_admin/:stall_unit_id" 
              element={
                <PrivateRoute>
                  <EditUnitStallA />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/minisite_admin" 
              element={
                <PrivateRoute>
                  <MiniSiteA />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/message_admin" 
              element={
                <PrivateRoute>
                  <MessageA />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/rentbalance_admin" 
              element={
                <PrivateRoute>
                  <RentBalA />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/rentautomation_admin" 
              element={
                <PrivateRoute>
                  <RentAutoA />
                </PrivateRoute>
              } 
            />

            {/* ADMIN EDIT PAGES ROUTES */}
            <Route 
              path="/edittenant_admin/:ten_id" 
              element={
                <PrivateRoute>
                  <EditTenantA />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/editstall_admin" 
              element={
                <PrivateRoute>
                  <EditStallA />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/edit_unit_stall_admin/:stall_unit_id" 
              element={
                <PrivateRoute>
                  <EditUnitStallA />
                </PrivateRoute>
              } 
            />

               {/* TENANT SIDE */}
            <Route path="/login_tenant" element={<LoginT />} />

            <Route path="/dashboard_tenant" element={<PrivateRoute><DashboardT /></PrivateRoute>} />
            <Route path="/profile_tenant" element={<PrivateRoute><ProfileT /></PrivateRoute>} />
            <Route path="/minisite_tenant" element={<PrivateRoute><MinisiteT /></PrivateRoute>} />
            <Route path="/rentbalance_tenant" element={<PrivateRoute><RentBalT /></PrivateRoute>} />
            <Route path="/email_tenant" element={<PrivateRoute><EmailT /></PrivateRoute>} />
            <Route path="/message_tenant" element={<PrivateRoute><MessageT /></PrivateRoute>} />


            {/* TESTING */}
            <Route path="/adminrole" element={<AssignAdminRole />} />
           
          </Routes>
        </div>
      </Router>
      </DrawerProvider>
    );
}

export default App;
