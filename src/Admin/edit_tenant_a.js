
import React, { useState, useEffect } from 'react';
import { IonToggle, IonIcon, IonBreadcrumbs, IonBreadcrumb, IonButtons, IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { easel,cube, home, notifications, personCircle, storefront, people, triangle, prism, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly importe
import CustomButton from '../Component/Buttons';


function EditTenantA() {
    const navigate = useNavigate(); // Correctly define `navigate` here
    const [drawerOpen, setDrawerOpen] = useState(true);

    const handleDrawerToggle = (isOpen) => {
        setDrawerOpen(isOpen);
    };

    return (
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

            <div className="page-title">
                Edit Tenant Profile
            </div>

            <div className="page-container">
                <IonBreadcrumbs className="breadcrumbs-container">
                    <IonBreadcrumb href="/dashboard_admin">
                        <IonIcon icon={home} className="icon" />
                        Home
                    </IonBreadcrumb>
                    <IonBreadcrumb href="/tenant_admin">
                        Tenants
                    </IonBreadcrumb>
                    <IonBreadcrumb>
                        Edit Tenant
                    </IonBreadcrumb>
                </IonBreadcrumbs>

                <section className="profileA-align">
                    <div className="noButtons">
                        <li>
                            <label>First Name:</label>
                            <input className="for-input" placeholder="Enter First Name" value="Bobby" size="30" />
                        </li>
                        <li>
                            <label>Last Name:</label>
                            <input className="for-input" placeholder="Enter Last Name" value="Lee" size="30" />
                        </li>
                        <li>
                            <label>Contact #:</label>
                            <input className="for-input" placeholder="Enter Contact Number" value="09562905289" size="30" />
                        </li>
                        <li>
                            <label>Email:</label>
                            <input className="for-input" placeholder="Enter Email" value="Bobbylee@gmail.com" size="30" />
                        </li>
                        <li>
                            <label>Password:</label>
                            <input className="for-input" type="password" placeholder="Enter Password" size="30" />
                        </li>
                      
                    </div>
                    <div className="profile-image">
                        <img className="user-profile" src={`${process.env.PUBLIC_URL}/rubeus.jpg`} alt="UserProfile" />
                        <p>Tenant ID: 1000</p>
                    </div>
                    <div className="buttons">
                            <CustomButton color="primary" variant="contained">Save</CustomButton>
                            <CustomButton color="error" variant="contained">Delete</CustomButton>
                            <CustomButton color="warning" variant="contained">Cancel</CustomButton>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default EditTenantA;
