import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home, personCircle,prism,triangle, storefront, mail, chatbubble, newspaper, calculator, exit, pencil, people } from 'ionicons/icons'; 
import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';
import '../styles/HeaderAdmin.css';
import '../styles/dashboardT.css'; 
import { useDrawer } from '../Admin/drawerContext'; // Use the drawer context



function DashboardT() {

    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <IonApp>
        <div className="app-container">
            <MiniDrawer />
            <Header
                drawerOpen={isOpen}
                handleDrawerToggle={toggleDrawer}
                handleClick={handleClick}
                anchorEl={anchorEl}
                handleClose={handleClose}
                navigate={navigate}
            />  

            <main
                className="tenantSide-main-content"
                style={{
                    marginLeft: isOpen ? 240 : 60, // Adjust main content margin based on drawer state
                    transition: 'margin-left 0.3s', // Smooth transition for margin change
                }}
            >
                <div className="tenant-dashboard-content">
                    <h2>What do you want to start with?</h2>
                    <div className="tenant-options">
                       
                        <div className="option-item" onClick={() => navigate('/rentbalance_tenant')}>
                            <IonIcon className="iconDbSize" icon={newspaper} />
                            <span>Rent Balance</span>
                        </div>
                        
                        <div className="option-item" onClick={() => navigate('/minisite_tenant')}>
                            <IonIcon className="iconDbSize" icon={prism} />
                            <span>Mini Site</span>
                        </div>
                        <div className="option-item" onClick={() => navigate('/email_tenant')}>
                            <IonIcon className="iconDbSize" icon={mail} />
                            <span>Email</span>
                        </div>
                        <div className="option-item" onClick={() => navigate('/message_tenant')}>
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

export default DashboardT;
