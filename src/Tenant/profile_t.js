import React from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home, personCircle, mail, chatbubble, newspaper, exit, pencil, people } from 'ionicons/icons';
import '../styles/dashboardT.css';
import '../styles/profileT.css';

function SidebarT() {
    const navigate = useNavigate();
    
    return (
        <div className="tenantSide-sidebar">
            <div className="user-greeting">
                Hello, User!
            </div>
            <div className="sidebar-content">
                <ul>
                    <li className="title">Home</li>
                    <li onClick={() => navigate('/dashboard_tenant')}>
                        <IonIcon icon={home} />
                        <span>Dashboard</span>
                    </li>

                    <li className="title">Account</li>
                    <li onClick={() => navigate('/profile_tenant')}>
                        <IonIcon icon={personCircle} />
                        <span>Profile</span>
                    </li>

                    <li className="title">Website Customization</li>
                    <li onClick={() => navigate('/minisites_tenant')}>
                        <IonIcon icon={pencil} />
                        <span>Mini Sites</span>
                    </li>

                    <li className="title">Communication</li>
                    <li onClick={() => navigate('/email_tenant')}>
                        <IonIcon icon={mail} />
                        <span>Email</span>
                    </li>
                    <li onClick={() => navigate('/forum_tenant')}>
                        <IonIcon icon={chatbubble} />
                        <span>Forum</span>
                    </li>

                    <li className="title">Rent Information</li>
                    <li onClick={() => navigate('/rentbalance_tenant')}>
                        <IonIcon icon={newspaper} />
                        <span>Rent Balance</span>
                    </li>

                    <li onClick={() => navigate('/login_tenant')}>
                        <IonIcon icon={exit} />
                        <span>Logout</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

function ProfileT() {   
    const navigate = useNavigate();
    
    return (
        <IonApp>
            <div className="app-container">
                <SidebarT />
                <header className="tenantSide-header">
                    <div className="header-left">
                        <a onClick={() => navigate('/dashboard_tenant')}>
                            <img className="tenant-logo-nav" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                        </a>
                        <span className="tenant-app-name">Epicenter</span>
                    </div>
                    <div className="header-right">
                        <a onClick={() => navigate('/email_tenant')}>
                            <IonIcon icon={mail} className="icon" />
                        </a>
                        <IonIcon icon={people} className="icon" />
                    </div>
                </header>
                <main className="tenantSide-main-content">
                    <div className="profile-container">
                        <div className="profile-header">
                            <span className="breadcrumb" onClick={() => navigate('/dashboard_tenant')}>
                                <IonIcon icon={home} className="breadcrumb-icon" />
                                <span className="breadcrumb-text">Home</span>
                            </span>
                            <h1 className="profile-title">Profile</h1>
                        </div>
                        <div className="profile-content">
                            <div className="profile-form">
                                <label>First Name:</label>
                                <input type="text"  />
                                <label>Last Name:</label>
                                <input type="text" />
                                <label>Email:</label>
                                <input type="email" />
                                <label>Password:</label>
                                <input type="password" />
                                <label>Contact #:</label>
                                <input type="text" value="" />
                                <div className="form-actions">
                                    <button className="save-button">Save</button>
                                    <button className="cancel-button">Cancel</button>
                                </div>
                            </div>
                            <div className="profile-image">
                                <img src={`${process.env.PUBLIC_URL}/hagrid.png`} alt="USER" />
                                <span className="tenant-id">Tenant ID: 2000</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </IonApp>
    );
}

export default ProfileT;
