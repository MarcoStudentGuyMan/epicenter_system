import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home, personCircle,prism,triangle, storefront, mail, chatbubble, newspaper, calculator, exit, pencil, people } from 'ionicons/icons';
import { supabase } from '../supabaseConnect';
import '../styles/dashboardT.css';  
import '../styles/dashboardA.css';


import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';
import '../styles/HeaderAdmin.css';
import { useDrawer } from '../Admin/drawerContext'; // Use the drawer context
import TablePagination from '@mui/material/TablePagination';
const columns = [
    { id: 'forum_id', label: 'Forum ID', minWidth: 100 },
    { id: 'tenant_id', label: 'Tenant ID', minWidth: 100 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'subject', label: 'Subject', minWidth: 170 },
    { id: 'message', label: 'Message', minWidth: 300 },
  ];

function  MessageT() {
    
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
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
          marginLeft: isOpen ? 240 : 60, // Adjust margin based on drawer state
          transition: 'margin-left 0.3s',
        }}
      >
        <div className="Title">Message</div>
        
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
          <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_tenant')} className="breadcrumb-link">
            <IonIcon icon={home} className="breadcrumb-icon" />
            <span>Home</span>
          </Link>
          <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link">
            Message
          </Link>
        </Breadcrumbs>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'limegreen', color: 'white', fontWeight: 'bold', marginTop: '10px' }}
            onClick={() => alert('Reply functionality here')} // Add reply functionality
          >
            Reply
          </Button>
        </div>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '20px' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="forum table">
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
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.forum_id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id}>
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




export default  MessageT;
