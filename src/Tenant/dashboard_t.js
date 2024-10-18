import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home, personCircle, prism, chatbubble, newspaper } from 'ionicons/icons'; 
import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';
import '../styles/HeaderAdmin.css';
import '../styles/dashboardT.css'; 
import { supabase } from '../supabaseConnect';
import { useDrawer } from '../Admin/drawerContext'; // Use the drawer context
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

function DashboardT() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context
    const [anchorEl, setAnchorEl] = useState(null);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [userId, setUserId] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        // Fetch tenant data on component mount
        const fetchTenantData = async () => {
            // Retrieve tenant session from local storage
            const tenantSession = localStorage.getItem('tenantSession');
            
            if (tenantSession) {
                const parsedSession = JSON.parse(tenantSession);
                const userId = parsedSession.user?.id;
    
                if (userId) {
                    setUserId(userId);
    
                    // Fetch NewUser field from the TENANT table using the stored user ID
                    const { data, error } = await supabase
                        .from('TENANT')
                        .select('NewUser')
                        .eq('ten_UID', userId)
                        .single();
    
                    if (data && data.NewUser) {
                        setShowWelcomeModal(true);
                    } else if (error) {
                        console.error('Error fetching tenant data:', error.message);
                    }
                }
            }
        };
    
        fetchTenantData();
    }, []);

    const handleModalClose = async () => {
        setShowWelcomeModal(false);
        // Update the NewUser field to FALSE
        if (userId) {
            const { error } = await supabase
                .from('TENANT')
                .update({ NewUser: false })
                .eq('ten_UID', userId);

            if (error) {
                console.error('Error updating NewUser field:', error.message);
            }
        }
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
                            <div className="option-item" onClick={() => navigate('/profile_tenant')}>
                                <IonIcon className="iconDbSize" icon={personCircle} />
                                <span>Profile</span>
                            </div>
                            <div className="option-item" onClick={() => navigate('/message_tenant')}>
                                <IonIcon className="iconDbSize" icon={chatbubble} />
                                <span>Message</span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Welcome Modal */}
                <Dialog
                    open={showWelcomeModal}
                    onClose={handleModalClose}
                    aria-labelledby="welcome-dialog-title"
                >
                    <DialogTitle id="welcome-dialog-title">Welcome to Epicenter!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        Welcome to Epicenter! We highly encourage you to change your password. Please view our online manual to be guided (page ## ) .
                        </DialogContentText>
                        <DialogContentText>
                            <a href="https://docs.google.com/document/d/1g5hFev6kzLpb8TtA6FnRoHbMxJwI5DKx7lRFexB6t88/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
                                View Online Manual
                            </a>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleModalClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </IonApp>
    );
}

export default DashboardT;
