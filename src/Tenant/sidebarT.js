import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/sidebarT.css'; // Sidebar specific styles

function SidebarT() {
    const navigate = useNavigate();
    return (
        <div className="tenant-sidebar">
            <div className="sidebarTenant-header">
               
                <h2>Welcome USER!!</h2>
            </div>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/dashboard_tenant" activeClassName="active">Dashboard</NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile_tenant" activeClassName="active">Profile</NavLink>
                    </li>
                    <li>
                        <NavLink to="/minisites_tenant" activeClassName="active">Mini Sites</NavLink>
                    </li>
                    <li>
                        <NavLink to="/email_tenant" activeClassName="active">Email</NavLink>
                    </li>
                    <li>
                        <NavLink to="/forum_tenant" activeClassName="active">Forum</NavLink>
                    </li>
                    <li>
                        <NavLink to="/rentbalance_tenant" activeClassName="active">Rent Balance</NavLink>
                    </li>
                </ul>
            </nav>
            <button className="logout-button" onClick={() => navigate('/login_tenant')}>LOGOUT</button>
        </div>
    );
}

export default SidebarT;
