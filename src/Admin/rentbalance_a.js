import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react'; 
import { useNavigate } from 'react-router-dom';
import { home } from 'ionicons/icons';
import '../styles/dashboardA.css';  
import '../styles/HeaderAdmin.css';
import MiniDrawer from './drawer_admin';
import Header from './header_admin';
import { useDrawer } from './drawerContext';
import { createClient } from '@supabase/supabase-js';
import { Breadcrumbs, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button, Snackbar, Alert, Input, Select, MenuItem, Box, Modal } from '@mui/material';
import { addMonths, format } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { differenceInMonths, isSameMonth } from 'date-fns';


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
    const [stalls, setStalls] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [selectedStall, setSelectedStall] = useState('');
    const [simulatedDate, setSimulatedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    const [rentStart, setRentStart] = useState(null);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const formatTimestamp = (timestamp) => {
        const timezone = 'Asia/Manila';
        return formatInTimeZone(timestamp, timezone, 'MMMM dd, yyyy hh:mm a');
    };    

    useEffect(() => {
        // Fetch stalls when the component mounts
        const fetchStalls = async () => {
            try {
                // Step 1: Fetch all stall names already in RENT_INFORMATION
                const { data: rentBalanceData, error: rentBalanceError } = await supabase
                    .from('RENT_INFORMATION')
                    .select('stall_name');
    
                if (rentBalanceError) {
                    throw rentBalanceError;
                }
    
                const rentedStallNames = rentBalanceData ? rentBalanceData.map(rent => rent.stall_name) : [];
    
                // Step 2: Fetch all stalls from STALL
                const { data: stallsData, error: stallsError } = await supabase
                    .from('STALL')
                    .select('stall_id, s_bus_name, stall_unit_name, ten_id');
    
                if (stallsError) {
                    throw stallsError;
                }
    
                // Step 3: Filter stalls - exclude those already present in RENT_INFORMATION
                const availableStalls = stallsData.filter(stall => !rentedStallNames.includes(stall.s_bus_name));
    
                if (availableStalls) {
                    setStalls(availableStalls);
                }
            } catch (error) {
                console.error('Error fetching stalls:', error);
            }
        };
    
        fetchStalls();
        fetchRentData();
    
        // Set up real-time subscription to RENT_INFORMATION table
        const channel = supabase
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'RENT_INFORMATION',
                },
                (payload) => {
                    console.log('Change received!', payload);
                    fetchRentData(); // Re-fetch data whenever there is an update
                }
            )
            .subscribe();
    
        // Cleanup the subscription on component unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);
    

    // Fetch rent data from Supabase
    const fetchRentData = async () => {
        setLoading(true);
        try {
            const { data: rentData, error: rentError } = await supabase
                .from('RENT_INFORMATION')
                .select('*');
            if (rentError) {
                throw rentError;
            }
            if (rentData) {
                setData(rentData);
            }
        } catch (error) {
            console.error('Error fetching rent data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to upload contract to Supabase storage
    const uploadContract = async (file) => {
        if (!file) return null;
        const fileName = `${Date.now()}_${file.name}`;
        try {
            const { data, error } = await supabase.storage
                .from('contract-pdfs')
                .upload(fileName, file);
            if (error) {
                throw error;
            }
            return data.path; // Return the path to the uploaded file
        } catch (error) {
            console.error('Error uploading contract:', error);
            setNotification({ open: true, message: 'Error uploading contract.', severity: 'error' });
            return null;
        }
    };

    // Function to handle editing a row
    const handleEdit = async (index) => {
        if (editingRow === index) {
            // If currently editing, save changes
            handleSaveEdit(index);
        } else {
            // Set the row as editable and fetch principal based on stall name
            const updatedRow = { ...data[index] }; // Use spread to avoid directly mutating state
    
            try {
                // Find the stall data from the stalls array using the stall_name
                const selectedStallData = stalls.find(stall => stall.s_bus_name === updatedRow.stall_name);
    
                if (selectedStallData) {
                    // Fetch stall unit price from STALL_UNIT table
                    const { data: stallUnitData, error: stallUnitError } = await supabase
                        .from('STALL_UNIT')
                        .select('stall_unit_price')
                        .eq('stall_unit_name', selectedStallData.stall_unit_name)
                        .single(); // Fetch single entry that matches the stall unit name
    
                    if (stallUnitError) {
                        throw stallUnitError;
                    }
    
                    if (stallUnitData) {
                        // Update the principal value with fetched stall unit price
                        updatedRow.r_principal = stallUnitData.stall_unit_price;
                    }
                }
            } catch (error) {
                console.error('Error fetching stall unit price for edit:', error);
                setNotification({ open: true, message: 'Error fetching stall unit price.', severity: 'error' });
            }
    
            // Update data state with the modified row and set the current row as editable
            const updatedData = [...data];
            updatedData[index] = updatedRow;
            setData(updatedData);
    
            setEditingRow(index);
        }
    };
    
    

    // Function to save edits
    const handleSaveEdit = async (index) => {
        const updatedRow = data[index];
        setLoading(true);
        try {
            // Upload the contract if it was changed
            let contractPath = updatedRow.r_contract;
            if (typeof updatedRow.r_contract === 'object') {
                contractPath = await uploadContract(updatedRow.r_contract);
            }
    
            // Fetch tenant name from TENANT table using ten_id
            const selectedStallData = stalls.find(stall => stall.s_bus_name === updatedRow.stall_name);
            let tenantName = updatedRow.tenant_name; // Retain the existing tenant name
            let tenantEmail = updatedRow.tenant_email; // Retain the existing tenant email

            if (selectedStallData) {
                try {
                    const { data: tenantData, error: tenantError } = await supabase
                        .from('TENANT')
                        .select('ten_FirstName, ten_LastName, ten_Email') // Include tenant email in the selection
                        .eq('ten_id', selectedStallData.ten_id)
                        .single();
                    if (tenantError) {
                        throw tenantError;
                    }
                    if (tenantData) {
                        tenantName = `${tenantData.ten_FirstName} ${tenantData.ten_LastName}`;
                        tenantEmail = tenantData.ten_Email; // Store the tenant email
                    }
                } catch (error) {
                    console.error('Error fetching tenant details:', error);
                    setNotification({ open: true, message: 'Error fetching tenant details.', severity: 'error' });
                    setLoading(false);
                    return;
                }
            }
    
            // Set rentInterest to null
            const rentInterest = null;
    
            // Set the timestamp to Asia/Manila timezone before storing
            const now = new Date();
            const timezone = 'Asia/Manila';
            const zonedDate = toZonedTime(now, timezone);
    
            const { error } = await supabase
                .from('RENT_INFORMATION')
                .update({
                    r_principal: updatedRow.r_principal,
                    r_contract: contractPath,
                    stall_name: updatedRow.stall_name,
                    tenant_name: tenantName,
                    tenant_email: tenantEmail, // Add tenant email here
                    r_interest: rentInterest,
                    r_date: zonedDate.toISOString(),
                    rent_start: updatedRow.rent_start, // Include rent start date in the update
                })
                .eq('rent_id', updatedRow.rent_id);

            if (error) {
                throw error;
            }
    
            setNotification({ open: true, message: 'Rent information updated successfully.', severity: 'success' });
            setEditingRow(null); // Exit edit mode
        } catch (error) {
            console.error('Error saving changes:', error);
            setNotification({ open: true, message: 'Error saving changes.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };    

    // Function to handle input changes during edit
    // Modify handleInputChange to include fetching principal
    const handleInputChange = async (index, field, value) => {
        const updatedData = [...data];
    
        if (field === 'stall_name') {
            // Update stall name
            updatedData[index][field] = value;
    
            try {
                // Step 1: Fetch stall details from the STALL table
                const { data: stallData, error: stallError } = await supabase
                    .from('STALL')
                    .select('stall_unit_name')
                    .eq('s_bus_name', value)
                    .single();

    
                if (stallError) {
                    throw stallError;
                }
    
                if (!stallData) {
                    console.error('No matching stall found.');
                    setNotification({ open: true, message: 'No matching stall found.', severity: 'error' });
                    return;
                }
    
                // Extract stall_unit_name from STALL table
                const { stall_unit_name } = stallData;
    
                // Step 2: Fetch the stall price from the STALL_UNIT table
                const { data: unitData, error: unitError } = await supabase
                    .from('STALL_UNIT')
                    .select('stall_unit_price')
                    .eq('stall_unit_name', stall_unit_name)
                    .single(); // Assuming there's only one row per unit name
    
                if (unitError) {
                    throw unitError;
                }
    
                if (unitData) {
                    // Update the principal field with the fetched stall price
                    updatedData[index]['r_principal'] = unitData.stall_unit_price;
                } else {
                    console.error('No matching stall unit found.');
                    setNotification({ open: true, message: 'No matching stall unit found.', severity: 'error' });
                }
            } catch (error) {
                console.error('Error fetching stall unit price:', error);
                setNotification({ open: true, message: 'Error fetching stall unit price.', severity: 'error' });
            }
        } else if (field === 'r_contract') {
            updatedData[index][field] = value ? value : updatedData[index][field];
        } else {
            updatedData[index][field] = value;
        }
    
        // Update the state with new values
        setData(updatedData);
    };    


    // Function to simulate a new month
    const simulateNewMonth = async () => {
        const newSimulatedDate = addMonths(simulatedDate, 1);
        setSimulatedDate(newSimulatedDate);
    
        try {
            // Iterate over all rent rows and simulate a new month
            const updatedDataPromises = data.map(async (row) => {
                const currentDueDate = new Date(row.next_due_rent_date);
    
                // Set r_status to false if the simulated date is past the current next_due_rent_date
                let newStatus = row.r_status;
                if (newSimulatedDate >= currentDueDate) {
                    newStatus = false; // Allow rent to be marked as unpaid for the next month
                }
    
                // Update the RENT_INFORMATION table only for the r_status if necessary
                if (newStatus !== row.r_status) {
                    const { error: updateError } = await supabase
                        .from('RENT_INFORMATION')
                        .update({
                            r_status: newStatus,
                        })
                        .eq('rent_id', row.rent_id);
    
                    if (updateError) {
                        throw updateError;
                    }
                }
    
                return {
                    ...row,
                    r_status: newStatus,
                };
            });
    
            // Wait for all promises to resolve and update state
            const updatedData = await Promise.all(updatedDataPromises);
            setData(updatedData);
    
            setNotification({
                open: true,
                message: `Simulated month is now ${format(newSimulatedDate, 'MMMM yyyy')}`,
                severity: 'info',
            });
        } catch (error) {
            console.error('Error during month simulation:', error);
            setNotification({
                open: true,
                message: 'Error simulating new month. Please try again.',
                severity: 'error',
            });
        }
    };     
      

    // Function to handle adding rent balance
    const handleAdd = async () => {
        if (!principal || !selectedStall || !rentStart) {
            setNotification({ open: true, message: 'Principal, Stall, or Rent Start Date is missing.', severity: 'error' });
            return;
        }
    
        setLoading(true);
    
        const rentInterest = null; // Set initial rent interest to null
    
        // Find the selected stall details
        const selectedStallData = stalls.find(stall => stall.s_bus_name === selectedStall);
    
        if (!selectedStallData) {
            setNotification({ open: true, message: 'No stall selected or stall not found.', severity: 'error' });
            setLoading(false);
            return;
        }
    
        // Fetch tenant name from TENANT table using ten_id
        let tenantName = '';
        let tenantEmail = ''; // Add a variable to store tenant email
    
        try {
            const { data: tenantData, error: tenantError } = await supabase
                .from('TENANT')
                .select('ten_FirstName, ten_LastName, ten_Email') // Include tenant email in the selection
                .eq('ten_id', selectedStallData.ten_id)
                .single();
            if (tenantError) {
                throw tenantError;
            }
            if (tenantData) {
                tenantName = `${tenantData.ten_FirstName} ${tenantData.ten_LastName}`;
                tenantEmail = tenantData.ten_Email; // Store the tenant email
            }
        } catch (error) {
            console.error('Error fetching tenant details:', error);
            setNotification({ open: true, message: 'Error fetching tenant details.', severity: 'error' });
            setLoading(false);
            return;
        }
    
        // Upload the contract file
        let contractPath = "";
        if (contract) {
            contractPath = await uploadContract(contract);
            if (!contractPath) {
                setLoading(false);
                return;
            }
        }
    
        // Create the new row to insert, ensuring field names match your Supabase table
        const newRow = {
            ten_id: selectedStallData.ten_id,
            tenant_name: tenantName,
            tenant_email: tenantEmail, // Add tenant email here
            stall_id: selectedStallData.stall_id,
            stall_name: selectedStallData.s_bus_name,
            r_principal: principal,
            r_interest: rentInterest,
            r_status: false,
            r_contract: contractPath,
            r_date: new Date().toISOString(),
            rent_start: rentStart, // New rent start date field
            next_due_rent_date: rentStart, // Set next_due_rent_date to the same value as rent_start
        };
    
        try {
            const { data: newData, error: insertError } = await supabase
                .from('RENT_INFORMATION')
                .insert([newRow]);
    
            if (insertError) {
                throw insertError;
            }
    
            if (newData) {
                setNotification({ open: true, message: 'Rent information added successfully.', severity: 'success' });
                fetchRentData(); // Refresh data to include new row
            }
        } catch (error) {
            console.error('Error inserting new rent information:', error);
            setNotification({ open: true, message: 'Error inserting new rent information.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };
    

    // Function to mark rent as paid and add a log entry
    const handleMarkAsPaid = async (index) => {
        const selectedRow = data[index];
        if (!selectedRow) {
            console.error('Selected row not found.');
            setNotification({
                open: true,
                message: 'Selected row not found.',
                severity: 'error',
            });
            return;
        }
    
        const tenantEmail = selectedRow.tenant_email;
        const tenantName = selectedRow.tenant_name;
        const rentStartDate = new Date(selectedRow.rent_start);
        const now = new Date();
        const simulatedMonthStart = new Date(simulatedDate);
    
        // Check if dates are valid before proceeding
        if (isNaN(rentStartDate.getTime())) {
            console.error('Invalid rent start date.');
            setNotification({
                open: true,
                message: 'Invalid rent start date. Please check the data.',
                severity: 'error',
            });
            return;
        }
    
        try {
            // Step 1: Automatically mark all previous months until the current simulated month as paid
            const monthsToMark = [];
            let monthToCheck = rentStartDate;
    
            // Mark months from rent start to simulated month
            while (monthToCheck < simulatedMonthStart) {
                monthsToMark.push(new Date(monthToCheck));
                monthToCheck = addMonths(monthToCheck, 1);
            }
    
            // Iterate over all missing months and mark them as paid
            let lastPaidMonth = null;
            let unpaidMonthsFound = false;
            let rentLogCount = 0;
    
            for (const month of monthsToMark) {
                const formattedMonth = format(month, 'yyyy-MM');
                
                // Check if payment for this specific month is already logged
                const { data: existingPayment, error: paymentError } = await supabase
                    .from('RENT_LOG')
                    .select('*')
                    .eq('rent_id', selectedRow.rent_id)
                    .eq('payment_month', formattedMonth);
                
                if (paymentError) {
                    throw paymentError;
                }
    
                console.log('Existing Payments:', existingPayment); // Log to verify what's being returned
    
                if (existingPayment && existingPayment.length > 0) {
                    // Payment for this specific month already exists, so skip marking it again
                    continue;
                }
    
                // Generate OR Number and create rent log entry for the month
                const orNumber = Math.floor(1000000000 + Math.random() * 9000000000);
                const rentLogEntry = {
                    OR_number: orNumber,
                    created_at: new Date().toISOString(),
                    rent_id: selectedRow.rent_id,
                    stall_name: selectedRow.stall_name,
                    tenant_name: tenantName,
                    r_interest: selectedRow.r_interest,
                    r_principal: selectedRow.r_principal,
                    rent_status: 'Paid',
                    payment_month: formattedMonth,
                    r_timestamp: new Date().toISOString(),
                    contract: selectedRow.r_contract,
                };
    
                // Insert into RENT_LOG table
                const { error: logError } = await supabase.from('RENT_LOG').insert([rentLogEntry]);
                if (logError) {
                    throw logError;
                }
    
                lastPaidMonth = month; // Keep track of the last month that was successfully paid
                unpaidMonthsFound = true; // Set flag to indicate unpaid months were found
                rentLogCount++; // Increment the rent log count
            }
    
            // Step 2: Mark the current simulated month as paid
            let nextDueRentDate;
    
            try {
                // Log the value of `simulatedMonthStart` before formatting it
                console.log('Simulated Month Start:', simulatedMonthStart);
    
                // Make sure `simulatedMonthStart` is correctly initialized before using it
                if (!simulatedMonthStart || isNaN(simulatedMonthStart.getTime())) {
                    throw new Error('Invalid simulated month start date.');
                }
    
                // Format the month to the required string format
                const currentSimulatedMonthFormatted = format(simulatedMonthStart, 'yyyy-MM');
                console.log('Formatted current simulated month:', currentSimulatedMonthFormatted);
    
                // Now use `currentSimulatedMonthFormatted` in the rent log check.
                const { data: existingPayment, error: paymentError } = await supabase
                    .from('RENT_LOG')
                    .select('*')
                    .eq('rent_id', selectedRow.rent_id)
                    .eq('payment_month', currentSimulatedMonthFormatted);
    
                if (paymentError) {
                    throw paymentError;
                }
    
                console.log('Existing Payments:', existingPayment); // Log to verify what's being returned
    
                // Only proceed if there's no payment recorded for the current simulated month
                if (!(existingPayment && existingPayment.length > 0)) {
                    // Generate OR Number and create rent log entry for the current simulated month
                    const orNumber = Math.floor(1000000000 + Math.random() * 9000000000);
                    const rentLogEntry = {
                        OR_number: orNumber,
                        created_at: new Date().toISOString(),
                        rent_id: selectedRow.rent_id,
                        stall_name: selectedRow.stall_name,
                        tenant_name: tenantName,
                        r_interest: selectedRow.r_interest,
                        r_principal: selectedRow.r_principal,
                        rent_status: 'Paid',
                        payment_month: currentSimulatedMonthFormatted,
                        r_timestamp: new Date().toISOString(),
                        contract: selectedRow.r_contract,
                    };
    
                    // Insert into RENT_LOG table for the current simulated month
                    const { error: logError } = await supabase.from('RENT_LOG').insert([rentLogEntry]);
                    if (logError) {
                        throw logError;
                    }
                    rentLogCount++; // Increment the rent log count
                }
    
                // Initialize `nextDueRentDate` here so it can be used later
                nextDueRentDate = addMonths(new Date(simulatedMonthStart), 1);
    
                // Preserve the original day of the month for the next due date
                nextDueRentDate.setDate(rentStartDate.getDate());
    
                console.log('Next Due Rent Date:', nextDueRentDate);
    
                // Update rent status in the RENT_INFORMATION table
                const { error: updateError } = await supabase
                    .from('RENT_INFORMATION')
                    .update({
                        r_status: true,
                        r_date: now.toISOString(), // Update the timestamp for the rent being paid
                        next_due_rent_date: format(nextDueRentDate, 'yyyy-MM-dd'),
                    })
                    .eq('rent_id', selectedRow.rent_id);
    
                if (updateError) {
                    throw updateError;
                }
    
                // Update local state to reflect the changes
                const updatedData = [...data];
                updatedData[index].r_status = true;
                updatedData[index].next_due_rent_date = nextDueRentDate.toISOString().split('T')[0];
                setData(updatedData);
            } catch (error) {
                console.error('Error updating rent status or inserting log:', error);
                setNotification({
                    open: true,
                    message: 'Error updating rent status or inserting log. Please try again.',
                    severity: 'error',
                });
                return; // Ensure the rest of the code doesn't run if an error occurs
            }
    
            // Step 4: Send confirmation message to tenant email
            const formattedMonthYear = format(simulatedMonthStart, 'MMMM yyyy');
            let messageBody;
    
            // Determine the message based on the number of rent log entries added
            if (rentLogCount > 1) {
                // If more than one rent log entry was added, mention all previous unpaid months
                messageBody = `Dear ${tenantName}, your rent for the month of ${formattedMonthYear} and all previous unpaid months have been marked as paid successfully. Thank you!`;
            } else {
                // Otherwise, just mention the current month
                messageBody = `Dear ${tenantName}, your rent for the month of ${formattedMonthYear} has been marked as paid successfully. Thank you!`;
            }
    
            const { error: messageError } = await supabase
                .from('MESSAGES')
                .insert([
                    {
                        sender: 'epicenteradmin@gmail.com',
                        receiver: tenantEmail,
                        subject: 'Rent Payment Confirmation',
                        message_body: messageBody,
                    },
                ]);
    
            if (messageError) {
                console.error('Error sending confirmation message:', messageError);
                setNotification({
                    open: true,
                    message: 'Error sending confirmation message. Please try again.',
                    severity: 'error',
                });
                return;
            }
    
            // Update local state to reflect the notification sent
            if (rentLogCount > 1) {
                setNotification({
                    open: true,
                    message: 'Rent marked as paid for all previous unpaid months, logged, and notification sent successfully.',
                    severity: 'success',
                });
            } else {
                setNotification({
                    open: true,
                    message: 'Rent for this month marked, logged, and notification sent successfully.',
                    severity: 'success',
                });
            }
        } catch (error) {
            console.error('Error updating rent status or inserting log:', error);
            setNotification({
                open: true,
                message: 'Error updating rent status or inserting log. Please try again.',
                severity: 'error',
            });
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

    const handleCancelEdit = () => {
        setEditingRow(null); // Reset the editingRow to exit edit mode
      };
      

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
                        Managing Rent Balance
                    </div>

                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem' }}>
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
                            <Input
                                placeholder="Principal"
                                value={principal}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow only positive numbers and prevent negative or non-numeric values
                                    if (/^\d*\.?\d*$/.test(value)) {
                                        setPrincipal(value);
                                    }
                                }}
                                type="number"
                                inputProps={{ style: { backgroundColor: '#ffffff', WebkitAppearance: 'none', paddingBottom: '25px' }, min: 0 }}
                                disabled
                            />


                        </div>

                        <div className="form-group">
                            <label>Contract:</label>
                            <input
                                type="file"
                                onChange={(e) => setContract(e.target.files[0])}
                                accept="application/pdf"
                                style={{  color: '#ffffff', marginBottom:'20px' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Stall:</label>
                            <Select
                                value={selectedStall}
                                onChange={async (e) => {
                                    setSelectedStall(e.target.value);

                                    // Fetch stall unit price based on the selected stall
                                    const selectedStallData = stalls.find(stall => stall.s_bus_name === e.target.value);
                                    if (selectedStallData) {
                                        try {
                                            const { data: stallUnitData, error: stallUnitError } = await supabase
                                                .from('STALL_UNIT')
                                                .select('stall_unit_price')
                                                .eq('stall_unit_name', selectedStallData.stall_unit_name)
                                                .single();

                                            if (stallUnitError) {
                                                throw stallUnitError;
                                            }

                                            if (stallUnitData) {
                                                setPrincipal(stallUnitData.stall_unit_price);
                                            }
                                        } catch (error) {
                                            console.error('Error fetching stall unit price:', error);
                                            setNotification({ open: true, message: 'Error fetching stall unit price.', severity: 'error' });
                                        }
                                    }
                                }}
                                displayEmpty
                                style={{ backgroundColor: '#ffffff', marginTop: '13px' }}
                            >
                                <MenuItem value="" disabled>Select Stall</MenuItem>
                                {stalls.map(stall => (
                                    <MenuItem key={stall.stall_id} value={stall.s_bus_name}>
                                        {stall.s_bus_name}
                                    </MenuItem>
                                ))}
                            </Select>

                            
                        </div>

                            <div className="form-group">
                            <Button style={{ marginTop: '50px' }} color="success" variant="contained" onClick={handleAdd} disabled={loading}>
                                {loading ? 'Loading...' : 'Add'}
                            </Button>
                            </div>

                            <div className="form-group">
                                <label>Rent Start Date:</label>
                                <Input
                                    type="date"
                                    value={rentStart}
                                    onChange={(e) => setRentStart(e.target.value)}
                                    inputProps={{ style: { backgroundColor: '#ffffff', WebkitAppearance: 'none' } }}
                                />
                            </div>

                            <div className="form-group">
                                <Button color="primary" variant="contained" onClick={simulateNewMonth} style={{ marginLeft: '10px' }}>Simulate Month Change</Button>
                            </div>
                        </div>

                      

                        

                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tenant Name</TableCell>
                                        <TableCell>Stall Name</TableCell>
                                        <TableCell>Balance (w/ Interest)</TableCell>
                                        <TableCell>Principal</TableCell>
                                        <TableCell>Rent Status</TableCell>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>Rent Start Date</TableCell>
                                        <TableCell sx={{ width: '25%' }}>Contract</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.rent_id || index}>
                                                <TableCell>{row.tenant_name || '-'}</TableCell>
                                                <TableCell>
                                                    {editingRow === index ? (
                                                        row.stall_name || '-' // Display the stall name as static text when editing
                                                    ) : (
                                                        row.stall_name || '-'
                                                    )}
                                                </TableCell>

                                                <TableCell>{row.r_interest || '-'}</TableCell>
                                               
                                                <TableCell>
                                                    {editingRow === index ? (
                                                        row.r_principal || '-' // Display the principal value as static text when editing
                                                    ) : (
                                                        row.r_principal || '-'
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                <Button
                                                    color={row.r_status ? "secondary" : "primary"}
                                                    variant="contained"
                                                    onClick={() => handleMarkAsPaid(index)}
                                                    disabled={row.r_status || row.r_interest == null} // Disable if already paid or r_interest is null
                                                >
                                                    {row.r_status ? 'Paid' : 'Mark as Paid'}
                                                </Button>

                                                </TableCell>
                                                <TableCell>
                                                    {row.r_date ? formatTimestamp(new Date(row.r_date)) : '-'}
                                                </TableCell>
                                                
                                                <TableCell>
                                                    {editingRow === index ? (
                                                        <Input
                                                            type="date"
                                                            value={row.rent_start ? new Date(row.rent_start).toISOString().split('T')[0] : ''}
                                                            onChange={(e) => handleInputChange(index, 'rent_start', e.target.value)}
                                                            inputProps={{ style: { backgroundColor: '#ffffe0' } }}
                                                        />
                                                    ) : (
                                                        row.rent_start ? format(new Date(row.rent_start), 'yyyy-MM-dd') : '-'
                                                    )}
                                                </TableCell>

                                                <TableCell sx={{ width: '25%' }}>
                                                    {editingRow === index ? (
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleInputChange(index, 'r_contract', e.target.files[0])}
                                                            accept="application/pdf"
                                                            style={{ backgroundColor: '#ffffe0' }}
                                                        />
                                                    ) : (
                                                        typeof row.r_contract === 'string' ? row.r_contract : (row.r_contract ? row.r_contract.name : '-')
                                                    )}
                                                </TableCell>

                                                <TableCell>
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
                                                            fontSize: {
                                                            xs: '0.7rem',
                                                            sm: '0.8rem',
                                                            md: '0.9rem',
                                                            lg: '1rem',
                                                            xl: '1.1rem',
                                                            },
                                                            padding: {
                                                            xs: '6px 12px',
                                                            sm: '8px 16px',
                                                            md: '10px 20px',
                                                            lg: '12px 24px',
                                                            xl: '14px 28px',
                                                            },
                                                            minWidth: {
                                                            xs: '100px',
                                                            sm: '110px',
                                                            md: '120px',
                                                            lg: '140px',
                                                            xl: '160px',
                                                            },
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
                                                            fontSize: {
                                                                xs: '0.7rem',
                                                                sm: '0.8rem',
                                                                md: '0.9rem',
                                                                lg: '1rem',
                                                                xl: '1.1rem',
                                                            },
                                                            padding: {
                                                                xs: '6px 12px',
                                                                sm: '8px 16px',
                                                                md: '10px 20px',
                                                                lg: '12px 24px',
                                                                xl: '14px 28px',
                                                            },
                                                            minWidth: {
                                                                xs: '100px',
                                                                sm: '110px',
                                                                md: '120px',
                                                                lg: '140px',
                                                                xl: '160px',
                                                            },
                                                            textTransform: 'none',
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        )}

                                                        <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => {
                                                            const url = `https://${process.env.REACT_APP_SUPABASE_STORAGE_URL}/storage/v1/object/public/contract-pdfs/${row.r_contract}`;
                                                            window.open(url, '_blank');
                                                        }}
                                                        sx={{
                                                            fontSize: {
                                                            xs: '0.7rem',
                                                            sm: '0.8rem',
                                                            md: '0.9rem',
                                                            lg: '1rem',
                                                            xl: '1.1rem',
                                                            },
                                                            padding: {
                                                            xs: '6px 12px',
                                                            sm: '8px 16px',
                                                            md: '10px 20px',
                                                            lg: '12px 24px',
                                                            xl: '14px 28px',
                                                            },
                                                            minWidth: {
                                                            xs: '100px',
                                                            sm: '110px',
                                                            md: '120px',
                                                            lg: '140px',
                                                            xl: '160px',
                                                            },
                                                            textTransform: 'none',
                                                        }}
                                                        >
                                                        View PDF
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