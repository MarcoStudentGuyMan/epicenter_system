import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import LoginA from './Admin/login_a'; // Make sure the path is correct
import LoginT from './Tenant/login_t'; // Make sure the path is correct
import DashboardA from './Admin/dashboard_a'; // Adjust the import path as needed
import ProfileA from './Admin/profile_a';
import StallA from './Admin/stalls_a';
import TenantA from './Admin/tenants_a';
import EpicenterA from './Admin/epicentersite_a';
import MiniA from './Admin/minisite_a';
import EmailA from './Admin/email_a';
import MessageA from './Admin/message_a';
import RentBalA from './Admin/rentbalance_a';
import RentAutoA from './Admin/rentautomation_a';
import EditTenantA from './Admin/edit_tenant_a';
import EditStallA from './Admin/edit_stall_a';
import '@ionic/react/css/core.css';
import { setupIonicReact } from '@ionic/react';
setupIonicReact();

function NavigationComponent() {
    const navigate = useNavigate();
    return (
        <>
            <p>SELECT USER LOGIN TO EPICENTER</p>
            <div className="container">
                <div className="square" onClick={() => navigate('/login_admin')}>ADMIN</div>
                <div className="square" onClick={() => navigate('/login_tenant')}>TENANT</div>
            </div>
        </>
    );
}
function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/*ADMIN ROUTES*/}
                    <Route path="/" element={<NavigationComponent />} />
                    <Route path="/login_admin" element={<LoginA />} />
                    <Route path="/login_tenant" element={<LoginT />} />
                    <Route path="/dashboard_admin" element={<DashboardA />} />
                    <Route path="/profile_admin" element={<ProfileA />} />
                    <Route path="/stall_admin" element={<StallA />} />
                    <Route path="/tenant_admin" element={<TenantA />} />
                    <Route path="/epicentersite_admin" element={<EpicenterA />} />
                    <Route path="/minisite_admin" element={<MiniA />} />
                    <Route path="/email_admin" element={<EmailA />} />
                    <Route path="/message_admin" element={<MessageA />} />
                    <Route path="/rentbalance_admin" element={<RentBalA />} />
                    <Route path="/rentautomation_admin" element={<RentAutoA />} />
                    <Route path="/edittenant_admin" element={<EditTenantA />} />
                    <Route path="/editstall_admin" element={<EditStallA />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
