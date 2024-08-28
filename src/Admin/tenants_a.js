import React, { useState, useEffect } from 'react';
import { IonToggle, IonIcon, IonBreadcrumbs, IonBreadcrumb } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { easel,notifications, personCircle,pencil,cube, trash, storefront, people, triangle, prism,home, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/tenantsA.css'; 
import '../styles/Stall.css'; 
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly imported


function TenantA() {
    const navigate = useNavigate();
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

        <div className="page-title">Tenants</div>
            <div className="page-container">
                <IonBreadcrumbs className="breadcrumbs-container">
                    <IonBreadcrumb href="/dashboard_admin">
                        <IonIcon icon={home} className="icon" /> Home
                    </IonBreadcrumb>
                    <IonBreadcrumb>Tenants</IonBreadcrumb>
                </IonBreadcrumbs>

                <section className="profile-Align">
                    <div className="stall-form">
                        <div className="form-group">
                            <label>Tenant First Name:</label>
                            <input placeholder="Enter Business Name" />
                        </div>
                        <div className="form-group">
                            <label>Tenant Last Name:</label>
                            <input placeholder="Enter Business Description" />
                        </div>
                        <div className="form-group">
                            <label>Contact Number:</label>
                            <input placeholder="Enter Tenant ID" />
                        </div>

                        <div className="form-group">
                            <label>Email Address:</label>
                            <input placeholder="Enter Tenant ID" />
                        </div>

                        <div className="form-group">
                            <label>Profile Picture:</label>
                            <div className="business-logo-field">
                                <input type="file" />
                                <button>Add</button>
                            </div>
                        </div>
                    </div>

                    <table className="stalls-table">
                        <thead>
                            <tr>
                                <th>Tenant ID</th>
                                <th>Tenant First Name:</th>
                                <th>Tenant Last Name:</th>
                                <th>Contact Number:</th>
                                <th>Email Address:</th>
                                <th>Password: </th>
                                <th>Profile Picture:</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1000</td>
                                <td>Bobby</td>
                                <td>Lee</td>
                                <td>09151239876</td>
                                <td>bobbylee@gmail.com</td>
                                <td>************</td>
                                <td>bobby.png</td>
                                <td className="actions">
                                    <button className="edit"><IonIcon icon={pencil} className="edit" /><a onClick={() => navigate('/edittenant_admin')}>Edit</a></button>
                                    <button className="delete"><IonIcon icon={trash} className="delete" />Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
}

export default TenantA;
