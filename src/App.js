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
import './App.css';
import { Outlet } from 'react-router-dom';






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
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="location" element={<Location />} />
              <Route path="community" element={<Community />} />
              <Route path="join-us" element={<JoinUs />} />
            </Route>
            <Route path="/loginHere" element={<LoginHere />} />
            <Route path="/login_admin" element={<LoginA />} />
            <Route path="/dashboard_admin" element={<DashboardA />} />
            <Route path="/profile_admin" element={<ProfileA />} />
            <Route path="/stall_admin" element={<StallA />} />
            <Route path="/tenant_admin" element={<TenantA />} />
            <Route path="/epicentersite_admin" element={<EpicenterA />} />
            <Route path="/email_admin" element={<EmailA />} />
            <Route path="/login_tenant" element={<LoginT />} />
          </Routes>
        </div>
      </Router>
    );
  }
  

export default App;
