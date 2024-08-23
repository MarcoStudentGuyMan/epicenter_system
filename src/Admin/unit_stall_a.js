import React, { useState, useEffect } from 'react';

import { IonIcon, IonBreadcrumbs, IonBreadcrumb } from '@ionic/react';
import { useNavigate } from 'react-router-dom';

import { easel, notifications,home,pencil,trash, personCircle, cube, storefront, people, triangle, prism, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/unitStall_a.css';  

import Switch from '@mui/material/Switch';
import { Breadcrumbs } from '@mui/material';


import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


function Sidebar() {
    console.log("Location: Dashboard");
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

function UnitStallA() {
    const navigate = useNavigate();

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
