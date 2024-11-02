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
import { Breadcrumbs, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Snackbar, Alert, FormGroup, FormControlLabel, Checkbox, TextField } from '@mui/material';
import { format } from 'date-fns';

// Supabase client setup
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function RentRecA() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context

    const [data, setData] = useState([]);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [selectedFilter, setSelectedFilter] = useState('months'); // Track selected filter
    const [searchQuery, setSearchQuery] = useState('');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        fetchRentReceipts();
    }, [selectedFilter, searchQuery]);

    // Fetch rent receipt data from RENT_LOG table
    const fetchRentReceipts = async () => {
        try {
            let query = supabase.from('RENT_LOG').select('*');

            if (selectedFilter === 'months') {
                query = query.order('payment_month', { ascending: false });
            } else if (selectedFilter === 'tenants') {
                query = query.order('tenant_name', { ascending: true });
            } else if (selectedFilter === 'stalls') {
                query = query.order('stall_name', { ascending: true });
            }

            if (searchQuery) {
                if (selectedFilter === 'months') {
                    // Handle numeric or word month search
                    const monthWords = {
                        january: '01',
                        february: '02',
                        march: '03',
                        april: '04',
                        may: '05',
                        june: '06',
                        july: '07',
                        august: '08',
                        september: '09',
                        october: '10',
                        november: '11',
                        december: '12'
                    };
                    let modifiedQuery = searchQuery;
                    if (monthWords[searchQuery.toLowerCase()]) {
                        modifiedQuery = monthWords[searchQuery.toLowerCase()];
                        query = query.ilike('payment_month', `%${modifiedQuery}%`);
                    } else {
                        query = query.ilike('payment_month_word', `%${searchQuery}%`);
                    }
                } else if (selectedFilter === 'tenants') {
                    query = query.ilike('tenant_name', `%${searchQuery}%`);
                } else if (selectedFilter === 'stalls') {
                    query = query.ilike('stall_name', `%${searchQuery}%`);
                }
            }

            const { data: rentLogData, error } = await query;
            if (error) throw error;
            setData(rentLogData);
        } catch (error) {
            console.error('Error fetching rent receipts:', error);
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

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setSearchQuery(''); // Clear search query when filter changes
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const columns = [
        { id: 'OR_number', label: 'OR Number', minWidth: 100 },
        { id: 'payment_month', label: 'Month', minWidth: 100 },
        { id: 'stall_name', label: 'Stall Name', minWidth: 100 },
        { id: 'tenant_name', label: 'Tenant Name', minWidth: 100 },
        { id: 'r_interest', label: 'Rent Interest (Total)', minWidth: 100 },
        { id: 'r_principal', label: 'Rent Balance', minWidth: 100 },
        { id: 'rent_status', label: 'Rent Status', minWidth: 100 },
        { id: 'r_timestamp', label: 'Timestamp', minWidth: 100 },
        { id: 'contract', label: 'Contract', minWidth: 100 },
    ];

    return (
        <IonApp>
            <div className="app-container">
                <MiniDrawer isOpen={isOpen} onDrawerToggle={toggleDrawer} /> {/* Use context values */}
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
                        List of Rent Receipts
                    </div>

                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem', marginBottom: '20px' }}>
                        <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
                            <IonIcon icon={home} className="breadcrumb-icon" />
                            <span>Home</span>
                        </Link>
                        <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
                            Rent Receipt
                        </Link>
                    </Breadcrumbs>

                    <FormGroup className="horizontal-checkboxes" sx={{ backgroundColor: '#002E46', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', width: '100%' }}>
    <label style={{ color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>{`Search ${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}`}</label>
    <TextField
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        sx={{ backgroundColor: 'white', borderRadius: '4px' }}
    />
    
    <label style={{ color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>Filter By:</label>
    <FormGroup row sx={{ gap: '20px' }}>
        <FormControlLabel
            control={
                <Checkbox
                    className="small-checkbox"
                    checked={selectedFilter === 'months'}
                    onChange={() => handleFilterChange('months')}
                    sx={{ color: 'white' }}
                />
            }
            label={<span style={{ color: 'white' }}>Months</span>}
        />
        <FormControlLabel
            control={
                <Checkbox
                    className="small-checkbox"
                    checked={selectedFilter === 'stalls'}
                    onChange={() => handleFilterChange('stalls')}
                    sx={{ color: 'white' }}
                />
            }
            label={<span style={{ color: 'white' }}>Stalls</span>}
        />
        <FormControlLabel
            control={
                <Checkbox
                    className="small-checkbox"
                    checked={selectedFilter === 'tenants'}
                    onChange={() => handleFilterChange('tenants')}
                    sx={{ color: 'white' }}
                />
            }
            label={<span style={{ color: 'white' }}>Tenants</span>}
        />
    </FormGroup>
</FormGroup>


                    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '20px' }} key={data.length}>
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
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                {columns.map((column) => {
                                                    let value = row[column.id];
                                                    if (column.id === 'r_timestamp') {
                                                        // Format the timestamp to a readable format
                                                        const date = new Date(value);
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
                                                    } else if (column.id === 'payment_month') {
                                                        // Format the payment month to 'Month, Year'
                                                        const [year, month] = value.split('-');
                                                        const formattedMonth = format(new Date(year, month - 1), 'MMMM yyyy');
                                                        value = formattedMonth;
                                                    }
                                                    return (
                                                        <TableCell key={column.id}>
                                                            {value !== null && value !== undefined ? value : '-'}
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

export default RentRecA;
