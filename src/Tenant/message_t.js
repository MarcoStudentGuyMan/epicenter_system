import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home } from 'ionicons/icons';
import {
  Breadcrumbs, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  MenuItem, TablePagination, Typography, Box, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'; // Archive icon for button
import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';
import { useDrawer } from '../Admin/drawerContext';
import { supabase } from '../supabaseConnect';
import '../styles/HeaderAdmin.css';
import '../styles/dashboardT.css';
import '../styles/dashboardA.css';
import '../styles/messageT.css';


function MessageT() {
  const navigate = useNavigate();
  const { isOpen, toggleDrawer } = useDrawer();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [messages, setMessages] = useState([]);
  const [archivedMessages, setArchivedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [adminOptions, setAdminOptions] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [openArchivedMessageDialog, setOpenArchivedMessageDialog] = useState(false);
  const [selectedArchivedMessage, setSelectedArchivedMessage] = useState(null);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const handleCloseArchivedMessageDialog = () => {
    setOpenArchivedMessageDialog(false);
    setSelectedArchivedMessage(null);  // Clear the selected message
  };

  const handleArchivedMessageClick = (message) => {
    setSelectedArchivedMessage(message);  // Set the selected message
    setOpenArchivedMessageDialog(true);
  };
  // Fetch current session to get tenant email
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userEmail = session.user.email;
        setEmail(userEmail);
        fetchMessages(userEmail);
        fetchArchivedMessages(userEmail);
        subscribeToMessages(userEmail); // Subscribing to real-time messages
        subscribeToArchivedMessages(userEmail); // Subscribing to real-time archived messages
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
      .eq('receiver', tenantEmail)
      .order('created_at', { ascending: false }); // Sort messages newest first

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      // You can explicitly sort again, just in case the server-side order isn't reliable.
      const sortedMessages = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Set the messages in the correct order
      setMessages(sortedMessages);
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
  setLoading(false);
};

// Fetch archived messages for tenant
const fetchArchivedMessages = async (tenantEmail) => {
  setLoading(true); // Start loading when fetching begins
  try {
    const { data, error } = await supabase
      .from('MSGARCHIVE')
      .select('*')
      .eq('receiver', tenantEmail)
      .order('created_at', { ascending: false }); // Fetch and sort by newest first
    
    if (error) {
      console.error('Error fetching archived messages:', error);
    } else {
      // Sort the data by created_at in descending order
      const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Update state with sorted archived messages
      setArchivedMessages(sortedData);
    }
  } catch (error) {
    console.error('Error fetching archived messages:', error);
  }
  setLoading(false); // End loading after fetch completes
};


  // Subscribe to real-time messages
  const subscribeToMessages = (tenantEmail) => {
    const channel = supabase
      .channel('realtime:MESSAGES')  // Name your channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'MESSAGES' }, (payload) => {
        if (payload.new.receiver === tenantEmail) {
          setMessages(prevMessages => [payload.new, ...prevMessages]);
        }
      })
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Subscribe to real-time archived messages
  const subscribeToArchivedMessages = (tenantEmail) => {
    const channel = supabase
      .channel('realtime:MSGARCHIVE')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'MSGARCHIVE' }, (payload) => {
        if (payload.new.receiver === tenantEmail) {
          setArchivedMessages(prevArchivedMessages => [payload.new, ...prevArchivedMessages]);
        }
      })
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel); // Cleanup the subscription
    };
  };

  // Fetch all admin emails for tenant to send message
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data, error } = await supabase
          .from('MANAGER')
          .select('Manager_Email, Manager_FirstName, Manager_LastName, Manager_Profile_Pic'); // Added Manager_Profile_Pic

        if (error) {
          console.error('Error fetching admins:', error);
        } else {
          const options = data.map(admin => ({
            value: admin.Manager_Email,
            label: `${admin.Manager_FirstName} ${admin.Manager_LastName}`,
            profilePic: admin.Manager_Profile_Pic // Include the profile picture
          }));
          setAdminOptions(options);
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };
    fetchAdmins();
  }, []);

  // Send Message
  const handleSendMessage = async () => {
    try {
      const { data, error } = await supabase
        .from('MESSAGES')
        .insert([{
          sender: email,
          receiver: selectedAdmin,
          subject,
          message_body: message,
          sender_type: 'Tenant',
          receiver_type: 'Admin',
          is_read: false,
        }]);

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

  // Open Compose Message Dialog
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  // Close Compose Message Dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedAdmin('');
    setSubject('');
    setMessage('');
  };

  // When a message row is clicked
  const handleRowClick = async (message) => {
    if (!message) return; // Ensure message is not null

    try {
      // Check if the message is unread, then mark it as read
      if (!message.is_read) {
        const { error } = await supabase
          .from('MESSAGES')
          .update({ is_read: true })
          .eq('id', message.id);
        
        if (error) {
          console.error('Error updating message status:', error);
          return;
        }

        // Update the local state to mark the message as read
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === message.id ? { ...msg, is_read: true } : msg
          )
        );
      }

      // Open the message dialog after marking it as read
      setSelectedMessage(message);
      setOpenMessageDialog(true);
    } catch (error) {
      console.error('Error handling row click:', error);
    }
  };

  // Close the message dialog
  const handleCloseMessageDialog = () => {
    setOpenMessageDialog(false);
  };

  // Reply to a message
  const handleReply = (event, message) => {
    event.stopPropagation(); // Prevent row click
    setSelectedAdmin(message.sender); // Auto-fill admin email
    setSubject(`RE: ${message.subject}`); // Pre-fill subject
    setMessage(''); // Clear message for fresh reply
    setOpenDialog(true); // Open compose dialog
  };

  // Pagination control
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Archive functionality
  const handleArchive = async (event, message) => {
    event.stopPropagation(); // Prevents triggering the row click event

    try {
      // Insert the message into MSGARCHIVE table
      const { error: archiveError } = await supabase
        .from('MSGARCHIVE')
        .insert([{
          id: message.id,
          sender: message.sender,
          receiver: message.receiver,
          subject: message.subject,
          message_body: message.message_body,
          is_read: message.is_read,
          sender_type: message.sender_type,
          receiver_type: message.receiver_type,
          created_at: message.created_at
        }]);

      if (archiveError) throw archiveError;

      // Delete the message from MESSAGES table
      const { error: deleteError } = await supabase
        .from('MESSAGES')
        .delete()
        .eq('id', message.id);

      if (deleteError) throw deleteError;

      // Re-fetch messages after archiving
      fetchMessages(email);  // Re-fetch based on tenant email
    } catch (error) {
      console.error('Error archiving message:', error);
    }
  };

  // Unarchive functionality
  const handleUnarchive = async (message) => {
    try {
      // Move the message back to MESSAGES table
      const { error: insertError } = await supabase
        .from('MESSAGES')
        .insert([{
          id: message.id,
          sender: message.sender,
          receiver: message.receiver,
          subject: message.subject,
          message_body: message.message_body,
          is_read: message.is_read,
          sender_type: message.sender_type,
          receiver_type: message.receiver_type,
          created_at: message.created_at
        }]);
  
      if (insertError) throw insertError;
  
      // Remove the message from MSGARCHIVE table
      const { error: deleteError } = await supabase
        .from('MSGARCHIVE')
        .delete()
        .eq('id', message.id);
  
      if (deleteError) throw deleteError;
  
      // Re-fetch archived messages after unarchiving
      const { data: updatedArchivedMessages, error: fetchArchivedError } = await supabase
      .from('MSGARCHIVE')
      .select('*')
      .eq('receiver', email);

    if (fetchArchivedError) throw fetchArchivedError;

    // Sort and set the updated archived messages for the tenant
    setArchivedMessages(updatedArchivedMessages.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    ));
  
    } catch (error) {
      console.error('Error unarchiving message:', error);
    }
  };

  // Delete archived message
  const handleDelete = async (message) => {
    try {
      // Delete the message from MSGARCHIVE table
      const { error: deleteError } = await supabase
        .from('MSGARCHIVE')
        .delete()
        .eq('id', message.id);

      if (deleteError) throw deleteError;

      // Re-fetch archived messages
      fetchArchivedMessages(email);  // Re-fetch based on tenant email
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Open Manage Archive Dialog
  const handleOpenArchiveDialog = () => {
    setOpenArchiveDialog(true);
  };

  // Close Manage Archive Dialog
  const handleCloseArchiveDialog = () => {
    setOpenArchiveDialog(false);
  };

  // Helper function to get admin profile picture or initials
  const getAdminProfilePic = (email) => {
    const admin = adminOptions.find(option => option.value === email);
    return admin ? admin.profilePic : null;
  };

  // Helper function to get initials if no profile picture exists
  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : '';
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
          <div className="Title">Message Inbox</div>

          <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem' }}>
            <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_tenant')} className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
              <IonIcon icon={home} className="breadcrumb-icon" />
              <span>Home</span>
            </Link>
            <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link"sx={{ fontSize: '1.5rem' }}>
              Message Inbox
            </Link>
          </Breadcrumbs>

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'limegreen', color: 'white', fontWeight: 'bold', textTransform: 'none' ,marginTop: '15px;'}}
              startIcon={<EditIcon />}
              onClick={handleDialogOpen}
            >
              Compose
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'teal', color: 'white', fontWeight: 'bold', textTransform: 'none', marginTop: '15px', marginLeft: '10px' }}
              startIcon={<ArchiveOutlinedIcon />} // Archive icon for button
              onClick={handleOpenArchiveDialog}
            >
              Manage Archive
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
                          <TableCell>
                            {!row.is_read ? (
                              <strong><span style={{ color: 'red' }}>New*</span>{" "}</strong>
                            ) : ""}
                            {row.sender}
                          </TableCell>
                          <TableCell>{row.subject}</TableCell>
                          <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <IconButton color="primary" onClick={(event) => handleReply(event, row)}>
                              <ReplyIcon />
                            </IconButton>
                            <IconButton color="secondary" onClick={(event) => handleArchive(event, row)}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {/* Sender's Avatar (Profile Picture or Initials) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
  {/* Sender's Avatar (Profile Picture or Initials) */}
  <Box
    className="box"
    sx={{
      width: { xs: 40, sm: 60, md: 80 }, // Smaller sizes for different breakpoints
    height: { xs: 40, sm: 60, md: 80 }, // Match the width for a square box
    borderRadius: '50%', // Keep it circular
    overflow: 'hidden', // Ensure the image fits within the box
    mr: 1.25, // 10px margin-right
    border: '2px solid #000', // Add a 2px solid black border
    }}
  >
    {selectedMessage && getAdminProfilePic(selectedMessage?.sender) ? (
      <img
        src={getAdminProfilePic(selectedMessage?.sender)}
        alt="Profile Pic"
        style={{
          width: '100%', // Make the image fill the Box's width
          height: '100%', // Make the image fill the Box's height
          objectFit: 'cover', // Ensure the image covers the box while maintaining aspect ratio
        }}
      />
    ) : (
      <Typography variant="h5" style={{ fontWeight: 'bold' }}>
        {getInitials(selectedMessage?.sender)}
      </Typography>
    )}
  </Box>
