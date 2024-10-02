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

function MiniSiteA() {
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
        { label: 'Mini Site ID', minWidth: 100  },//id: 'stall_id',
        {  label: 'Tenant', minWidth: 100 },//id: 's_bus_name',
        {  label: 'Stall', minWidth: 100 },//id: 's_desc',
        {  label: 'Stall Type', minWidth: 100 },//id: 's_type',
        {  label: 'Actions', minWidth: 100 },//id: 's_logo',
       
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
                       Managing Mini Sites
                    </div>

                <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem' }} >
                    <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
                    <IonIcon icon={home} className="breadcrumb-icon" />
                    <span>Home</span>
                    </Link>
                    <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
                   Mini Sites
                    </Link>
                </Breadcrumbs>

                <section className="profile-Align">
                {/*Start of Form*/}
                <div className='stall-form'>
                <div className="form-group"></div>
                <div className="form-group">
                    <label>Select Tenant:</label>
                    <select value="">
                            <option value="" disabled>Select Tenant</option>
                            <option value="Cafe and Pastry">tenant1</option>
                            <option value="Restaurant and Bar">tenant2</option>
                            <option value="Sweets and Desserts">tenant3</option>
                            <option value="Groceries">tenant4</option>
                        </select>
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

                        <div>
                            <Button
                            variant="contained"
                            color="success"
                            className="admin-save-button"
                            >
                            {/*{loading ? 'Adding...' : 'Add'}*/}
                            Add
                            </Button>
                        </div>
                    </div>
                 </section>


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


export default MiniSiteA;
