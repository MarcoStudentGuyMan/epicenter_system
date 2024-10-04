import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react'; 
import { useNavigate } from 'react-router-dom';
import { easel, notifications, personCircle, cube, storefront, people, triangle, prism, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/dashboardA.css';  
import '../styles/HeaderAdmin.css';
import MiniDrawer from './drawer_admin';
import Header from './header_admin';
import { useDrawer } from './drawerContext'; 
import { Button } from '@mui/material'; // Import Material-UI Button

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { home } from 'ionicons/icons';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

function RentAutoA() {

    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };


    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const columns = [
        { label: 'Auto ID', minWidth: 100  },//id: 'stall_id',
        {  label: 'Rent ID', minWidth: 100 },//id: 's_bus_name',
        {  label: 'Stall ID', minWidth: 100 },//id: 's_desc',
        {  label: 'Principal', minWidth: 100 },//id: 's_type',
        {  label: 'Interest', minWidth: 100 },//id: 's_logo',
        {  label: 'Years of Stay', minWidth: 100 },//id: 'ten_id',
        {  label: 'Date', minWidth: 100 },//id: 'actions',
        {  label: 'Rent Balance', minWidth: 100 },//id: 'actions',
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
                        marginLeft: isOpen ? 240 : 60, // Adjust main content margin based on drawer state
                        transition: 'margin-left 0.3s', // Smooth transition for margin change
                    }}
                >
                    <div className="Title">
                       Managing Rent Automation
                    </div>

                <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem' }} >
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
                            />
                        </div>
                        <div className="form-group">
                            <label>Interest:</label>
                            <input
                            type="number"
                            placeholder="Enter Interest"
                            />
                        </div>

                        <div className="form-group">
                            <label>Years of Stay:</label>
                            <input
                            type="number"
                            placeholder="Enter Years of Stay"
                            />
                        </div>

                        <div className="form-group">
                                <label>Select Stall:</label>
                                <select value="">
                                <option value="" disabled>Select Stall</option>
                                <option value="Cafe and Pastry">Krispy King</option>
                                <option value="Restaurant and Bar">Chowking</option>
                                <option value="Sweets and Desserts">JJs Inato</option>
                                <option value="Groceries">Ramen Shop</option>
                                </select>
                            </div>
                          
                            <Button color="success" variant="contained" type="submit">Add</Button>
                        </div>

                        {/*Start of Table*/}
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
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
                                    .map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.stall_id}>
                                        {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                            {value}
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
        </IonApp>
    );
}

export default RentAutoA;