</Box>


                {/* Sender's Email and Date */}
                <Box>
                  <Typography variant="h6" gutterBottom style={{ fontWeight: 600, marginBottom: 0 }}>
                    {selectedMessage?.sender}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(selectedMessage?.created_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              {selectedMessage && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }}>
                    Message:
                  </Typography>
                  <TextField
                    value={selectedMessage?.message_body || ''}
                    multiline
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiInputBase-input': {
                        fontSize: '1.1rem',
                      },
                    }}
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions style={{ justifyContent: 'space-between' }}>
              {/* Reply Button */}
              <Button
                onClick={(event) => handleReply(event, selectedMessage)}
                color="primary"
                startIcon={<ReplyIcon />}
              >
                Reply
              </Button>
              <Button onClick={handleCloseMessageDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Modal for Archived Messages */}
          <Dialog open={openArchiveDialog} onClose={handleCloseArchiveDialog} maxWidth="md" fullWidth>
            <DialogTitle>Archived Messages</DialogTitle>
            <DialogContent>
              {archivedMessages.length === 0 ? (
                <Typography variant="body1">No Archived Messages</Typography>
              ) : (
                archivedMessages.map((message) => (
                  <Box key={message.id} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => handleArchivedMessageClick(message)}  // Make messages clickable
                  style={{ cursor: 'pointer' }}
                  
                  >

                    <Typography variant="body2" style={{ color: '#007bff' }}>{message.subject}</Typography>
                    <Box>
                      <Tooltip title="Unarchive">
                      <IconButton onClick={(e) => {
                        e.stopPropagation(); // Stop click from propagating to message click handler
                        handleUnarchive(message);
                      }}>
                        <UnarchiveIcon />
                      </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                      <IconButton onClick={(e) => {
                        e.stopPropagation(); // Stop click from propagating to message click handler
                        handleDelete(message);
                      }}>
                        <DeleteIcon />
                      </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseArchiveDialog}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Modal for Viewing Archived Message Details */}
          <Dialog open={openArchivedMessageDialog} onClose={handleCloseArchivedMessageDialog} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
              <IconButton
                aria-label="close"
                onClick={handleCloseArchivedMessageDialog}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {selectedArchivedMessage && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                  <strong>Admin:</strong> {selectedArchivedMessage.sender}
                 </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Subject:</strong> {selectedArchivedMessage.subject}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Message:</strong> {selectedArchivedMessage.message_body}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Sent on: {new Date(selectedArchivedMessage.created_at).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </IonApp>
  );
}

export default MessageT;
