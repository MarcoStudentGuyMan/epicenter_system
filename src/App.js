//App.js
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
import ProfileT from './Tenant/profile_t';
import MiniSiteA from './Admin/minisite_a';
import MessageA from './Admin/message_a';
import RentAutoA from './Admin/rentauto_a';
import RentBalA from './Admin/rentbalance_a';

import './App.css';
import { Outlet } from 'react-router-dom';
import MiniDrawer from './Admin/drawer_admin';
import { DrawerProvider } from '../src/Admin/drawerContext'; // Import the provider







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

                {/*ADMIN UI/dashboard components*/} 
            <Route path="/loginHere" element={<LoginHere />} />
            <Route path="/login_admin" element={<LoginA />} />
            <Route path="/dashboard_admin" element={<DashboardA />} />
            <Route path="/profile_admin" element={<ProfileA />} />
            <Route path="/stall_admin" element={<StallA />} />
            <Route path="/tenant_admin" element={<TenantA />} />
            <Route path="/epicentersite_admin" element={<EpicenterA />} />
            <Route path="/email_admin" element={<EmailA />} />
            <Route path="/unit_stall_admin" element={<UnitStallA />} />
            <Route path="/minisite_admin" element={<MiniSiteA />} />
            <Route path="/message_admin" element={<MessageA />} />
            <Route path="/rentbalance_admin" element={<RentBalA />} />
            <Route path="/rentautomation_admin" element={<RentAutoA />} />

             {/*ADMIN EDIT PAGES ROUTES*/} 
             <Route path="/edittenant_admin" element={<EditTenantA />} />
             <Route path="/editstall_admin" element={<EditStallA />} />
             <Route path="/edit_unit_stall_admin" element={<EditUnitStallA />} />
             
             {/*TENANT SIDE */}
            <Route path="/login_tenant" element={<LoginT />} />  
            <Route path="/dashboard_tenant" element={<DashboardT />} />
            <Route path="/profile_tenant" element={<ProfileT />} /> 
           

          </Routes>
        </div>
      </Router>
      </DrawerProvider>
    );
  }
  

export default App;
