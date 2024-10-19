import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { home } from 'ionicons/icons'; 
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MiniDrawer from './drawer_admin';
import CustomButton from '../Component/Buttons';
import { supabase } from '../supabaseConnect';  // Using supabase client
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
    const [archiveSuccessOpen, setArchiveSuccessOpen] = useState(false); // Modal for archive success

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

   // Archive function to set archived to true and add entry to HISTORY
const handleArchive = async () => {
    try {
        // Set tenant archived to true
        const { error: archiveError } = await supabase
            .from('TENANT')
            .update({ archived: true }) // Set the archived column to TRUE
            .eq('ten_id', idToFetch);

        if (archiveError) {
            console.error('Error archiving tenant:', archiveError);
            setDeleteDialogOpen(false); // Close delete confirmation modal
            return;
        }

        // Fetch admin details and insert into HISTORY table
        try {
            const storedAdminSession = localStorage.getItem('adminSession');
            if (storedAdminSession) {
                const sessionData = JSON.parse(storedAdminSession);
                const user = sessionData?.user;

                if (user) {
                    const { data: managerData, error: managerError } = await supabase
                        .from('MANAGER')
                        .select('Manager_LastName')
                        .eq('Manager_Email', user.email)
                        .single();

                    if (managerError) {
                        console.error('Error fetching manager details:', managerError);
                    } else {
                        const managerLastName = managerData?.Manager_LastName || 'N/A';

                        const { error: historyError } = await supabase
                            .from('HISTORY')
                            .insert([
                                {
                                    Manager_LastName: managerLastName,
                                    Action_Type: `Archived a Tenant (ID: ${idToFetch})`,
                                },
                            ]);

                        if (historyError) {
                            console.error('Error inserting history record:', historyError);
                        }
                    }
                }
            }
        } catch (historyError) {
            console.error('Error adding history entry:', historyError);
        }

        setDeleteDialogOpen(false); // Close delete confirmation modal
        setArchiveSuccessOpen(true); // Show archive success modal

    } catch (err) {
        console.error('Error during archiving:', err);
        setDeleteDialogOpen(false);
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

                <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem' }}>
                    <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
                        <IonIcon icon={home} className="breadcrumb-icon" />
                        <span>Home</span>
                    </Link>
                    <Link underline="hover" color="inherit" onClick={() => navigate('/tenant_admin')} className="breadcrumb-link"sx={{ fontSize: '1.5rem' }}>
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

            {/* Archive Confirmation Modal */}
            <Modal
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        Are you sure you want to archive this tenant?
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <CustomButton onClick={handleArchive} color="error">Archive</CustomButton>
                        <CustomButton onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</CustomButton>
                    </div>
                </Box>
            </Modal>

            {/* Archive Success Modal */}
            <Modal
                open={archiveSuccessOpen}
                onClose={() => {
                    setArchiveSuccessOpen(false);
                    navigate('/tenant_admin'); // Redirect to tenant list after closing success modal
                }}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2" align="center">
                        Tenant has been archived!
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CustomButton onClick={() => {
                            setArchiveSuccessOpen(false);
                            navigate('/tenant_admin');
                        }} color="primary">
                            Close
                        </CustomButton>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default EditTenantA;
