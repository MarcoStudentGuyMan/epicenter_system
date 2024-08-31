import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { pencil, trash, home, mail,notifications } from 'ionicons/icons';
import { supabase } from '../supabaseConnect';
import '../styles/tenantsA.css'; 
import '../styles/Stall.css'; 
import MiniDrawer from './drawer_admin';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';


import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
function TenantA() {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [tenants, setTenants] = useState([]); // State to store tenants data
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const defaultPassword = 'tenant2024'; // Set the default password

    const handleDrawerToggle = (isOpen) => {
        setDrawerOpen(isOpen);
    };

    const handleFileChange = (event) => {
        setProfilePic(event.target.files[0]);
    };

    const handleAddTenant = async () => {
        try {
            let profilePicUrl = '';
            if (profilePic) {
                const { data, error } = await supabase.storage
                    .from('tenant-profile-pic')
                    .upload(`tenant-${Date.now()}-${profilePic.name}`, profilePic);

                if (error) {
                    throw error;
                }

                profilePicUrl = supabase.storage.from('tenant-profile-pic').getPublicUrl(data.path).data.publicUrl;
            }

            const { error: insertError } = await supabase
                .from('TENANT')
                .insert([
                    {
                        ten_FirstName: firstName,
                        ten_LastName: lastName,
                        ten_ContactNum: contactNumber,
                        ten_Email: email,
                        ten_password: defaultPassword, // Use the default password
                        ten_ProfilePic: profilePicUrl,
                    },
                ]);

            if (insertError) {
                throw insertError;
            }

            alert('Tenant added successfully!');
            setFirstName('');
            setLastName('');
            setContactNumber('');
            setEmail('');
            setProfilePic(null);

            fetchTenants(); // Refresh tenants data after adding a new tenant
        } catch (error) {
            console.error('Error adding tenant:', error.message);
            alert('Failed to add tenant. Please try again.');
        }
    };

    const fetchTenants = async () => {
        try {
            const { data: tenantsData, error } = await supabase
                .from('TENANT')
                .select('*');

            if (error) {
                throw error;
            }

            setTenants(tenantsData);
        } catch (error) {
            console.error('Error fetching tenants:', error.message);
        }
    };

    const handleDeleteTenant = async (tenantId, profilePicPath) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this tenant?');
        if (!confirmDelete) return;

        try {
            const { error: deleteError } = await supabase
                .from('TENANT')
                .delete()
                .eq('ten_id', tenantId);

            if (deleteError) {
                throw deleteError;
            }

            if (profilePicPath) {
                const { error: storageError } = await supabase
                    .storage
                    .from('tenant-profile-pic')
                    .remove([profilePicPath]);

                if (storageError) {
                    console.error('Error deleting profile picture from storage:', storageError.message);
                }
            }

            alert('Tenant deleted successfully!');
            fetchTenants(); // Refresh tenants data after deletion
        } catch (error) {
            console.error('Error deleting tenant:', error.message);
            alert('Failed to delete tenant. Please try again.');
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div className="app-container">
            <MiniDrawer onDrawerToggle={handleDrawerToggle} />
            <header
        className="tenantSide-header"
        style={{
          marginLeft: drawerOpen ? 240 : 60, // Adjust header margin based on drawer state
          transition: 'margin-left 0.3s', // Smooth transition for margin change
        }}
      >
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

            <div className="page-title">Tenants</div>
            <div className="page-container">
            <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
            <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link">
              <IonIcon icon={home} className="breadcrumb-icon" />
              <span>Home</span>
            </Link>
            <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link">
              Tenant
            </Link>
          </Breadcrumbs>
                <section className="profile-Align">
                    <div className="stall-form">
                        <div className="form-group">
                            <label>Tenant First Name:</label>
                            <input 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter First Name" 
                            />
                        </div>
                        <div className="form-group">
                            <label>Tenant Last Name:</label>
                            <input 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter Last Name" 
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Number:</label>
                            <input 
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                placeholder="Enter Contact Number" 
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address:</label>
                            <input 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Email Address" 
                            />
                        </div>
                        <div className="form-group">
                            <label>Profile Picture:</label>
                            <div className="business-logo-field">
                                <input type="file" onChange={handleFileChange} />
                                <button onClick={handleAddTenant}>Add</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="tenant-table">
                    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '20px' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tenant ID</TableCell>
                                        <TableCell>Tenant First Name</TableCell>
                                        <TableCell>Tenant Last Name</TableCell>
                                        <TableCell>Contact Number</TableCell>
                                        <TableCell>Email Address</TableCell>
                                        <TableCell>Profile Picture</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tenants
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((tenant) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={tenant.ten_id}>
                                                <TableCell>{tenant.ten_id}</TableCell>
                                                <TableCell>{tenant.ten_FirstName}</TableCell>
                                                <TableCell>{tenant.ten_LastName}</TableCell>
                                                <TableCell>{tenant.ten_ContactNum}</TableCell>
                                                <TableCell>{tenant.ten_Email}</TableCell>
                                                <TableCell>
                                                    {tenant.ten_ProfilePic ? (
                                                        <img src={tenant.ten_ProfilePic} alt="Profile" style={{ width: '50px' }} />
                                                    ) : (
                                                        'No Image'
                                                    )}
                                                </TableCell>
                                                <TableCell className="actions">
                                                    <button className="edit">
                                                        <IonIcon icon={pencil} className="edit" />
                                                        <a onClick={() => navigate('/edittenant_admin')}>Edit</a>
                                                    </button>
                                                    <button className="delete" onClick={() => handleDeleteTenant(
                                                        tenant.ten_id, 
                                                        tenant.ten_ProfilePic 
                                                            ? new URL(tenant.ten_ProfilePic).pathname.replace('/storage/v1/object/public/tenant-profile-pic/', '') 
                                                            : ''
                                                    )}>
                                                        <IonIcon icon={trash} className="delete" />
                                                        Delete
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={tenants.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </section>
            </div>
        </div>
    );
}

export default TenantA;
