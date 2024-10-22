import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react'; 
import { useNavigate } from 'react-router-dom';
import { home } from 'ionicons/icons';
import '../styles/dashboardA.css';  
import '../styles/HeaderAdmin.css';
import MiniDrawer from './drawer_admin';
import Header from './header_admin';
import { useDrawer } from './drawerContext'; 
import { Button, Snackbar, Alert, Input, Select, MenuItem } from '@mui/material';
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
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function RentAutoA() {
    const [data, setData] = useState([]);
    const [compoundYear, setCompoundYear] = useState('');
    const [interest, setInterest] = useState('');
    const [yearsOfStay, setYearsOfStay] = useState('');
    const [stallName, setStallName] = useState('');
    const [stalls, setStalls] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);
    const [editingRow, setEditingRow] = useState(null);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer();

    useEffect(() => {
        fetchStalls();
        fetchRentAutomationData();
    }, []);

    // Fetch stalls from Supabase
    const fetchStalls = async () => {
        try {
            // Fetch stall names from RENT_INFORMATION
            const { data: rentInfoData, error } = await supabase
                .from('RENT_INFORMATION')
                .select('stall_name');
            if (error) throw error;

            // Remove duplicate stall names, if any
            const uniqueStalls = Array.from(new Set(rentInfoData.map(item => item.stall_name)));

            // Fetch stall names already in RENT_AUTOMATION
            const { data: rentAutomationData, error: rentAutomationError } = await supabase
                .from('RENT_AUTOMATION')
                .select('stall_name');
            if (rentAutomationError) throw rentAutomationError;

            const rentAutomationStalls = new Set(rentAutomationData.map(item => item.stall_name));

            // Filter out stalls that are already in RENT_AUTOMATION
            const availableStalls = uniqueStalls.filter(stall => !rentAutomationStalls.has(stall));

            // Update the `stalls` state
            setStalls(availableStalls);
        } catch (error) {
            console.error('Error fetching stalls:', error);
        }
    };

    // Fetch rent automation data from Supabase
    const fetchRentAutomationData = async () => {
        try {
            const { data, error } = await supabase
                .from('RENT_AUTOMATION')
                .select('*');
            if (error) throw error;
            setData(data.sort((a, b) => a.stall_name.localeCompare(b.stall_name)));
        } catch (error) {
            console.error('Error fetching rent automation data:', error);
        }
    };

    // Function to handle adding rent automation data
    const handleAdd = async () => {
        if (compoundYear === '' || interest === '' || yearsOfStay === '' || stallName === '') {
            setNotification({ open: true, message: 'All fields are required.', severity: 'error' });
            return;
        }

        setLoading(true);

        const compoundYearValue = parseFloat(compoundYear);
        const interestValue = parseInt(interest, 10);
        const yearsPassedValue = parseFloat(yearsOfStay);

        if (isNaN(interestValue) || interestValue < 1 || interestValue > 100) {
            setNotification({ open: true, message: 'Interest must be a number between 1 and 100.', severity: 'error' });
            setLoading(false);
            return;
        }

        if (isNaN(compoundYearValue) || isNaN(yearsPassedValue)) {
            setNotification({ open: true, message: 'Invalid values for Compound Year or Years of Stay.', severity: 'error' });
            setLoading(false);
            return;
        }

        let principalValue = null;

        // Fetch the principal from RENT_INFORMATION where stall_name matches the selected stall
        try {
            const { data: rentData, error } = await supabase
                .from('RENT_INFORMATION')
                .select('r_principal, rent_id')
                .eq('stall_name', stallName)
                .single();

            if (error) {
                throw error;
            }

            if (rentData) {
                principalValue = rentData.r_principal;
            } else {
                setNotification({ open: true, message: 'No matching principal found for the selected stall.', severity: 'warning' });
                setLoading(false);
                return;
            }
        } catch (error) {
            console.error('Error fetching principal:', error);
            setNotification({ open: true, message: 'Error fetching principal.', severity: 'error' });
            setLoading(false);
            return;
        }

        // Calculate the number of times the interest is compounded
        const timesCompounded = Math.floor(yearsPassedValue / compoundYearValue);

        // Calculate the interest amount using compound interest formula
        let interestAmount = principalValue * Math.pow((1 + (interestValue / 100)), timesCompounded);
        interestAmount = Math.round(interestAmount); // Round to nearest integer

        // Construct the new rent automation row
        const newRow = {
            stall_name: stallName,
            compound_years: compoundYearValue,
            years_passed: yearsPassedValue,
            auto_interest: interestValue,
            interest_amount: interestAmount,
            auto_date: new Date().toISOString(),
            r_principal: principalValue,
        };

        try {
            const { data: newData, error } = await supabase
                .from('RENT_AUTOMATION')
                .insert([newRow]);

            if (error) {
                throw error;
            }

            if (newData) {
                // Update the state to include the new data
                setData((prevData) => [...prevData, ...newData].sort((a, b) => a.stall_name.localeCompare(b.stall_name)));

                // Update the corresponding r_interest in RENT_INFORMATION
                const { error: updateError } = await supabase
                    .from('RENT_INFORMATION')
                    .update({ r_interest: interestAmount })
                    .eq('stall_name', stallName);

                if (updateError) {
                    throw updateError;
                }

                // Set success notification
                setNotification({ open: true, message: 'Rent automation data added successfully and interest updated.', severity: 'success' });

                console.log('Successful addition:', newData); // Log for debugging
            }
        } catch (error) {
            console.error('Error adding rent automation data:', error);
            setNotification({ open: true, message: 'Error adding rent automation data.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Function to manually update RENT_INFORMATION table's r_interest
    const handleUpdateRentInformation = async () => {
        try {
            for (const row of data) {
                const { stall_name, interest_amount } = row;
                const { error } = await supabase
                    .from('RENT_INFORMATION')
                    .update({ r_interest: interest_amount })
                    .eq('stall_name', stall_name);

                if (error) {
                    throw error;
                }
            }
            setNotification({ open: true, message: 'Rent information updated successfully.', severity: 'success' });
        } catch (error) {
            console.error('Error updating rent information:', error);
            setNotification({ open: true, message: 'Error updating rent information.', severity: 'error' });
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

    // Function to handle editing a row
    const handleEdit = (index) => {
        if (editingRow === index) {
            handleSaveEdit(index);
        } else {
            setEditingRow(index);
        }
    };

    const handleCancelEdit = () => {
        setEditingRow(null); // Reset editingRow to exit edit mode
      };
      

    // Function to save edits
    const handleSaveEdit = async (index) => {
        const updatedRow = data[index];
        setLoading(true);
        try {
            // Update the row in RENT_AUTOMATION table
            const { error } = await supabase
                .from('RENT_AUTOMATION')
                .update({
                    compound_years: updatedRow.compound_years,
                    years_passed: updatedRow.years_passed,
                    auto_interest: updatedRow.auto_interest,
                    interest_amount: Math.round(updatedRow.r_principal * Math.pow((1 + (updatedRow.auto_interest / 100)), Math.floor(updatedRow.years_passed / updatedRow.compound_years))),
                })
                .eq('rent_auto_id', updatedRow.rent_auto_id);

            if (error) {
                throw error;
            }

            setNotification({ open: true, message: 'Rent automation data updated successfully.', severity: 'success' });
            setEditingRow(null);
            fetchRentAutomationData();
        } catch (error) {
            console.error('Error saving changes:', error);
            setNotification({ open: true, message: 'Error saving changes.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (index, field, value) => {
        const updatedData = [...data];
        updatedData[index][field] = value;
        setData(updatedData);
    };

    // Table columns excluding Auto ID and Rent ID
    const columns = [
        { id: 'stall_name', label: 'Stall Name', minWidth: 100 },
        { id: 'r_principal', label: 'Principal', minWidth: 100 },
        { id: 'auto_interest', label: 'Interest (%)', minWidth: 100 },
        { id: 'interest_amount', label: 'Interest Amount', minWidth: 100 },
        { id: 'years_passed', label: 'Years of Stay', minWidth: 100 },
        { id: 'compound_years', label: 'Compound Years', minWidth: 100 },
        { id: 'auto_date', label: 'Date', minWidth: 100 },
        { id: 'actions', label: 'Actions', minWidth: 150 },
    ];    

    return (
        <IonApp>
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
                        marginLeft: isOpen ? 240 : 60,
                        transition: 'margin-left 0.3s',
                    }}
                >
                    <div className="Title">
                        Managing Rent Automation
                    </div>

                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem' }}>
                        <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
                            <IonIcon icon={home} className="breadcrumb-icon" />
                            <span>Home</span>
                        </Link>
                        <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
                            Rent Automation
                        </Link>
                    </Breadcrumbs>

                    <div className="stall-form">
                        <div className="form-group">
                            <label>Compound Year:</label>
                            <input
                                placeholder="Enter Compound Year"
                                value={compoundYear}
                                onChange={(e) => setCompoundYear(e.target.value)}
                                type="number"
                            />
                        </div>

                        <div className="form-group">
                            <label>Interest (%):</label>
                            <input
                                type="number"
                                placeholder="Enter Interest"
                                value={interest}
                                onChange={(e) => setInterest(e.target.value)}
                                min="1"
                                max="100"
                            />
                        </div>

                        <div className="form-group">
                            <label>Years of Stay:</label>
                            <input
                                type="number"
                                placeholder="Enter Years of Stay"
                                value={yearsOfStay}
                                onChange={(e) => setYearsOfStay(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Select Stall:</label>
                            <select
                                value={stallName}
                                onChange={(e) => setStallName(e.target.value)}
                            >
                                <option value="" disabled>Select Stall</option>
                                {stalls.map((stall, index) => (
                                    <option key={index} value={stall}>
                                        {stall}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button color="success" variant="contained" onClick={handleAdd} disabled={loading}>
                            {loading ? 'Loading...' : 'Add'}
                        </Button>
                    </div>

                    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }} key={data.length}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
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
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.rent_auto_id || index}>
                                                {columns.map((column) => {
                                                    let value = row[column.id];
                                                    if (column.id === 'auto_date') {
                                                        // Convert the UTC date to Philippine Standard Time (UTC+8)
                                                        const date = new Date(value);
                                                        // Adjust the date to Asia/Manila and format it
                                                        const options = {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true,
                                                            timeZone: 'Asia/Manila',
                                                        };
                                                        value = new Intl.DateTimeFormat('en-US', options).format(date);
                                                    }
                                                    if (column.id === 'actions') {
                                                        return (
                                                            <TableCell key={column.id}>
                                                            <div
                                                              style={{
                                                                display: 'flex',
                                                                flexDirection: 'column', // Stack buttons vertically
                                                                gap: '10px', // Space between buttons
                                                                alignItems: 'center', // Center the buttons horizontally
                                                              }}
                                                            >
                                                              <Button
                                                                color="info"
                                                                variant="contained"
                                                                onClick={() => handleEdit(index)}
                                                                sx={{
                                                                  fontSize: '1rem',
                                                                  padding: '10px 20px',
                                                                  minWidth: '120px',
                                                                  textTransform: 'none',
                                                                }}
                                                              >
                                                                {editingRow === index ? 'Save' : 'Edit'}
                                                              </Button>
                                                          
                                                              {editingRow === index && (
                                                                <Button
                                                                  color="error"
                                                                  variant="contained"
                                                                  onClick={() => handleCancelEdit()}
                                                                  sx={{
                                                                    fontSize: '1rem',
                                                                    padding: '10px 20px',
                                                                    minWidth: '120px',
                                                                    textTransform: 'none',
                                                                  }}
                                                                >
                                                                  Cancel
                                                                </Button>
                                                              )}
                                                            </div>
                                                          </TableCell>
                                                          
                                                          
                                                        );
                                                    }
                                                    return (
                                                        <TableCell key={column.id}>
                                                            {value !== null && value !== undefined ? (
                                                                editingRow === index && column.id !== 'stall_name' && column.id !== 'auto_date' && column.id !== 'interest_amount' && column.id !== 'r_principal' ? (
                                                                    <Input
                                                                        value={value}
                                                                        onChange={(e) => handleInputChange(index, column.id, e.target.value)}
                                                                    />
                                                                ) : (
                                                                    value
                                                                )
                                                            ) : '-'}
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

                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleUpdateRentInformation}
                        sx={{
                            marginTop: 2,
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '25px', // Set margin-bottom to 25px
                        }}
                        >
                        Update Rent Information
                    </Button>

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

export default RentAutoA;
