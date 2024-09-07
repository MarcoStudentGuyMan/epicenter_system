import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home, personCircle,prism,triangle, storefront, mail, chatbubble, newspaper, calculator, exit, pencil, people } from 'ionicons/icons';
import { supabase } from '../supabaseConnect';
import '../styles/dashboardT.css';  
import '../styles/dashboardA.css';
import CustomButton from '../Component/Buttons';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Select from 'react-select';

import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';
import '../styles/HeaderAdmin.css';
import { useDrawer } from '../Admin/drawerContext'; // Use the drawer context



function  RentBalT() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedStalls, setSelectedStalls] = useState([]);

    const handleSaveDialogOpen = () => setSaveDialogOpen(true);
    const handleSaveDialogClose = () => setSaveDialogOpen(false);
    const handleDeleteDialogOpen = () => setDeleteDialogOpen(true);
    const handleDeleteDialogClose = () => setDeleteDialogOpen(false);

    const handleStallChange = (selectedOptions) => {
        setSelectedStalls(selectedOptions);
    };

    
const stallOptions = [
    { value: '1A', label: <span className="black-text">1A</span> },
    { value: '1B', label: <span className="black-text">1B</span> },
    { value: '1C', label: <span className="black-text">1C</span> },
    { value: '1D', label: <span className="black-text">1D</span> },
    { value: '1E', label: <span className="black-text">1E</span> },
    // Add more options as needed
];

    return (
        <IonApp>
            <div className="app-container">
                <MiniDrawer />
                <Header
                drawerOpen={isOpen}
                handleDrawerToggle={toggleDrawer}
                handleClick={handleClick}
                anchorEl={anchorEl}
                handleClose={handleClose}
                navigate={navigate}
            />  
                  <main
                className="tenantSide-main-content"
                style={{
                    marginLeft: isOpen ? 240 : 60, // Adjust main content margin based on drawer state
                    transition: 'margin-left 0.3s', // Smooth transition for margin change
                }}
            >
                <div className="Title">
                    Rent Balance
                </div>

                <div>
                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
                        <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_tenant')} className="breadcrumb-link">
                            <IonIcon icon={home} className="breadcrumb-icon" />
                            <span>Home</span>
                        </Link>
                        <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link">
                            Rent Balance
                        </Link>
                    </Breadcrumbs>

                    <section className="none-pic">
                        <div className="noButtons">
                            <li>
                                <label>Tenant ID:</label>
                                <input className="adj-input" placeholder="Tenant ID" value="1000" size="30" readOnly />

                                <label>Rent ID:</label>
                            <input className="adj-input" placeholder="Tenant ID" value="2000" size="30" readOnly />
                                <label>Rent Balance:</label>
                                <input className="adj-input" placeholder="Tenant ID" value=" P 23,000" size="30" readOnly />
                            </li>
                            
                            
                            <li>
                                <label>Contract: </label>

                                {/* Download button for the PDF */}
                                <button className="contract" onClick={() => window.open('/path/to/your/pdf/file.pdf', '_blank')}>
                                    Download Contract
                                </button>

                                {/* Preview button for modal */}
                                <button className="contract" onClick={toggleModal}>
                                    Preview Contract
                                </button>

                                {/* Modal for PDF preview */}
                                {showModal && (
                                    <div className="modal">
                                        <div className="modal-content">
                                            <span className="close" onClick={toggleModal}>&times;</span>
                                            <iframe
                                                src="/path/to/your/pdf/file.pdf"
                                              
                                            ></iframe>
                                        </div>
                                    </div>
                                )}
                            </li>
                           
                        </div>
                       
                        
                    </section>
                </div>
            </main>
            </div>
        </IonApp>
    );
}




export default  RentBalT;
