import React, { useState, useEffect } from 'react';
import { IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboardA.css';
import MiniDrawer from './drawer_admin';
import Header from './header_admin';
import { useDrawer } from './drawerContext';
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
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { supabase } from '../supabaseConnect';

function History() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [historyData, setHistoryData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        fetchHistoryData();
    }, [selectedFilter]);

    const fetchHistoryData = async () => {
        setLoading(true);

        let query = supabase.from('HISTORY').select('*').order('created_at', { ascending: false });

        // Adjust filter based on the selected filter
        
        if (selectedFilter) {
            const filterMap = {
                'STALL': ['Archived a Stall', 'Added a Stall', 'Restore stall'],
                'TENANT': ['Added a Tenant', 'Archived a Tenant','Restore tenant'],
                'MINISITE': ['Accept the mini-site','Archive the mini-site', 'Restore mini-site']
            };

            const filterValues = filterMap[selectedFilter];
            if (Array.isArray(filterValues)) {
                query = query.or(filterValues.map(value => `Action_Type.ilike.%${value}%`).join(','));
            } else {
                query = query.ilike('Action_Type', `%${filterValues}%`);
            }
        }

        const { data, error } = await query;

        if (!error) {
            setHistoryData(data);
        } else {
            console.error('Error fetching history data:', error);
        }
        setLoading(false);
    };

    

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const renderTableContent = () => {
        if (loading) {
            return (
                <TableRow>
                    <TableCell colSpan={4} align="center">
                        <CircularProgress />
                    </TableCell>
                </TableRow>
            );
        }
    
        if (historyData.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={4} align="center">
                        <Typography>No data available for the selected filter.</Typography>
                    </TableCell>
                </TableRow>
            );
        }
    
        return historyData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
                <TableRow key={row.id}>
                    <TableCell>{row.Manager_LastName}</TableCell>
                    <TableCell>{row.Action_Type}</TableCell>
                    <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
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
                        marginLeft: isOpen ? 240 : 60,
                        transition: 'margin-left 0.3s',
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
        <TableCell>Manager Last Name</TableCell>
        <TableCell>Action Type</TableCell>
        <TableCell>Timestamp</TableCell>
    </TableRow>
</TableHead>

                                    <TableBody>{renderTableContent()}</TableBody>
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
