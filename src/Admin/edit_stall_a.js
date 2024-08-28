import React, { useState, useEffect } from 'react';
import { IonToggle, IonIcon, IonBreadcrumbs, IonBreadcrumb, IonButtons, IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { easel, home, notifications,cube, personCircle, storefront, people, triangle, prism, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly importe
import CustomButton from '../Component/Buttons';

function EditStallA() {
    const navigate = useNavigate(); // Correctly define `navigate` here

    const [drawerOpen, setDrawerOpen] = useState(true);

    const handleDrawerToggle = (isOpen) => {
        setDrawerOpen(isOpen);
    };

    const [selectedStalls, setSelectedStalls] = useState([]);

    const stallOptions = [
        { value: '1A', label: <span className="black-text">1A</span> },
        { value: '1B', label: <span className="black-text">1B</span> },
        { value: '1C', label: <span className="black-text">1C</span> },
        { value: '1D', label: <span className="black-text">1D</span> },
        { value: '1E', label: <span className="black-text">1E</span> },
        // Add more options as needed
    ];

    const handleStallChange = (selectedOptions) => {
        setSelectedStalls(selectedOptions);
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
                Edit Stall Information
            </div>

            <div className="page-container">
                <IonBreadcrumbs className="breadcrumbs-container">
                    <IonBreadcrumb href="/dashboard_admin">
                        <IonIcon icon={home} className="icon" />
                        Home
                    </IonBreadcrumb>
                    <IonBreadcrumb href="/stall_admin">
                        Stalls
                    </IonBreadcrumb>
                    <IonBreadcrumb>
                        Edit Stall
                    </IonBreadcrumb>
                </IonBreadcrumbs>

                <section className="profileA-align">
                    <div className="noButtons">
                        <li>
                            <label>Stall Type: </label>
                            <select className='for-input'>
                                <option value="" disabled selected>Select Stall Type</option>
                                <option>Cafe and Pastry</option>
                                <option>Restaurant and Bar</option>
                                <option>Sweets and Desserts</option>
                                <option>Groceries</option>
                                <option>Others</option>
                            </select>
                        </li>
                        <li>
                            <label>Stall Unit/s:</label>
                            <div className="for-input">
            
                            <Select 
                                isMulti
                                options={stallOptions}
                                onChange={handleStallChange}
                                value={selectedStalls}
                                classNamePrefix="react-select"
                            />
                        </div>
                        </li>
                        <li>
                            <label>Business Name:</label>
                            <input className="for-input" placeholder="Enter Business Name" value="Hogwarts" size="30" />
                        </li>
                        <li>
                            <label>Business Description: </label>
                            <input className="for-input" placeholder="Enter Business Description" value="Medina" size="30" />
                        </li>
                       
                        <li>
                            <label>Tenant ID:</label>
                            <select className='for-input'>
                                <option value="" disabled selected>Select Tenant ID</option>
                                <option>sample tenant name</option>
                            </select>
                        </li>
                    
                    </div>
                    <div className="profile-image">
                        <img className="user-profile" src={`${process.env.PUBLIC_URL}/hogwarts.jpg`} alt="UserProfile" />
                        <p>Stall ID: 0012</p>
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

export default EditStallA;


