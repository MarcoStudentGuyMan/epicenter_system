import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react'; 
import { useNavigate } from 'react-router-dom';
import { home } from 'ionicons/icons';
import '../styles/dashboardA.css';  
import '../styles/HeaderAdmin.css';
import MiniDrawer from './drawer_admin';
import Header from './header_admin';
import { useDrawer } from './drawerContext';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import { Input, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function RentBalA() {
    // State and navigation hooks
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer();

    const [data, setData] = useState([]);
    const [principal, setPrincipal] = useState("");
    const [contract, setContract] = useState(null);
    const [stallId, setStallId] = useState("");
    const [stalls, setStalls] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        // Fetch stalls when the component mounts
        const fetchStalls = async () => {
            try {
                const { data, error } = await supabase
                    .from('STALL') // Ensure this matches your Supabase table name exactly
                    .select('stall_id, s_bus_name, ten_id');
        
                if (error) {
                    throw error;
                }
                if (data) {
                    console.log('Fetched Stalls:', data); // Debug log to check fetched data
                    setStalls(data);
                }
            } catch (error) {
                console.error('Error fetching stalls:', error);
            }
        };
    
        fetchStalls(); // Call the function
        fetchRentData();
    }, []);

    // Fetch rent data from Supabase
    const fetchRentData = async () => {
        try {
            const { data, error } = await supabase
                .from('RENT_INFORMATION')
                .select('*');
            if (error) {
                throw error;
            }
            if (data) {
                setData(data);
            }
        } catch (error) {
            console.error('Error fetching rent data:', error);
        }
    };
    
    // Function to handle adding rent balance
    // Function to handle adding rent balance
