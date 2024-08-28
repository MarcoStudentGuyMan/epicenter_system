import React, { useState } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { mail, people,prism,triangle,chatbubble, storefront, calculator, newspaper } from 'ionicons/icons';
import '../styles/dashboardA.css'; // Make sure this file exists and has the relevant styles
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly imported

function DashboardA() {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(true);

    const handleDrawerToggle = (isOpen) => {
        setDrawerOpen(isOpen);
    };

    return (
        <IonApp>
            <div className="app-container">
                <MiniDrawer onDrawerToggle={handleDrawerToggle} />
                <header
                    className="tenantSide-header"
                    style={{
                        marginLeft: drawerOpen ? 240 : 60, // Adjust header margin based on drawer state
                        transition: 'margin-left 0.3s', // Smooth transition for margin change
                    }}
                >
                    <div className="header-left">
                        <a onClick={() => navigate('/dashboard_tenant')}>
                            <img
                                className="tenant-logo-nav"
                                src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`}
                                alt="Epicenter Logo"
                            />
                        </a>
                        <span className="tenant-app-name">Epicenter</span>
                    </div>
                    <div className="header-right">
                        <a onClick={() => navigate('/email_tenant')}>
                            <IonIcon icon={mail} className="icon" />
                        </a>
                        <IonIcon icon={people} className="icon" />
                    </div>
                </header>

                <main
                    className="tenantSide-main-content"
                    style={{
                        marginLeft: drawerOpen ? 240 : 60, // Adjust main content margin based on drawer state
                        transition: 'margin-left 0.3s', // Smooth transition for margin change
                    }}
                >
                    <div className="tenant-dashboard-content">
                        <h2>What do you want to start with?</h2>
                        <div className="tenant-options">
                        <div className="option-item" onClick={() => navigate('/tenant_admin')}>
                                <IonIcon className="iconDbSize" icon={people} />
                                <span>Tenants</span>
                            </div>

                            <div className="option-item" onClick={() => navigate('/stall_admin')}>
                                <IonIcon className="iconDbSize" icon={storefront} />
                                <span>Stalls</span>
                            </div>

                            <div className="option-item" onClick={() => navigate('/rentbalance_tenant')}>
                                <IonIcon className="iconDbSize" icon={calculator} />
                                <span>Rent Automation</span>
                            </div>

                            <div className="option-item" onClick={() => navigate('/rentbalance_tenant')}>
                                <IonIcon className="iconDbSize" icon={newspaper} />
                                <span>Rent Balance</span>
                            </div>

                            <div className="option-item" onClick={() => navigate('/rentbalance_tenant')}>
                                <IonIcon className="iconDbSize" icon={triangle} />
                                <span>Epicenter Site</span>
                            </div>

                            <div className="option-item" onClick={() => navigate('/minisites_tenant')}>
                                <IonIcon className="iconDbSize" icon={prism} />
                                <span>Mini Site</span>
                            </div>

                            <div className="option-item" onClick={() => navigate('/forum_tenant')}>
                                <IonIcon className="iconDbSize" icon={mail} />
                                <span>Email</span>
                            </div>

                            <div className="option-item" onClick={() => navigate('/forum_tenant')}>
                                <IonIcon className="iconDbSize" icon={chatbubble} />
                                <span>Message</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </IonApp>
    );
}

export default DashboardA;
