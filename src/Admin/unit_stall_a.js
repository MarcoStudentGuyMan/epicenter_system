import React, { useState, useEffect } from 'react';
import { IonIcon, IonBreadcrumbs, IonBreadcrumb } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { easel, notifications,home,pencil,trash, personCircle, cube, storefront, people, triangle, prism, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/unitStall_a.css';  
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly imported



function UnitStallA() {
    const navigate = useNavigate();
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

        <div className="page-title">Stall Units</div>
            <div className="page-container">

                <IonBreadcrumbs className="breadcrumbs-container">
                    <IonBreadcrumb href="/dashboard_admin">
                        <IonIcon icon={home} className="icon" /> Home
                    </IonBreadcrumb>
                    <IonBreadcrumb>Stall Units</IonBreadcrumb>
                </IonBreadcrumbs>

                <section className="profile-Align">

                    
                    <div className="stall-form">

                    <div className="form-group">
                            <label>Stall Unit Satus:</label>
                            <FormGroup className="horizontal-checkboxes">
                                <FormControlLabel 
                                    control={
                                        <Checkbox 
                                            className="small-checkbox" 
                                            checked={occupiedChecked}
                                            onChange={() => handleCheckboxChange('occupied')}
                                            disabled={!occupiedChecked && notOccupiedChecked}
                                            sx={{ color: 'white' }} // Make checkbox white
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
                                            sx={{ color: 'white' }} // Make checkbox white
                                        />
                                    } 
                                    label="NOT OCCUPIED"
                                    classes={{ label: 'checkbox-label' }} // Apply label font size
                                />
                            </FormGroup>

                        </div>
                        <div className="form-group">
                            <label>Stall Unit Name: </label>
                            <input placeholder="Enter Stall Unit Name" />
                        </div>
                        <div className="form-group">
                            <label>Stall Unit Price: </label>
                            <input type = "number" placeholder="Enter Stall Unit Price" />
                        </div>
                       

                        <div className="form-group">
                        <label>Stall ID:</label>
                            <select>
                                <option value="" disabled selected>Select Stall ID</option>
                                <option>Sample Stall ID </option>
                            </select>
                        </div>

                        

                        <div className="form-group">
                            
                                <button>Add</button>
                    
                        </div>
                    </div>

                    <table className="stalls-table">
                        <thead>
                            <tr>
                                <th>Stall Unit ID</th>
                                <th>Stall Unit Name:</th>
                                <th>Stall Unit Price</th>
                                <th>Stall Unit Status:</th>
                                
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1000</td>
                                <td>Bobby</td>
                                <td>Lee</td>
                                <td>09151239876</td>
                              
                               
                                <td className="actions">
                                    <button className="edit"><IonIcon icon={pencil} className="edit" /><a onClick={() => navigate('/edit_unit_stall_admin')}>Edit</a></button>
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


export default UnitStallA;
