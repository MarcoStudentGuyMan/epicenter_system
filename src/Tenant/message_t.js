import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home } from 'ionicons/icons';
import {
  Breadcrumbs, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  MenuItem, TablePagination, Typography, Card, CardActions, CardContent
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import ArchiveIcon from '@mui/icons-material/Archive';
import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';
import { useDrawer } from '../Admin/drawerContext';
import { supabase } from '../supabaseConnect';
import '../styles/HeaderAdmin.css';
import '../styles/dashboardT.css';
import '../styles/dashboardA.css';

function MessageT() {
  const navigate = useNavigate();
  const { isOpen, toggleDrawer } = useDrawer();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [adminOptions, setAdminOptions] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch current session to get tenant email
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userEmail = session.user.email;
        setEmail(userEmail);
        fetchMessages(userEmail);
      }
    };
    fetchSession();
  }, []);

  // Fetch messages where receiver is the tenant
  const fetchMessages = async (tenantEmail) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('MESSAGES')
        .select('*')
        .eq('receiver', tenantEmail);

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    setLoading(false);
  };

  // Fetch all admin emails for tenant to send message
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data, error } = await supabase
          .from('MANAGER')
          .select('Manager_Email, Manager_FirstName, Manager_LastName');

        if (error) {
          console.error('Error fetching admins:', error);
        } else {
          const options = data.map(admin => ({
            value: admin.Manager_Email,
            label: `${admin.Manager_FirstName} ${admin.Manager_LastName}`,
          }));
          setAdminOptions(options);
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };
    fetchAdmins();
  }, []);

  const handleSendMessage = async () => {
    try {
      const { data, error } = await supabase
        .from('MESSAGES')
        .insert([
          {
            sender: email,
            receiver: selectedAdmin,
            subject,
            message_body: message,
            sender_type: 'Tenant',
            receiver_type: 'Admin',
            is_read: false,
          }
        ]);

      if (error) {
        console.error('Error sending message:', error);
      } else {
        alert('Message Sent');
        handleDialogClose();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleReply = (event, message) => {
    event.stopPropagation(); // Prevent row click
    setSelectedAdmin(message.sender); // Auto-fill admin email
    setSubject(`RE: ${message.subject}`); // Pre-fill subject
    setMessage(''); // Clear message for fresh reply
    setOpenDialog(true); // Open compose dialog
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedAdmin('');
    setSubject('');
    setMessage('');
  };

  const handleRowClick = (message) => {
    setSelectedMessage(message);
    setOpenMessageDialog(true);
  };

  const handleCloseMessageDialog = () => {
    setOpenMessageDialog(false);
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
          navigate={navigate}
        />
        <main
          className="tenantSide-main-content"
          style={{
            marginLeft: isOpen ? 240 : 60,
            transition: 'margin-left 0.3s',
          }}
        >
          <div className="Title">Message Inbox</div>

          <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
            <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_tenant')} className="breadcrumb-link">
              <IonIcon icon={home} className="breadcrumb-icon" />
              <span>Home</span>
            </Link>
            <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link">
              Message Inbox
            </Link>
          </Breadcrumbs>

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'limegreen', color: 'white', fontWeight: 'bold', textTransform: 'none' }}
              onClick={handleDialogOpen}
            >
              Compose
            </Button>
          </div>

          {/* Messages Table */}
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table stickyHeader aria-label="message inbox">
                <TableHead>
                  <TableRow>
                    <TableCell>Sender</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">Loading...</TableCell>
                    </TableRow>
                  ) : messages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No Messages</TableCell>
                    </TableRow>
                  ) : (
                    messages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id} onClick={() => handleRowClick(row)}>
                          <TableCell>{row.sender}</TableCell>
                          <TableCell>{row.subject}</TableCell>
                          <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <IconButton color="primary" onClick={(event) => handleReply(event, row)}>
                              <ReplyIcon />
                            </IconButton>
                            <IconButton color="secondary">
                              <ArchiveIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={messages.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>

          {/* Compose Message Dialog */}
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Create Message</DialogTitle>
            <DialogContent>
              <TextField
                select
                label="Select Admin"
                value={selectedAdmin}
                onChange={(e) => setSelectedAdmin(e.target.value)}
                fullWidth
                margin="normal"
              >
                {adminOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

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
              <Button onClick={handleSendMessage} sx={{ backgroundColor: 'limegreen', color: 'white' }}>
                Send
              </Button>
              <Button onClick={handleDialogClose}>Cancel</Button>
            </DialogActions>
          </Dialog>

          {/* Modal for Viewing Full Message Details */}
          <Dialog open={openMessageDialog} onClose={handleCloseMessageDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              <Typography variant="h5" gutterBottom style={{ fontWeight: 600 }}>
                Message Details
              </Typography>
            </DialogTitle>
            <DialogContent>
              {selectedMessage && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                      Sender:
                    </Typography>
                    <Typography variant="h6" gutterBottom style={{ fontSize: '1.2rem' }}>
                      {selectedMessage.sender}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                      Subject:
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom style={{ fontSize: '1.2rem' }}>
                      {selectedMessage.subject}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                      Message:
                    </Typography>
                    <Typography variant="body1" gutterBottom style={{ fontSize: '1.2rem' }}>
                      {selectedMessage.message_body}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                      Sent at:
                    </Typography>
                    <Typography variant="caption" style={{ fontSize: '1rem' }}>
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </Typography>
                  </CardContent>
                  <CardActions style={{ justifyContent: 'flex-end' }}>
                    <Button onClick={handleCloseMessageDialog} color="primary" style={{ fontSize: '1rem' }}>
                      Close
                    </Button>
                  </CardActions>
                </Card>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </IonApp>
  );
}

export default MessageT;
