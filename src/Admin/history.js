import React from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { receipt,archive,cube, people, prism, triangle, chatbubble, storefront, calculator, newspaper,idCardOutline } from 'ionicons/icons';
import '../styles/dashboardA.css';
import MiniDrawer from './drawer_admin';
import Header from './header_admin';
import '../styles/HeaderAdmin.css';
import { useDrawer } from './drawerContext'; // Use the drawer context


function History() {
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
                        <h2 style={{ color: 'black' }}>HISTORY</h2>
                        <div className="tenant-options">
                            1
                            2
                            3
                            4
                            5
                        </div>

                    </div>
                </main>
            </div>
        </IonApp>
    );
}

export default History;
