import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { archive, home } from 'ionicons/icons';
import { supabase, supabaseAdmin } from '../supabaseConnect';
import { sendWelcomeEmail } from '../Email/EmailService'; 
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
import Header from './header_admin';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useDrawer } from './drawerContext'; 
import { Button } from '@mui/material'; 


function TenantA() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); 

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [tenants, setTenants] = useState([]); 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFileChange = (event) => {
        setProfilePic(event.target.files[0]);
    };

    const generateRandomPassword = (length = 12) => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    };
    
    

    // Add tenant to Supabase Auth and TENANT table
    const handleAddTenant = async () => {
        try {
            const latestTenant = await supabase
                .from('TENANT')
                .select('ten_id')
                .order('ten_id', { ascending: false })
                .limit(1)
                .single();

            let newIdNumber = 1;
            if (latestTenant.data) {
                const latestId = latestTenant.data.ten_id;
                const idNumber = parseInt(latestId.split('-')[2]);
                newIdNumber = idNumber + 1;
            }
            const newTenantId = `TEN-24-${String(newIdNumber).padStart(3, '0')}`;

            const randomPassword = generateRandomPassword(12);

            // Register tenant in Supabase Auth using Admin API
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: email,
                password: randomPassword,
                email_confirm: true, // Bypass confirmation email
                user_metadata: { role: 'tenant' }, // Adding user role
            });

            if (authError) {
                throw new Error(`Authentication Error: ${authError.message}`);
            }

            const tenantUID = authData.user.id; // Get UID from Auth response

            // Upload profile picture if provided
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

            // Insert tenant details into the TENANT table with ten_UID
            const { error: insertError } = await supabase
                .from('TENANT')
                .insert([
                    {
                        ten_id: newTenantId, 
                        ten_FirstName: firstName,
                        ten_LastName: lastName,
                        ten_ContactNum: contactNumber,
                        ten_Email: email,
                        ten_password: randomPassword,
                        ten_UID: tenantUID, 
                        ten_ProfilePic: profilePicUrl,
                    },
                ]);

            if (insertError) {
                throw insertError;
            }

 // Fetch admin details and insert the new entry into the HISTORY table
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
                            Action_Type: `Added a Tenant (${firstName} ${lastName})`,
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

            // Send the welcome email
            await sendWelcomeEmail(email, firstName, randomPassword);

            alert('Tenant added successfully and email sent!');
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
                .select('*')
                .eq('archived',false)

            if (error) {
                throw error;
            }

            setTenants(tenantsData);
        } catch (error) {
            console.error('Error fetching tenants:', error.message);
        }
    };

    const handleRentDueNotification = async (tenant) => {
        try {
            const { error } = await supabase
                .from('MESSAGES')
                .insert([
                    {
                        sender: 'epicenteradmin@gmail.com',
                        receiver: tenant.ten_Email, // use the correct column name here
                        subject: 'Rent Due Notification',
                        message_body: `Dear ${tenant.ten_FirstName}, your rent is due today. Please make the payment at your earliest convenience.`,
                    },
                ]);
            if (error) {
                throw error;
            }
            alert('Rent due notification sent successfully!');
        } catch (error) {
            console.error('Error sending rent due notification:', error.message);
            alert('Failed to send rent due notification. Please try again.');
        }
    };    

    const handleUpcomingRentNotification = async (tenant) => {
        try {
            const today = new Date();
            const rentStartDate = new Date(tenant.rent_start);
            const nextRentDueDate = new Date(rentStartDate);
            nextRentDueDate.setMonth(rentStartDate.getMonth() + 1);

            const daysUntilDue = Math.ceil((nextRentDueDate - today) / (1000 * 60 * 60 * 24));

            const { error } = await supabase
                .from('MESSAGES')
                .insert([
                    {
                        sender: 'epicenteradmin@gmail.com',
                        receiver: tenant.ten_Email,
                        subject: 'Upcoming Rent Notification',
                        message_body: `Dear ${tenant.ten_FirstName}, your rent is due in ${daysUntilDue} days. Please be prepared to make the payment.`,
                    },
                ]);
            if (error) {
                throw error;
            }
            alert('Upcoming rent notification sent successfully!');
        } catch (error) {
            console.error('Error sending upcoming rent notification:', error.message);
            alert('Failed to send upcoming rent notification. Please try again.');
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
            <MiniDrawer isOpen={isOpen} onDrawerToggle={toggleDrawer} />
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
                <div className="Title">Add Tenant</div>
                <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem' }}>
                    <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link"sx={{ fontSize: '1.5rem' }}>
                        <IonIcon icon={home} className="breadcrumb-icon" />
                        <span>Home</span>
                    </Link>
                    <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link"sx={{ fontSize: '1.5rem' }}>
                        Tenants
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
                                
                            </div>
                        </div>
                        <Button color="success" variant="contained" onClick={handleAddTenant}>Add</Button>
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
                                    {tenants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tenant) => (
                                        <TableRow key={tenant.ten_id}>
                                            <TableCell>{tenant.ten_id}</TableCell>
                                            <TableCell>{tenant.ten_FirstName}</TableCell>
                                            <TableCell>{tenant.ten_LastName}</TableCell>
                                            <TableCell>{tenant.ten_ContactNum}</TableCell>
                                            <TableCell>{tenant.ten_Email}</TableCell>
                                            <TableCell>
                                                {tenant.ten_ProfilePic ? (
                                                    <img src={tenant.ten_ProfilePic} alt="Profile" width={50} />
                                                ) : (
                                                    'No Image'
                                                )}
                                            </TableCell>
                                            <TableCell>

                                            <div className="action-buttons">

                                            <Button 
                                                className="delete-btn" 
                                                onClick={() => navigate(`/edittenant_admin/${tenant.ten_id}`)}
                                                style={{
                                                    backgroundColor: '#FF0000', // Red color
                                                    color: '#FFF', // White text
                                                    border: 'none',
                                                    padding: '8px 16px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                }}
                                                >
                                                <IonIcon icon={archive} className="edit" />
                                                <span>Archive</span>
                                            </Button>

                                            <Button 
                                                color="primary" 
                                                variant="contained" 
                                                onClick={() => handleRentDueNotification(tenant)}
                                                sx={{ marginLeft: '10px' }}
                                            >
                                                Rent Due Sim
                                            </Button>

                                            <Button 
                                                color="secondary" 
                                                variant="contained" 
                                                onClick={() => handleUpcomingRentNotification(tenant)}
                                                sx={{ marginLeft: '10px' }}
                                            >
                                                Upcoming Rent Sim
                                            </Button>
                                                                                             
                                           </div>
                                                
                                                
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
            </main>
        </div>
    );
}

export default TenantA;
