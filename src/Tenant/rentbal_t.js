import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home } from 'ionicons/icons';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';
import '../styles/unitStall_a.css';
import '../styles/HeaderAdmin.css';
import { useDrawer } from '../Admin/drawerContext';
import { supabase } from '../supabaseConnect';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function RentBalT() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer();

    const [anchorEl, setAnchorEl] = useState(null);
    const [tenantName, setTenantName] = useState('');
    const [rentInfo, setRentInfo] = useState([]);

    useEffect(() => {
        const fetchTenantData = async () => {
            try {
                const storedTenantSession = localStorage.getItem('tenantSession');
                let userEmail = null;

                if (storedTenantSession) {
                    const sessionData = JSON.parse(storedTenantSession);
                    userEmail = sessionData?.user?.email;
                } else {
                    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                    if (sessionError || !sessionData?.session) {
                        throw new Error('Session not found. Please log in.');
                    }
                    userEmail = sessionData.session.user.email;
                }

                if (userEmail) {
                    const { data, error } = await supabase
                        .from('TENANT')
                        .select('ten_FirstName, ten_LastName, ten_id')
                        .eq('ten_Email', userEmail)
                        .single();

                    if (error) throw error;

                    // Set tenant name in state
                    const fullName = `${data.ten_FirstName} ${data.ten_LastName}`;
                    setTenantName(fullName);

                    // Fetch rent information based on tenant name
                    fetchRentInformation(fullName);
                }
            } catch (error) {
                console.error('Error fetching tenant data:', error.message);
            }
        };

        const fetchRentInformation = async (fullName) => {
            try {
                const { data: rentData, error: rentError } = await supabase
                    .from('RENT_INFORMATION')
                    .select('stall_name, r_interest, r_contract')
                    .eq('tenant_name', fullName);

                if (rentError) throw rentError;

                setRentInfo(rentData);
            } catch (error) {
                console.error('Error fetching rent information:', error.message);
            }
        };

        fetchTenantData();
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                        <br />
                        <div className="none-pic">
                            <div>
                                <li>
                                    <label style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Tenant Name:</label>
                                    <input
                                        className="adj-input"
                                        placeholder="Tenant Name"
                                        value={tenantName}
                                        size="30"
                                        readOnly
                                        style={{ fontSize: '1.5rem', padding: '10px', fontWeight: 'bold' }}
                                    />
                                </li>
                            </div>

                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="rent balance table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Stall Name</TableCell>
                                        <TableCell>Rent Balance (Interest)</TableCell>
                                        <TableCell>Contract</TableCell>
                                        <TableCell align="center">Contract Options</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rentInfo.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.stall_name}</TableCell>
                                            <TableCell>{row.r_interest}</TableCell>
                                            <TableCell>{row.r_contract}</TableCell>
                                            <TableCell align="center" sx={{ padding: '20px' }}>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => {
                                                        const url = `https://${process.env.REACT_APP_SUPABASE_STORAGE_URL}/storage/v1/object/public/contract-pdfs/${row.r_contract}`;
                                                        window.open(url, '_blank');
                                                    }}
                                                    sx={{
                                                        marginRight: '10px',
                                                        fontSize: '1rem',
                                                        padding: '10px 20px',
                                                        minWidth: '120px',
                                                        textTransform: 'none',
                                                    }}
                                                >
                                                    Download and View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </main>
            </div>
        </IonApp>
    );
}

export default RentBalT;
