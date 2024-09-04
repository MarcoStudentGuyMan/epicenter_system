import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly imported
import CustomButton from '../Component/Buttons';
import Header from './header_admin';
import SaveDialog from '../Component/Modals/SaveTenantDialog';
import DeleteDialog from '../Component/Modals/DeleteTenantDialog';
import { useDrawer } from './drawerContext'; // Use drawer context
import { pencil, trash, home } from 'ionicons/icons';
function EditTenantA() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context for state management

    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleSaveDialogOpen = () => setSaveDialogOpen(true);
    const handleSaveDialogClose = () => setSaveDialogOpen(false);
    const handleDeleteDialogOpen = () => setDeleteDialogOpen(true);
    const handleDeleteDialogClose = () => setDeleteDialogOpen(false);

    return (
        <div className="app-container">
            <MiniDrawer isOpen={isOpen} onDrawerToggle={toggleDrawer} />
            <Header
                drawerOpen={isOpen}
                handleDrawerToggle={toggleDrawer}
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
                    Edit Tenant Profile
                </div>

                <div>
                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
                        <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link">
                            <IonIcon icon={home} className="breadcrumb-icon" />
                            <span>Home</span>
                        </Link>
                        <Link underline="hover" color="text.primary" onClick={() => navigate('/tenant_admin')} aria-current="page" className="breadcrumb-link">
                            Tenants
                        </Link>
                        <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link">
                            Edit Tenant
                        </Link>
                    </Breadcrumbs>

                    <section className="profileA-align">
                        <div className="noButtons">
                            <li>
                                <label>First Name:</label>
                                <input className="for-input" placeholder="Enter First Name" value="Bobby" size="30" />
                            </li>
                            <li>
                                <label>Last Name:</label>
                                <input className="for-input" placeholder="Enter Last Name" value="Lee" size="30" />
                            </li>
                            <li>
                                <label>Contact #:</label>
                                <input className="for-input" placeholder="Enter Contact Number" value="09562905289" size="30" />
                            </li>
                            <li>
                                <label>Email:</label>
                                <input className="for-input" placeholder="Enter Email" value="Bobbylee@gmail.com" size="30" />
                            </li>
                            <li>
                                <label>Password:</label>
                                <input className="for-input" type="password" placeholder="Enter Password" size="30" />
                            </li>
                        </div>
                        <div className="profile-image">
                            <img className="user-profile" src={`${process.env.PUBLIC_URL}/rubeus.jpg`} alt="UserProfile" />
                            <p>Tenant ID: 1000</p>
                        </div>
                        <div className="buttons">
                            <CustomButton color="primary" variant="contained" onClick={handleSaveDialogOpen}>Save</CustomButton>
                            <CustomButton color="error" variant="contained" onClick={handleDeleteDialogOpen}>Delete</CustomButton>
                            <CustomButton color="warning" variant="contained" onClick={() => navigate('/tenant_admin')}>Cancel</CustomButton>
                        </div>
                    </section>
                </div>
            </main>
            <SaveDialog open={saveDialogOpen} onClose={handleSaveDialogClose} />
            <DeleteDialog open={deleteDialogOpen} onClose={handleDeleteDialogClose} />
        </div>
    );
}

export default EditTenantA;
