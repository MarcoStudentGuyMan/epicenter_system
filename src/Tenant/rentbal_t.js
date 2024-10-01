import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home } from 'ionicons/icons';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';
import '../styles/HeaderAdmin.css';
import { useDrawer } from '../Admin/drawerContext'; // Use the drawer context

function RentBalT() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context

    const [anchorEl, setAnchorEl] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

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
                        marginLeft: isOpen ? 240 : 60,
                        transition: 'margin-left 0.3s',
                    }}
                >
                    <div className="Title">Rent Balance</div>

                    <div>
                        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem' }}>
                            <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_tenant')} className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
                                <IonIcon icon={home} className="breadcrumb-icon" />
                                <span>Home</span>
                            </Link>
                            <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
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
                                </li>
                            </div>

                            {/* Modal for PDF preview placed below */}
                            {showModal && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <span className="close" onClick={toggleModal}>&times;</span>
                                        <iframe
                                            src="/path/to/your/pdf/file.pdf"
                                            width="100%"
                                            height="500px"
                                        ></iframe>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </IonApp>
    );
}

export default RentBalT;
