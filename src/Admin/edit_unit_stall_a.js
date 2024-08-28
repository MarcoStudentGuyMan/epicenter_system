
import React, { useState, useEffect } from 'react';
import { IonToggle, IonIcon, IonBreadcrumbs, IonBreadcrumb, IonButtons, IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { easel,cube, home, notifications, personCircle, storefront, people, triangle, prism, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/unitStall_a.css';  
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly importe
import CustomButton from '../Component/Buttons';

function EditUnitStallA() {
    const navigate = useNavigate(); // Correctly define `navigate` here
    const [drawerOpen, setDrawerOpen] = useState(true);

    const handleDrawerToggle = (isOpen) => {
        setDrawerOpen(isOpen);
    };

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
                            <CustomButton color="primary" variant="contained">Save</CustomButton>
                            <CustomButton color="error" variant="contained">Delete</CustomButton>
                            <CustomButton color="warning" variant="contained">Cancel</CustomButton>
                    </div>

                       </li>
                      
                    </div>
                  
                   
                </section>
            </div>
        </div>
    );
}

export default EditUnitStallA;
