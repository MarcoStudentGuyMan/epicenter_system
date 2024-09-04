import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { mail, notifications, home } from 'ionicons/icons';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import '../styles/profileA.css';
import '../styles/Layouts.css';
import '../styles/HeaderAdmin.css';
import MiniDrawer from './drawer_admin'; 
import Header from './header_admin';
import CustomButton from '../Component/Buttons';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import SaveDialog from '../Component/Modals/SaveProfileDialog';
import CancelDialog from '../Component/Modals/CancelProfileDialog'; // Import Cancel Dialog Component

import { useDrawer } from './drawerContext'; // Use the drawer context

function ProfileA() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context
    const [anchorEl, setAnchorEl] = React.useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSaveDialogOpen = () => setSaveDialogOpen(true);
    const handleSaveDialogClose = () => setSaveDialogOpen(false);
    const handleCancelDialogOpen = () => setCancelDialogOpen(true);
    const handleCancelDialogClose = () => setCancelDialogOpen(false);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
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

            <main className="tenantSide-main-content" style={{ marginLeft: isOpen ? 240 : 60, transition: 'margin-left 0.3s' }}>
                <div className="Title">
                    Profile
                </div>

                <div>
                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
                        <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link">
                            <IonIcon icon={home} className="breadcrumb-icon" />
                            <span>Home</span>
                        </Link>
                        <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link">
                            Profile
                        </Link>
                    </Breadcrumbs>

                    <section className="profileA-align">
                        <div className="noButtons">
                            <li>
                                <label>First Name:</label>
                                <input className="for-input" placeholder="Enter First Name" value="Marco" size="30" />
                            </li>
                            <li>
                                <label>Last Name:</label>
                                <input className="for-input" placeholder="Enter Last Name" value="Medina" size="30" />
                            </li>
                            <li>
                                <label>Email:</label>
                                <input className="for-input" placeholder="Enter Email" value="marcofmedina@su.edu.ph" size="30" />
                            </li>
                            <li>
                                <label>Password:</label>
                                <input className="for-input" type="password" placeholder="Enter Password" size="30" />
                            </li>
                            <li>
                                <label>Contact #:</label>
                                <input className="for-input" placeholder="Enter Contact Number" value="09562905289" size="30" />
                            </li>
                        </div>
                        <div className="profile-image">
                            <img className="user-profile" src={`${process.env.PUBLIC_URL}/marco.jpg`} alt="UserProfile" />
                            <p>Manager ID: 0003</p>
                        </div>

                        <div className="buttons">
                            <CustomButton color="primary" variant="contained" onClick={handleSaveDialogOpen}>Save</CustomButton>
                            <CustomButton color="warning" variant="contained" onClick={handleCancelDialogOpen}>Cancel</CustomButton>
                        </div>
                    </section>
                </div>

                <SaveDialog open={saveDialogOpen} onClose={handleSaveDialogClose} />
                <CancelDialog open={cancelDialogOpen} onClose={handleCancelDialogClose} />
            </main>
        </div>
    );
}

export default ProfileA;
