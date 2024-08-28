import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react'; 
import { useNavigate } from 'react-router-dom';
import { easel, notifications, personCircle, cube, storefront, people, triangle, prism, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/dashboardA.css';  
import MiniDrawer from './drawer_admin';


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
                <header className="app-header">
                    <div className="header-left">
                        <a onClick={() => navigate('/dashboard_admin')}>
                            <img className="logo-nav" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                        </a>
                        <span className="app-name">Epicenter</span>
                    </div>
                    <div className="header-right">
                        <a onClick={() => navigate('/email_admin')}>
                            <IonIcon icon={mail} className="icon" />
                        </a>
                        <IonIcon icon={notifications} className="icon" />
                    </div>
                </header>
                <main className="main-content">
                    <div className="dashboard-content">
                        This is EMAIL
                    </div>
                </main>
            </div>
        </IonApp>
    );
}

export default DashboardA;
