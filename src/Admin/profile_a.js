import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { mail, notifications, home } from 'ionicons/icons';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import '../styles/profileA.css';
import '../styles/Layouts.css';
import MiniDrawer from './drawer_admin'; 
import CustomButton from '../Component/Buttons';

function ProfileA() {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(true);

    const handleDrawerToggle = (isOpen) => {
        setDrawerOpen(isOpen);
    };

    return (
        <div className="app-container">
            <MiniDrawer onDrawerToggle={handleDrawerToggle} />
            <header className="tenantSide-header" style={{ marginLeft: drawerOpen ? 240 : 60, transition: 'margin-left 0.3s' }}>
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

            <main className="tenantSide-main-content" style={{ marginLeft: drawerOpen ? 240 : 60, transition: 'margin-left 0.3s' }}>
                <div className="Title">
                    Profile
                </div>

                <div className="page-container">
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
                            <CustomButton color="primary" variant="contained">Save</CustomButton>
                            <CustomButton color="error" variant="contained">Delete</CustomButton>
                            <CustomButton color="warning" variant="contained">Cancel</CustomButton>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default ProfileA;