const handleAdd = async () => {
    if (!principal || !stallId) {
        setNotification({ open: true, message: 'Principal or Stall ID is missing.', severity: 'error' });
        return;
    }

    const rentInterest = principal * 1.05;

    // Find the selected stall details
    const selectedStall = stalls.find(stall => stall.stall_id === stallId);

    if (!selectedStall) {
        setNotification({ open: true, message: 'No stall selected or stall not found.', severity: 'error' });
        return;
    }

    // Fetch tenant name from TENANT table using ten_id
    let tenantName = '';
    try {
        const { data: tenantData, error } = await supabase
            .from('TENANT')
            .select('ten_FirstName, ten_LastName')
            .eq('ten_id', selectedStall.ten_id)
            .single();
        if (error) {
            throw error;
        }
        if (tenantData) {
            tenantName = `${tenantData.ten_FirstName} ${tenantData.ten_LastName}`;
        }
    } catch (error) {
        console.error('Error fetching tenant name:', error);
        setNotification({ open: true, message: 'Error fetching tenant name.', severity: 'error' });
        return;
    }

    // Check for duplicate entry
    const duplicate = data.some(row => row.stall_id === stallId && row.r_principal === principal);
    if (duplicate) {
        setNotification({ open: true, message: 'Duplicate entry detected.', severity: 'warning' });
        return;
    }

    // Create the new row to insert, ensuring field names match your Supabase table
    const newRow = {
        ten_id: selectedStall.ten_id,
        tenant_name: tenantName,  // Ensure tenant_name matches the column name in RENT_INFORMATION table
        stall_name: selectedStall.s_bus_name, // Make sure the column name matches the database
        r_principal: principal,
        r_interest: rentInterest,
        r_status: "Unpaid",
        r_contract: contract ? contract.name : "",
        r_date: new Date().toISOString(),
        stall_id: stallId,
    };

    try {
        // Insert the new rent information into the table
        const { data: newData, error } = await supabase
            .from('RENT_INFORMATION') // Ensure this matches your Supabase table name
            .insert([newRow]);

        if (error) {
            throw error;
        }
        if (newData) {
            setData(prevData => [...prevData, newData[0]]);
            setNotification({ open: true, message: 'Rent information added successfully.', severity: 'success' });
        }
    } catch (error) {
        console.error('Error inserting new rent information:', error);
        setNotification({ open: true, message: 'Error inserting new rent information.', severity: 'error' });
    }
};

    
    // Function to mark rent as paid
    const handleMarkAsPaid = async (index) => {
        const updatedData = [...data];
        const selectedRow = updatedData[index];

        if (!selectedRow) {
            console.error('Selected row not found.');
            return;
        }

        selectedRow.r_status = "Paid";
        selectedRow.r_date = new Date().toISOString();

        try {
            const { error } = await supabase
                .from('RENT_INFORMATION')
                .update({ r_status: "Paid", r_date: new Date().toISOString() })
                .eq('rent_auto_id', selectedRow.rent_auto_id);
    
            if (error) {
                throw error;
            }
            setData(updatedData);
            setNotification({ open: true, message: 'Rent marked as paid.', severity: 'success' });
        } catch (error) {
            console.error('Error updating rent status:', error);
            setNotification({ open: true, message: 'Error updating rent status.', severity: 'error' });
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleNotificationClose = () => {
        setNotification({ ...notification, open: false });
    };

    // Table columns
    const columns = [
        { label: 'Tenant Name', minWidth: 100, field: 'tenant_name' },
        { label: 'Stall Name', minWidth: 100, field: 'stall_name' },
        { label: 'Rent Interest (Total)', minWidth: 100, field: 'r_interest' },
        { label: 'Principal', minWidth: 100, field: 'r_principal' },
        { label: 'Rent Status', minWidth: 100, field: 'r_status' },
        { label: 'Timestamp', minWidth: 100, field: 'r_date' },
        { label: 'Contract', minWidth: 100, field: 'r_contract' },
        { label: 'Actions', minWidth: 100 },
    ];

    return (
        <IonApp>
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
                        marginLeft: isOpen ? 240 : 60,
                        transition: 'margin-left 0.3s',
                    }}
                >
                    <div className="Title">
                        Managing Rent Balance
                    </div>

                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem' }} >
                        <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
                            <IonIcon icon={home} className="breadcrumb-icon" />
                            <span>Home</span>
                        </Link>
                        <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
                            Rent Balance
                        </Link>
                    </Breadcrumbs>

                    <div className="stall-form">
                        <div className="form-group">
                            <label>Principal:</label>
                            <input
                                placeholder="Enter Principal"
                                value={principal}
                                onChange={(e) => setPrincipal(e.target.value)}
                                type="number"
                                style={{ backgroundColor: '#ffffff', paddingBottom: '20px',paddingTop: '20px' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Stall:</label>
                            <Select
                                value={stallId}
                                onChange={(e) => setStallId(e.target.value)}
                                displayEmpty
                                style={{ backgroundColor: '#ffffff', marginTop: '10px',paddingBottom: '5px' }}

                            >
                                <MenuItem value="" disabled>Select Stall</MenuItem>
                                {stalls.map(stall => (
                                    <MenuItem key={stall.stall_id} value={stall.stall_id}>{stall.s_bus_name}</MenuItem>
                                ))}
                            </Select>

                        </div>


                        <div className="form-group">
                            <label>Contract:</label>
                            <input
                                type="file"
                                onChange={(e) => setContract(e.target.files[0])}
                                accept="application/pdf"
                            
                            />
                        </div>

                       
                        <Button color="success" variant="contained" onClick={handleAdd}>Add</Button>
                    </div>

                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.label}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                {columns.map((column) => {
                                                    const value = row[column.field];
                                                    return (
                                                        <TableCell key={column.label}>
                                                            {column.label === 'Rent Status' ? (
                                                                <Button
                                                                    color={row.r_status === 'Paid' ? "secondary" : "primary"}
                                                                    variant="contained"
                                                                    onClick={() => handleMarkAsPaid(index)}
                                                                >
                                                                    {row.r_status === 'Paid' ? 'Paid' : 'Mark as Paid'}
                                                                </Button>
                                                            ) : column.label === 'Actions' ? (
                                                                <Button
                                                                    color="warning"
                                                                    variant="contained"
                                                                >
                                                                    Edit
                                                                </Button>
                                                            ) : (
                                                                value || '-'
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </main>
            </div>
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleNotificationClose}>
                <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </IonApp>
    );
}

export default RentBalA;
