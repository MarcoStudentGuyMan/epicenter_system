import React, { useState, useEffect } from 'react';
import { IonToggle, IonIcon, IonBreadcrumbs, IonBreadcrumb } from '@ionic/react';
import { useNavigate } from 'react-router-dom';

import { easel,notifications, personCircle,pencil, trash, storefront, people, triangle, prism,home, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/tenantsA.css'; 
import '../styles/Stall.css'; 
import Switch from '@mui/material/Switch';

function Sidebar() {
    console.log("Location: Tenant");
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleResize = () => {
        if (window.innerWidth < 768) { // Adjust the width threshold as needed
            setIsOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Check the initial window size

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
            <Switch 
                    checked={isOpen} 
                    onChange={toggleSidebar} 
                    inputProps={{ 'aria-label': 'Switch sidebar' }} 
                />
            </div>
            <div className="sidebar-content">
                <nav>
                    <ul>
                        <li><span>Hello (user)</span> </li>
                        <li className="title"><span>Home</span></li>
                        <li><IonIcon icon={easel} /><span><a onClick={() => navigate('/dashboard_admin')}>Dashboard</a></span></li>

                        <li className="title"><span>Account</span></li>
                        <li><IonIcon icon={personCircle} /> <span><a onClick={() => navigate('/profile_admin')}>Profile</a></span></li>

                        <li className="title"><span>Environment</span></li>
                        <li><IonIcon icon={storefront} /> <span><a onClick={() => navigate('/stall_admin')}>Stalls</a></span></li>
                        <li><IonIcon icon={people} /> <span><a onClick={() => navigate('/tenant_admin')}>Tenants</a></span></li>

                        <li className="title"><span>Website Customization</span></li>
                        <li><IonIcon icon={triangle} /> <span><a onClick={() => navigate('/epicentersite_admin')}>Epicenter Site</a></span></li>
                        <li><IonIcon icon={prism} /> <span><a onClick={() => navigate('/minisite_admin')}>Mini Sites</a></span></li>

                        <li className="title"><span>Communication</span></li>
                        <li><IonIcon icon={mail} /> <span><a onClick={() => navigate('/email_admin')}>Email</a></span></li>
                        <li><IonIcon icon={chatbubble} /> <span><a onClick={() => navigate('/message_admin')}>Message</a></span></li>

                        <li className="title"><span>Rent Information</span></li>
                        <li><IonIcon icon={newspaper} /> <span><a onClick={() => navigate('/rentbalance_admin')}>Rent Balance</a></span></li>
                        <li><IonIcon icon={calculator} /> <span><a onClick={() => navigate('/rentautomation_admin')}>Rent Automation</a></span></li>
                        <li><IonIcon icon={exit} /> <span><a onClick={() => navigate('/loginHere')}>Logout</a></span></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

function TenantA() {
    const navigate = useNavigate();

    return (
        
        <div className="app-container">
        <Sidebar />
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
