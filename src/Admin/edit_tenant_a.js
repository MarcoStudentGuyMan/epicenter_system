import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate,useParams } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly imported
import React, { useState, useEffect } from 'react';
import { IonIcon, IonBreadcrumbs, IonBreadcrumb } from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { home, notifications, mail } from 'ionicons/icons';
import MiniDrawer from './drawer_admin';
import CustomButton from '../Component/Buttons';
import { supabase } from '../supabaseConnect';import Header from './header_admin';
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

    const { ten_id } = useParams();
    const hardcodedTenId = 'TEN-24-001'; // Replace with an actual tenant ID from your database

    // Log the retrieved tenant ID
    useEffect(() => {
        console.log('Retrieved ten_id from URL:', ten_id || hardcodedTenId);
    }, [ten_id]);

    const [tenant, setTenant] = useState({
        ten_FirstName: '',
        ten_LastName: '',
        ten_ContactNum: '',
        ten_Email: '',
        ten_Password: '',
        ten_ProfilePic: '',
    });

    useEffect(() => {
        const fetchTenant = async () => {
            const idToFetch = ten_id || hardcodedTenId;
            if (!idToFetch) {
                console.error('ten_id is undefined');
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('TENANT')
                    .select('*')
                    .eq('ten_id', idToFetch)
                    .single();

                if (error) {
                    console.error('Error fetching tenant:', error);
                } else {
                    console.log('Fetched tenant data:', data);
                    setTenant(data);
                }
            } catch (err) {
                console.error('Error during tenant fetch:', err);
            }
        };

        fetchTenant();
    }, [ten_id, hardcodedTenId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTenant({
            ...tenant,
            [name]: value,
        });
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from('TENANT')
                .update({
                    ten_FirstName: tenant.ten_FirstName,
                    ten_LastName: tenant.ten_LastName,
                    ten_ContactNum: tenant.ten_ContactNum,
                    ten_Email: tenant.ten_Email,
                })
                .eq('ten_id', ten_id || hardcodedTenId);

            if (error) {
                console.error('Error updating tenant:', error);
            } else {
                console.log('Tenant updated successfully');
                navigate('/tenant_admin');
            }
        } catch (err) {
            console.error('Error during tenant update:', err);
        }
    };


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
                            <input
                                className="for-input"
                                name="ten_FirstName"
                                placeholder="Enter First Name"
                                value={tenant.ten_FirstName}
                                size="30"
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Last Name:</label>
                            <input
                                className="for-input"
                                name="ten_LastName"
                                placeholder="Enter Last Name"
                                value={tenant.ten_LastName}
                                size="30"
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Contact #:</label>
                            <input
                                className="for-input"
                                name="ten_ContactNum"
                                placeholder="Enter Contact Number"
                                value={tenant.ten_ContactNum}
                                size="30"
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Email:</label>
                            <input
                                className="for-input"
                                name="ten_Email"
                                placeholder="Enter Email"
                                value={tenant.ten_Email}
                                size="30"
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Password:</label>
                            <input
                                className="for-input"
                                type="password"
                                name="ten_Password"
                                placeholder="Enter Password"
                                size="30"
                                onChange={handleInputChange}
                            />
                        </li>
                    </div>
                    <div className="profile-image">
                        <img className="user-profile" src={tenant.ten_ProfilePic} alt="UserProfile" />
                        <p>Tenant ID: {ten_id || hardcodedTenId}</p>
                    </div>
                    <div className="buttons">
                            <CustomButton color="primary" variant="contained" onClick={handleSaveDialogOpen}>Save</CustomButton>
                            <CustomButton color="error" variant="contained" onClick={handleDeleteDialogOpen}>Delete</CustomButton>
                            <CustomButton color="warning" variant="contained" onClick={() => navigate('/tenant_admin')}>Cancel</CustomButton>
                        </div>
                        
                </section>
                </main>
            <SaveDialog open={saveDialogOpen} onClose={handleSaveDialogClose} />
            <DeleteDialog open={deleteDialogOpen} onClose={handleDeleteDialogClose} />
            </div>
        
    );
}



export default EditTenantA;
