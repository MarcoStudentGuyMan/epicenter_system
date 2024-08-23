
import React, { useState, useEffect } from 'react';
import { IonToggle, IonIcon, IonBreadcrumbs, IonBreadcrumb, IonButtons, IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { easel,cube, home, notifications, personCircle, storefront, people, triangle, prism, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';

import '../styles/unitStall_a.css';  


import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function Sidebar() {
    console.log("Location: AdminProfile");
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
                <IonToggle checked={isOpen} onIonChange={toggleSidebar} />
            </div>
            <div className="sidebar-content">
            <nav>
                    <ul>
                        <li><span style={{ fontSize: '18px', marginRight: '5px' }}>Hello (user)</span> </li>
                        <li className="title"><span>Home</span></li>
                        <li><IonIcon icon={easel} style={{ fontSize: '18px', marginRight: '5px' }} /><span><a onClick={() => navigate('/dashboard_admin')}>Dashboard</a></span></li>

                        <li className="title"><span>Account</span></li>
                        <li><IonIcon icon={personCircle}style={{ fontSize: '18px', marginRight: '5px' }} /> <span><a onClick={() => navigate('/profile_admin')}>Profile</a></span></li>

                        <li className="title"><span>Environment</span></li>
                        <li><IonIcon icon={cube} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/unit_stall_admin')}>Stall Units</a></span></li>
                        <li><IonIcon icon={storefront} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/stall_admin')}>Stalls</a></span></li>
                        <li><IonIcon icon={people} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/tenant_admin')}>Tenants</a></span></li>
                        
                        <li className="title"><span>Website Customization</span></li>
                        <li><IonIcon icon={triangle} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/epicentersite_admin')}>Epicenter Site</a></span></li>
                        <li><IonIcon icon={prism} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/minisite_admin')}>Mini Sites</a></span></li>

                        <li className="title"><span>Communication</span></li>
                        <li><IonIcon icon={mail} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/email_admin')}>Email</a></span></li>
                        <li><IonIcon icon={chatbubble} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/message_admin')}>Message</a></span></li>

                        <li className="title"><span>Rent Information</span></li>
                        <li><IonIcon icon={newspaper} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/rentbalance_admin')}>Rent Balance</a></span></li>
                        <li><IonIcon icon={calculator} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/rentautomation_admin')}>Rent Automation</a></span></li>
                        <li><IonIcon icon={exit} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/login_admin')}>Logout</a></span></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

function EditUnitStallA() {
    const navigate = useNavigate(); // Correctly define `navigate` here


     // State to manage checkbox selections
     const [occupiedChecked, setOccupiedChecked] = useState(false);
     const [notOccupiedChecked, setNotOccupiedChecked] = useState(false);
 
     // Handle checkbox change
     const handleCheckboxChange = (checkbox) => {
         if (checkbox === 'occupied') {
             setOccupiedChecked(!occupiedChecked);
             if (occupiedChecked) {
                 setNotOccupiedChecked(false);
             }
         } else {
             setNotOccupiedChecked(!notOccupiedChecked);
             if (notOccupiedChecked) {
                 setOccupiedChecked(false);
             }
         }
     };
 

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

            <div className="page-title">
                Edit Stall Unit
            </div>

            <div className="page-container">
                <IonBreadcrumbs className="breadcrumbs-container">
                    <IonBreadcrumb href="/dashboard_admin">
                        <IonIcon icon={home} className="icon" />
                        Home
                    </IonBreadcrumb>
                    <IonBreadcrumb href="/unit_stall_admin">
                        Stall Unit
                    </IonBreadcrumb>
                    <IonBreadcrumb>
                        Edit Stall Unit
                    </IonBreadcrumb>
                </IonBreadcrumbs>

                <section className="profileA-align">
                    <div className="noButtons">
                        <li>
                            <label>Stall Unit Name:</label>
                            <input className="for-input" placeholder="Enter Stall Unit Name"  size="30" />
                        </li>
                        <li>
                            <label>Stall Unit Price:</label>
                            <input type ="number" className="for-input" placeholder="Enter Stall Unit Price" size="30" />
                        </li>
                         
                        <div className="form-group">
                            <li>
                                <label>Stall ID: </label>
                                <select className='for-input'>
                                    <option value="" disabled selected>Select Stall Type</option>
                                    <option>Sample Stall ID</option>
                                </select>
                            </li>
                        </div>
                        <div className="form-group">
                            <label>Stall Unit Satus:</label>
                            <FormGroup className="horizontal-checkboxes black-version">
    <FormControlLabel 
        control={
            <Checkbox 
                className="small-checkbox" 
                checked={occupiedChecked}
                onChange={() => handleCheckboxChange('occupied')}
                disabled={!occupiedChecked && notOccupiedChecked}
                sx={{ color: 'black' }} // Make checkbox black
            />
        } 
        label="OCCUPIED"
        classes={{ label: 'checkbox-label' }} // Apply label font size
    />
    <FormControlLabel 
        control={
            <Checkbox 
                className="small-checkbox" 
                checked={notOccupiedChecked}
                onChange={() => handleCheckboxChange('notOccupied')}
                disabled={!notOccupiedChecked && occupiedChecked}
                sx={{ color: 'black' }} // Make checkbox black
            />
        } 
        label="NOT OCCUPIED"
        classes={{ label: 'checkbox-label' }} // Apply label font size
    />
</FormGroup>



                        </div>
                       
                       <li> 
                       <div className="buttons">
                        <IonButtons>
                            <IonButton className="save-btn">Save</IonButton>
                            <IonButton className="delete-btn">Delete</IonButton>
                            <IonButton className="cancel-btn"><a onClick={() => navigate('/unit_stall_admin')}>Cancel</a></IonButton>
                        </IonButtons>
                    </div>

                       </li>
                      
                    </div>
                  
                   
                </section>
            </div>
        </div>
    );
}

export default EditUnitStallA;
