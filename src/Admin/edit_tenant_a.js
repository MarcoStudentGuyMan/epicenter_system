import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { home } from 'ionicons/icons'; 
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MiniDrawer from './drawer_admin';
import CustomButton from '../Component/Buttons';
import { supabase, supabaseAdmin } from '../supabaseConnect';  // Ensure admin import for deletion
import Header from './header_admin';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useDrawer } from './drawerContext'; 

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function EditTenantA() {
    const navigate = useNavigate();
    const { ten_id } = useParams();
    const { isOpen, toggleDrawer } = useDrawer(); 
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const idToFetch = ten_id; 
    const [tenant, setTenant] = useState({
        ten_FirstName: '',
        ten_LastName: '',
        ten_ContactNum: '',
        ten_Email: '',
        ten_ProfilePic: '',
        ten_UID: ''  // UID for auth deletion
    });

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                console.log('Fetching tenant data...');
                const { data, error } = await supabase
                    .from('TENANT')
                    .select('*')
                    .eq('ten_id', idToFetch)
                    .single();

                if (error) {
                    console.error('Error fetching tenant:', error);
                } else {
                    setTenant(data);
                    console.log('Tenant data fetched:', data);
                }
            } catch (err) {
                console.error('Error during tenant fetch:', err);
            }
        };

        fetchTenant();
    }, [idToFetch]);

    // Deleting Tenant
    const handleDelete = async () => {
        try {
            console.log('Preparing to delete tenant...');
            const tenantUID = tenant.ten_UID;  // Ensure we use the correct UID for deletion
            console.log('Tenant UID:', tenantUID);

            if (!tenantUID) {
                throw new Error('No tenant UID found');
            }

            // Delete tenant from the TENANT table
            const { error: deleteTenantError } = await supabase
                .from('TENANT')
                .delete()
                .eq('ten_id', idToFetch);

            if (deleteTenantError) {
                console.error('Error deleting tenant from the TENANT table:', deleteTenantError);
                throw deleteTenantError;
            }

            console.log('Tenant deleted from the TENANT table.');

            // Delete the associated user from Supabase Auth using the UID
            const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(tenantUID);

            if (deleteAuthError) {
                console.error('Error deleting tenant user from Supabase Auth:', deleteAuthError);
                throw deleteAuthError;
            }

            console.log('Tenant user deleted from Supabase Auth.');

            // Navigate back to tenants list after deletion
            console.log('Navigating back to tenant list...');
            navigate('/tenant_admin');
        } catch (error) {
            console.error('Error during tenant deletion:', error);
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
                                disabled
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
                                disabled
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
                                disabled
                            />
                        </li>
                    </div>

                    <div className="profile-image">
                        <img className="user-profile" src={tenant.ten_ProfilePic} alt="UserProfile" />
                        <p>Tenant ID: {ten_id}</p>
                    </div>

                    <div className="buttons">
                        <CustomButton color="error" variant="contained" onClick={() => setDeleteDialogOpen(true)}>
                            Archive
                        </CustomButton>
                        <CustomButton color="warning" variant="contained" onClick={() => navigate('/tenant_admin')}>
                            Cancel
                        </CustomButton>
                    </div>
                </section>
            </main>

            {/* Delete Confirmation Modal */}
            <Modal
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        Are you sure you want to archive this tenant?
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <CustomButton onClick={handleDelete} color="error">Archive</CustomButton>
                        <CustomButton onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</CustomButton>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default EditTenantA;
