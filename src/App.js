import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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

function Layout() {   //footer homepage layout
    return (
        <div className="layout-container">
            <Navbar />
            <div className="content">
                {/* Outlet equivalent in react-router-dom v5 */}
                <Route path="/" component={Home} exact />
                <Route path="/location" component={Location} />
                <Route path="/community" component={Community} />
                <Route path="/join-us" component={JoinUs} />
            </div>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/" component={Layout} exact />
                    <Route path="/loginHere" component={LoginHere} />
                    <Route path="/login_admin" component={LoginA} />
                    <Route path="/dashboard_admin" component={DashboardA} />
                    <Route path="/profile_admin" component={ProfileA} />
                    <Route path="/stall_admin" component={StallA} />
                    <Route path="/tenant_admin" component={TenantA} />
                    <Route path="/epicentersite_admin" component={EpicenterA} />
                    <Route path="/email_admin" component={EmailA} />
                    <Route path="/login_tenant" component={LoginT} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
