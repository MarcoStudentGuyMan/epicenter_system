import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarT from '../Tenant/sidebarT'; // Sidebar Component
import '../styles/dashboardT.css'; // Tenant dashboard specific styles
import { IonIcon } from '@ionic/react';
import { mail, notifications } from 'ionicons/icons';

function DashboardT() {
    const navigate = useNavigate();

    return (
        <div className="tenant-dashboard">
            <SidebarT />
            <div className="dashboardTenant-content">
                <header className="tenant-header">
                    <div className="header-left">
                        <a onClick={() => navigate('/dashboard_tenant')}>
                            <img className="logo-nav" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                        </a>
                        <span className="app-name">Epicenter</span>
                    </div>
                    <div className="header-right">
                        <a onClick={() => navigate('/email_tenant')}>
                            <IonIcon icon={mail} className="icon" />
                        </a>
                        <IonIcon icon={notifications} className="icon" />
                    </div>
                </header>
                <h1>What do you want to start with?</h1>
                <div className="tiles">
                    <div className="tile" onClick={() => navigate('/rentbalance_tenant')}>
                        <img src={`${process.env.PUBLIC_URL}/icons/rent_balance_icon.png`} alt="Rent Balance" />
                        <p>Rent Balance</p>
                    </div>
                    <div className="tile" onClick={() => navigate('/minisites_tenant')}>
                        <img src={`${process.env.PUBLIC_URL}/icons/minisites_icon.png`} alt="Mini Sites" />
                        <p>Mini Sites</p>
                    </div>
                    <div className="tile" onClick={() => navigate('/forum_tenant')}>
                        <img src={`${process.env.PUBLIC_URL}/icons/forum_icon.png`} alt="Forum" />
                        <p>Forum</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardT;
