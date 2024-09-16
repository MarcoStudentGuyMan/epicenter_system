import React, { useState } from 'react';
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
import TablePagination from '@mui/material/TablePagination';  
import MiniDrawer from './drawer_admin'; 
import Header from './header_admin'; 
import { useDrawer } from './drawerContext'; 
import '../styles/Layouts.css'; // Your custom styles
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const columns = [
  { id: 'forum_id', label: 'Forum ID', minWidth: 100 },
  { id: 'tenant_id', label: 'Tenant ID', minWidth: 100 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'subject', label: 'Subject', minWidth: 170 },
  { id: 'message', label: 'Message', minWidth: 300 },
];

const dummyData = [
  { forum_id: '1', tenant_id: 'TEN-01', email: 'tenant1@example.com', name: 'Juan Dela Cruz', subject: 'Inquiry', message: 'Add another stall?' },
  { forum_id: '2', tenant_id: 'TEN-02', email: 'tenant2@example.com', name: 'Al james', subject: 'Complaint', message: 'Noise issues during night time.' },
];

export default function Message() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { isOpen, toggleDrawer } = useDrawer();
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedTenant, setSelectedTenant] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const tenantOptions = [
    { value: 'TEN-01', label: 'Tenant 1', email: 'tenant1@example.com' },
    { value: 'TEN-02', label: 'Tenant 2', email: 'tenant2@example.com' },
  ];

  const handleTenantChange = (event) => {
    const selectedOption = tenantOptions.find(opt => opt.value === event.target.value);
    setSelectedTenant(event.target.value);
    setSelectedEmail(selectedOption?.email || '');
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedTenant('');
    setSelectedEmail('');
    setSubject('');
    setMessage('');
  };

  const handleSend = () => {
    alert('Message Sent');
    handleDialogClose();
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
      <MiniDrawer isOpen={isOpen} onDrawerToggle={toggleDrawer} />
      <Header
        drawerOpen={isOpen}
        handleDrawerToggle={toggleDrawer}
        navigate={navigate}
      />

      <main
        className="tenantSide-main-content"
        style={{
          marginLeft: isOpen ? 240 : 60, 
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
            onClick={handleDialogOpen}
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
                {dummyData
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
            count={dummyData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Dialog for sending a message */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Send Message</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Select Tenant"
              value={selectedTenant}
              onChange={handleTenantChange}
              fullWidth
              margin="normal"
            >
              {tenantOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Select Email"
              value={selectedEmail}
              disabled
              fullWidth
              margin="normal"
            />

            <TextField
              label="Enter Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Enter Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSend} sx={{ backgroundColor: 'limegreen', color: 'white' }}>
              Send
            </Button>
            <Button onClick={handleDialogClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
}
