import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboardA.css';
import MiniDrawer from './drawer_admin';
import Header from './header_admin';
import { useDrawer } from './drawerContext'; // Use the drawer context
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress'; // For loading spinner
import Typography from '@mui/material/Typography'; // For displaying text
import { supabase } from '../supabaseConnect'; // Import supabase

function History() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [historyData, setHistoryData] = useState([]); // State to hold history data
    const [selectedFilter, setSelectedFilter] = useState('STALL'); // Track selected filter (default to STALL)
    const [loading, setLoading] = useState(true); // Track loading state

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Fetch history data based on the selected filter (table name)
    useEffect(() => {
        fetchHistoryData();
    }, [selectedFilter]);

    const fetchHistoryData = async () => {
        setLoading(true); // Start loading
        const { data, error } = await supabase
            .from('logs') // Assuming logs is your history table
            .select('*')
            .eq('table_name', selectedFilter); // Filter by selected table name (STALL, STALL_UNIT, etc.)

        if (!error) {
            setHistoryData(data);
        } else {
            console.error('Error fetching history data:', error);
        }
        setLoading(false); // Stop loading
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Render table content based on the selected filter
    const renderTableContent = () => {
        if (loading) {
            return (
                <TableRow>
                    <TableCell colSpan={5} align="center">
                        <CircularProgress /> {/* Loading Spinner */}
                    </TableCell>
                </TableRow>
            );
        }

        if (historyData.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={5} align="center">
                        <Typography>No data available for the selected table.</Typography> {/* No Data Placeholder */}
                    </TableCell>
                </TableRow>
            );
        }

        return historyData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
                <TableRow key={row.id}>
                    <TableCell>{row.user_id}</TableCell>
                    <TableCell>{row.action_type}</TableCell>
                    <TableCell>{row.table_name}</TableCell>
                    <TableCell>{row.record_id}</TableCell>
                    <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                </TableRow>
            ));
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
                        marginLeft: isOpen ? 240 : 60, // Adjust main content margin based on drawer state
                        transition: 'margin-left 0.3s', // Smooth transition for margin change
                    }}
                >
                    <div className="tenant-dashboard-content">
                        <h2 style={{ color: 'black' }}>HISTORY</h2>

                    <section className="profile-Align">
                    <div className="stall-form">
                    <div className="form-group">
                        {/* Filter Section */}
                        <FormGroup className="horizontal-checkboxes">
                            <label>Filter By:</label>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className="small-checkbox"
                                        checked={selectedFilter === 'STALL'}
                                        onChange={() => setSelectedFilter('STALL')}
                                        sx={{ color: 'white' }}
                                    />
                                }
                                label="Stall"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className="small-checkbox"
                                        checked={selectedFilter === 'STALL_UNIT'}
                                        onChange={() => setSelectedFilter('STALL_UNIT')}
                                        sx={{ color: 'white' }}
                                    />
                                }
                                label="Stall Unit"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className="small-checkbox"
                                        checked={selectedFilter === 'TENANT'}
                                        onChange={() => setSelectedFilter('TENANT')}
                                        sx={{ color: 'white' }}
                                    />
                                }
                                label="Tenant"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className="small-checkbox"
                                        checked={selectedFilter === 'MINISITE'}
                                        onChange={() => setSelectedFilter('MINISITE')}
                                        sx={{ color: 'white' }}
                                    />
                                }
                                label="Mini Site"
                            />
                        </FormGroup>
                        </div>
                        </div>
                    </section>
                        {/* History Table */}
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="history table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>User ID</TableCell>
                                            <TableCell>Action Type</TableCell>
                                            <TableCell>Timestamp</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderTableContent()} {/* Render content (with loading or no data placeholders) */}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={historyData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                       
                    </div>
                
                </main>
            </div>
            
        </IonApp>
    );
}

export default History;
