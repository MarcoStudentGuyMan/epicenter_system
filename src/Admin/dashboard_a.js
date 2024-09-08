import React from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { mail,cube, people, prism, triangle, chatbubble, storefront, calculator, newspaper } from 'ionicons/icons';
import '../styles/dashboardA.css';
import MiniDrawer from './drawer_admin';
import Header from './header_admin';
import '../styles/HeaderAdmin.css';
import { useDrawer } from './drawerContext'; // Use the drawer context

function DashboardA() {
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
                            <div className="option-item" onClick={() => navigate('/tenant_admin')}>
                                <IonIcon className="iconDbSize" icon={people} />
                                <span>Tenants</span>
                            </div>
                            <div className="option-item" onClick={() => navigate('/stall_admin')}>
                                <IonIcon className="iconDbSize" icon={storefront} />
                                <span>Stalls</span>
                            </div>
                            <div className="option-item" onClick={() => navigate('/unit_stall_admin')}>
                                <IonIcon className="iconDbSize" icon={cube} />
                                <span>Stall Units</span>
                            </div>
                            <div className="option-item" onClick={() => navigate('/rentautomation_admin')}>
                                <IonIcon className="iconDbSize" icon={calculator} />
                                <span>Rent Automation</span>
                            </div>
                            <div className="option-item" onClick={() => navigate('/rentbalance_admin')}>
                                <IonIcon className="iconDbSize" icon={newspaper} />
                                <span>Rent Balance</span>
                            </div>
                            <div className="option-item" onClick={() => navigate('/epicentersite_admin')}>
                                <IonIcon className="iconDbSize" icon={triangle} />
                                <span>Epicenter Site</span>
                            </div>
                            <div className="option-item" onClick={() => navigate('/minisite_admin')}>
                                <IonIcon className="iconDbSize" icon={prism} />
                                <span>Mini Site</span>
                            </div>
                            <div className="option-item" onClick={() => navigate('/email_admin')}>
                                <IonIcon className="iconDbSize" icon={mail} />
                                <span>Email</span>
                            </div>
                            <div className="option-item" onClick={() => navigate('/message_admin')}>
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
