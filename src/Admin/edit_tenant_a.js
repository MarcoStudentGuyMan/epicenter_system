import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { home } from 'ionicons/icons'; // Ensure you import only needed icons
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MiniDrawer from './drawer_admin';
import CustomButton from '../Component/Buttons';
import { supabase } from '../supabaseConnect';
import Header from './header_admin';
import SaveDialog from '../Component/Modals/SaveTenantDialog';
import DeleteDialog from '../Component/Modals/DeleteTenantDialog';
import { useDrawer } from './drawerContext'; // Using drawer context

function EditTenantA() {
    const navigate = useNavigate();
    const { ten_id } = useParams();
    const { isOpen, toggleDrawer } = useDrawer(); // Drawer state management

    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const handleSaveDialogOpen = () => setSaveDialogOpen(true);
    const handleSaveDialogClose = () => setSaveDialogOpen(false);
    const handleDeleteDialogOpen = () => setDeleteDialogOpen(true);
    const handleDeleteDialogClose = () => setDeleteDialogOpen(false);
    

    const hardcodedTenId = 'TEN-24-001'; // Replace with actual tenant ID
    const idToFetch = ten_id || hardcodedTenId; // Tenant ID fallback

    const [tenant, setTenant] = useState({
        ten_FirstName: '',
        ten_LastName: '',
        ten_ContactNum: '',
        ten_Email: '',
        ten_Password: '',
        ten_ProfilePic: '',
    });

    useEffect(() => {
        console.log('Retrieved ten_id from URL:', ten_id || hardcodedTenId);
    }, [ten_id]);

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                const { data, error } = await supabase
                    .from('TENANT')
                    .select('*')
                    .eq('ten_id', idToFetch)
                    .single();

                if (error) {
                    console.error('Error fetching tenant:', error);
                } else {
                    setTenant(data);
                }
            } catch (err) {
                console.error('Error during tenant fetch:', err);
            }
        };

        fetchTenant();
    }, [idToFetch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTenant((prevTenant) => ({
            ...prevTenant,
            [name]: value,
        }));
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
                .eq('ten_id', idToFetch);

            if (error) {
                console.error('Error updating tenant:', error);
            } else {
                navigate('/tenant_admin');
            }
        } catch (err) {
            console.error('Error during tenant update:', err);
        }
    };

    return (
        <div className="app-container">
            <MiniDrawer isOpen={isOpen} onDrawerToggle={toggleDrawer} />
            <Header drawerOpen={isOpen} handleDrawerToggle={toggleDrawer} navigate={navigate} />

            <main
                className="tenantSide-main-content"
                style={{
                    marginLeft: isOpen ? 240 : 60,
                    transition: 'margin-left 0.3s',
                }}
            >
                <div className="Title">Edit Tenant Profile</div>

                <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
                    <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link">
                        <IonIcon icon={home} className="breadcrumb-icon" />
                        <span>Home</span>
                    </Link>
                    <Link underline="hover" color="inherit" onClick={() => navigate('/tenant_admin')} className="breadcrumb-link">
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
                        <CustomButton color="primary" variant="contained" onClick={handleSaveDialogOpen}>
                            Save
                        </CustomButton>
                        <CustomButton color="error" variant="contained" onClick={handleDeleteDialogOpen}>
                            Delete
                        </CustomButton>
                        <CustomButton color="warning" variant="contained" onClick={() => navigate('/tenant_admin')}>
                            Cancel
                        </CustomButton>
                    </div>
                </section>
            </main>

            <SaveDialog open={saveDialogOpen} onClose={handleSaveDialogClose} />
            <DeleteDialog open={deleteDialogOpen} onClose={handleDeleteDialogClose} />
        </div>
    );
}

export default EditTenantA;
