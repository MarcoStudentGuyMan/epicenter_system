import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home, pencil, trash,mail,notifications } from 'ionicons/icons';
import '../styles/tenantsA.css'; 
import '../styles/Stall.css'; 
import '../styles/Layouts.css';
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly imported

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

const columns = [
    { id: 'id', label: 'Tenant ID', minWidth: 100 },
    { id: 'firstName', label: 'First Name', minWidth: 150 },
    { id: 'lastName', label: 'Last Name', minWidth: 150 },
    { id: 'contact', label: 'Contact Number', minWidth: 150 },
    { id: 'email', label: 'Email Address', minWidth: 200 },
    { id: 'password', label: 'Password', minWidth: 150 },
    { id: 'profilePic', label: 'Profile Picture', minWidth: 150 },
    { id: 'actions', label: 'Actions', minWidth: 150, align: 'center' },
];

function createData(id, firstName, lastName, contact, email, password, profilePic) {
    return { id, firstName, lastName, contact, email, password, profilePic };
}

const rows = [
    createData('1000', 'Bobby', 'Lee', '09151239876', 'bobbylee@gmail.com', '************', 'bobby.png'),
    // Add more rows as needed
];

function TenantA() {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleDrawerToggle = (isOpen) => {
        setDrawerOpen(isOpen);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div className="app-container">
            <MiniDrawer onDrawerToggle={handleDrawerToggle} />
            <header
                className="tenantSide-header"
                style={{
                marginLeft: drawerOpen ? 240 : 60, // Adjust header margin based on drawer state
                transition: 'margin-left 0.3s', // Smooth transition for margin change
                }}
            >
                <div className="header-left">
                <a onClick={() => navigate('/dashboard_admin')}>
                    <img className="logo-nav" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                </a>
                <span className="app-name">Epicenter</span>
                </div>
                <div className="header-right">
                <a onClick={() => navigate('/email_admin')}>
                    <IonIcon icon={mail} className="icon" />
                </a>
                <IonIcon icon={notifications} className="icon" />
                </div>
            </header>

            <main
                className="tenantSide-main-content"
                style={{
                    marginLeft: drawerOpen ? 240 : 60, // Adjust main content margin based on drawer state
                    transition: 'margin-left 0.3s', // Smooth transition for margin change
                }}
            >
                <div className="Title">Tenants</div>
                <div className="page-container">
                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
                        <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link">
                            <IonIcon icon={home} className="breadcrumb-icon" />
                            <span>Home</span>
                        </Link>
                        <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link">
                            Profile
                        </Link>
                    </Breadcrumbs>

                    <section className="profile-Align">
                        <div className="stall-form">
                            <div className="form-group">
                                <label>Tenant First Name:</label>
                                <input placeholder="Enter First Name" />
                            </div>
                            <div className="form-group">
                                <label>Tenant Last Name:</label>
                                <input placeholder="Enter Last Name" />
                            </div>
                            <div className="form-group">
                                <label>Contact Number:</label>
                                <input placeholder="Enter Contact Number" />
                            </div>
                            <div className="form-group">
                                <label>Email Address:</label>
                                <input placeholder="Enter Email Address" />
                            </div>
                            <div className="form-group">
                                <label>Profile Picture:</label>
                                <div className="business-logo-field">
                                    <input type="file" />
                                    <button>Add</button>
                                </div>
                            </div>
                        </div>

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
                                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    if (column.id === 'actions') {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <button className="edit">
                                                                    <IonIcon icon={pencil} className="edit" />
                                                                    <a onClick={() => navigate('/edittenant_admin')}>Edit</a>
                                                                </button>
                                                                <button className="delete">
                                                                    <IonIcon icon={trash} className="delete" />
                                                                    Delete
                                                                </button>
                                                            </TableCell>
                                                        );
                                                    } else {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {value}
                                                            </TableCell>
                                                        );
                                                    }
                                                })}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default TenantA;
   