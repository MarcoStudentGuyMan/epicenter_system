import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home } from 'ionicons/icons';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import '../styles/profileA.css';
import '../styles/Layouts.css';
import '../styles/HeaderAdmin.css';
import MiniDrawer from './drawer_admin'; 
import Header from './header_admin';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, TextField } from '@mui/material';
import styles from '../styles/profileT.module.css';
import { useDrawer } from './drawerContext'; // Use the drawer context

function ProfileA() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context
    const [anchorEl, setAnchorEl] = React.useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
            <main
                className="tenantSide-main-content"
                style={{
                    marginLeft: isOpen ? 240 : 60, // Adjust main content margin based on drawer state
                    transition: 'margin-left 0.3s', // Smooth transition for margin change
                }}
            >
                <div className="profile-content">
                    <div className="profile-form">
                        <h2>Profile</h2>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="firstName"
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="lastName"
                        />
                        <TextField
                            label="Contact"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="contact"
                        />
                        <TextField
                            label="Change Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="password"
                        />
                        <Button
                            variant="contained"
                            color="success"
                            className="save-button"
                        >
                            Save
                        </Button>
                    </div>

                    {/* Profile Picture and File Upload */}
                    <div className="profile-image">
                        <Avatar
                            alt="User Avatar"
                            sx={{ width: 150, height: 150 }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            className="file-upload"
                        />
                        <span className="tenant-id">Tenant ID: 0000</span>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProfileA;
