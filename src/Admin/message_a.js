import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home } from 'ionicons/icons';
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
import TablePagination from '@mui/material/TablePagination';  // Import this
import MiniDrawer from './drawer_admin'; // Ensure this is correctly imported
import Header from './header_admin'; // Ensure this is correctly imported
import { useDrawer } from './drawerContext'; // Import the drawer context
import { supabase } from '../supabaseConnect'; // Import your Supabase connection
import '../styles/Layouts.css'; // Ensure this file contains your CSS styles

const columns = [
  { id: 'forum_id', label: 'Forum ID', minWidth: 100 },
  { id: 'tenant_id', label: 'Tenant ID', minWidth: 100 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'subject', label: 'Subject', minWidth: 170 },
  { id: 'message', label: 'Message', minWidth: 300 },
];

function createData(forum_id, tenant_id, email, name, subject, message) {
  return { forum_id, tenant_id, email, name, subject, message };
}

export default function Message() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data from your Supabase database for forums
      const { data: forumData, error } = await supabase
        .from('FORUM') // Assuming your table is named 'FORUM'
        .select('forum_id, tenant_id, email, name, subject, message');
      if (error) {
        console.error('Error fetching forum data:', error);
      } else {
        setData(forumData.map(item => createData(item.forum_id, item.tenant_id, item.email, item.name, item.subject, item.message)));
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
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
          marginLeft: isOpen ? 240 : 60, // Adjust margin based on drawer state
          transition: 'margin-left 0.3s',
        }}
      >
        <div className="Title">Message</div>
        
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
          <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link">
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
  );
}
