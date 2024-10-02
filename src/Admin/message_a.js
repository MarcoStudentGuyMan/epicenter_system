import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs, Link, Paper, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Typography, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Button, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import MiniDrawer from './drawer_admin';
import Header from './header_admin';
import { useDrawer } from './drawerContext';
import { supabase } from '../supabaseConnect';
import '../styles/Layouts.css';

export default function Message() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { isOpen, toggleDrawer } = useDrawer();
  const [openDialog, setOpenDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [archivedMessages, setArchivedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stallOptions, setStallOptions] = useState([]);
  const [selectedStall, setSelectedStall] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  

  // Fetch admin email on mount
  useEffect(() => {
    const fetchAdminEmail = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setAdminEmail(user.email);
        }
      } catch (error) {
        console.error('Error fetching admin email:', error);
      }
    };
    fetchAdminEmail();
  }, []);

  // Fetch stalls and tenants for the compose form
  useEffect(() => {
    const fetchStalls = async () => {
      try {
        const { data: stalls, error } = await supabase
          .from('STALL')
          .select('s_bus_name, ten_id, s_logo');

        if (error) throw error;

        const { data: tenants, error: tenantError } = await supabase
          .from('TENANT')
          .select('ten_id, ten_Email');

        if (tenantError) throw tenantError;

        const formattedOptions = stalls.map(stall => {
          const tenant = tenants.find(t => t.ten_id === stall.ten_id);
          return {
            value: stall.s_bus_name,
            email: tenant ? tenant.ten_Email : 'No email found',
            logo: stall.s_logo || null,
          };
        });

        setStallOptions(formattedOptions);
      } catch (error) {
        console.error('Error fetching stalls/tenants:', error);
      }
    };

    fetchStalls();
  }, []);

  // Fetch messages for admin
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('MESSAGES')
          .select('*')
          .eq('receiver_type', 'Admin')
          .eq('receiver', adminEmail); // Filter messages by admin email
  
        if (error) throw error;
  
        setMessages(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))); // Ensure messages are sorted
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
      setLoading(false);
    };
  
    if (adminEmail) {
      fetchMessages(); // Call this only after adminEmail is set
    }
  }, [adminEmail]);

  // Real-time subscription for new messages
  useEffect(() => {
    const messageSubscription = supabase
      .channel('public:MESSAGES')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'MESSAGES' },
        async (payload) => {
          setMessages((prevMessages) => {
            let updatedMessages = prevMessages;

            if (payload.eventType === 'INSERT') {
              const senderDetails = getBusinessInfoFromEmail(payload.new.sender);

              // Check if sender info is available, if not, refetch or skip adding for now
              if (!senderDetails || senderDetails.value === 'Unknown') {
                refetchSenderInfo(payload.new.sender); // Refetch if sender info is missing
              } else {
                updatedMessages = [payload.new, ...prevMessages]; // Insert new message with valid data
              }
            } else if (payload.eventType === 'UPDATE') {
              updatedMessages = prevMessages.map((message) =>
                message.id === payload.new.id ? payload.new : message
              );
            } else if (payload.eventType === 'DELETE') {
              updatedMessages = prevMessages.filter(
                (message) => message.id !== payload.old.id
              );
            }

            return updatedMessages.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, []);

  // Fetch archived messages for admin
  useEffect(() => {
    const fetchArchivedMessages = async () => {
      try {
        const { data: archivedData, error } = await supabase
          .from('MSGARCHIVE')
          .select('*')
          .eq('receiver', adminEmail); // Fetch archived messages for the current admin session only

        if (error) throw error;

        setArchivedMessages(archivedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      } catch (error) {
        console.error('Error fetching archived messages:', error);
      }
    };

    if (adminEmail) {
      fetchArchivedMessages(); // Fetch only when adminEmail is available
    }
  }, [adminEmail]);

  // Real-time subscription for archived messages
  useEffect(() => {
    const archiveSubscription = supabase
      .channel('public:MSGARCHIVE')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'MSGARCHIVE' },
        (payload) => {
          setArchivedMessages((prevArchivedMessages) => {
            let updatedArchivedMessages = prevArchivedMessages;

            if (payload.eventType === 'INSERT') {
              if (payload.new.receiver === adminEmail) {  // Ensure messages for this admin are updated
                updatedArchivedMessages = [payload.new, ...prevArchivedMessages];
              }
            } else if (payload.eventType === 'UPDATE') {
              updatedArchivedMessages = prevArchivedMessages.map((message) =>
                message.id === payload.new.id ? payload.new : message
              );
            } else if (payload.eventType === 'DELETE') {
              updatedArchivedMessages = prevArchivedMessages.filter(
                (message) => message.id !== payload.old.id
              );
            }

            return updatedArchivedMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(archiveSubscription); // Cleanup the subscription
    };
  }, [adminEmail]);

  // Get business name and logo from email
  const getBusinessInfoFromEmail = (email) => {
    const business = stallOptions.find(opt => opt.email === email);
    return business ? { value: business.value, logo: business.logo } : { value: 'Unknown', logo: null };
  };

  // Refetch sender info if missing
  const refetchSenderInfo = async (senderEmail) => {
    try {
      const { data: senderData, error } = await supabase
        .from('STALL')
        .select('s_bus_name')
        .eq('email', senderEmail); 

      if (error) {
        console.error('Error fetching sender info:', error);
        return;
      }

      if (senderData && senderData.length > 0) {
        const senderName = senderData[0].s_bus_name;
        // Update your messages state with this information if necessary
      }
    } catch (err) {
      console.error('Error refetching sender info:', err);
    }
  };

  const handleStallChange = (event) => {
    const selectedOption = stallOptions.find(opt => opt.value === event.target.value);
    setSelectedStall(event.target.value);
    setSelectedEmail(selectedOption?.email || '');
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedStall('');
    setSelectedEmail('');
    setSubject('');
    setMessage('');
  };

  const handleSend = async () => {
    try {
      if (!adminEmail) {
        alert('Unable to fetch admin email.');
        return;
      }

      const { data, error } = await supabase
        .from('MESSAGES')
        .insert([{
          sender: adminEmail,
          receiver: selectedEmail,
          subject,
          message_body: message,
          business_name: selectedStall,
          is_read: false,
          sender_type: 'Admin',
          receiver_type: 'Tenant',
          email: selectedEmail
        }]);

      if (error) throw error;

      alert('Message Sent');

      // Re-fetch messages to show the newly sent message at the top
      const { data: updatedMessages, error: fetchError } = await supabase
        .from('MESSAGES')
        .select('*')
        .eq('receiver_type', 'Admin');

      if (fetchError) throw fetchError;

      setMessages(updatedMessages.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ));

      handleDialogClose();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleRowClick = async (message) => {
    setSelectedMessage(message);
    setOpenMessageDialog(true);

    // Mark message as read in the database
    if (!message.is_read) {
      try {
        await supabase
          .from('MESSAGES')
          .update({ is_read: true })
          .eq('id', message.id);

        // Re-fetch messages to ensure it's reflected on page refresh
        const { data, error } = await supabase
          .from('MESSAGES')
          .select('*')
          .eq('receiver_type', 'Admin');

        if (error) throw error;

        setMessages(data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ));
      } catch (error) {
        console.error('Error updating message as read:', error);
      }
    }
  };

  const handleReply = (event, message) => {
    event.stopPropagation(); // Prevents triggering the row click event
    const selectedBusiness = stallOptions.find(opt => opt.email === message.sender);

    if (selectedBusiness) {
      setSelectedStall(selectedBusiness.value);
      setSelectedEmail(message.sender);
      setSubject(`RE: ${message.subject}`);
      setMessage('');
    }

    setOpenDialog(true);
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

  // Archive Functionality
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
          business_name: message.business_name,
          is_read: message.is_read,
          sender_type: message.sender_type,
          receiver_type: message.receiver_type,
          email: message.email,
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
      const { data: updatedMessages, error: fetchError } = await supabase
        .from('MESSAGES')
        .select('*')
        .eq('receiver_type', 'Admin');

      if (fetchError) throw fetchError;

      setMessages(updatedMessages.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ));
    } catch (error) {
      console.error('Error archiving message:', error);
    }
  };

  // Unarchive Functionality
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
          business_name: message.business_name,
          is_read: message.is_read,
          sender_type: message.sender_type,
          receiver_type: message.receiver_type,
          email: message.email,
          created_at: message.created_at
        }]);

      if (insertError) throw insertError;

      // Remove the message from MSGARCHIVE table
      const { error: deleteError } = await supabase
        .from('MSGARCHIVE')
        .delete()
        .eq('id', message.id);

      if (deleteError) throw deleteError;

      // Re-fetch archived messages
      const { data: updatedArchivedMessages, error: fetchArchivedError } = await supabase
        .from('MSGARCHIVE')
        .select('*');

      if (fetchArchivedError) throw fetchArchivedError;

      setArchivedMessages(updatedArchivedMessages.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ));
    } catch (error) {
      console.error('Error unarchiving message:', error);
    }
  };

  // Delete Functionality
  const handleDelete = async (message) => {
    try {
      // Delete the message from MSGARCHIVE table
      const { error: deleteError } = await supabase
        .from('MSGARCHIVE')
        .delete()
        .eq('id', message.id);

      if (deleteError) throw deleteError;

      // Re-fetch archived messages
      const { data: updatedArchivedMessages, error: fetchArchivedError } = await supabase
        .from('MSGARCHIVE')
        .select('*');

      if (fetchArchivedError) throw fetchArchivedError;

      setArchivedMessages(updatedArchivedMessages.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleOpenArchiveDialog = () => {
    setOpenArchiveDialog(true);
  };

  const handleCloseArchiveDialog = () => {
    setOpenArchiveDialog(false);
  };

  return (
    <div className="app-container">
      <MiniDrawer isOpen={isOpen} onDrawerToggle={toggleDrawer} />
      <Header drawerOpen={isOpen} handleDrawerToggle={toggleDrawer} navigate={navigate} />

      <main
        className="tenantSide-main-content"
        style={{
          marginLeft: isOpen ? 240 : 60,
          transition: 'margin-left 0.3s',
        }}
      >
        <div className="Title">Message Inbox</div>

        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
          <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link">
            <span>Home</span>
          </Link>
          <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link">
            Message Inbox
          </Link>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'limegreen', color: 'white', fontWeight: 'bold', textTransform: 'none', marginTop: '10px' }}
            startIcon={<EditIcon />}
            onClick={handleDialogOpen}
          >
            Compose
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'teal', color: 'white', fontWeight: 'bold', textTransform: 'none', marginTop: '10px', marginLeft: '10px' }}
            startIcon={<ArchiveIcon />}
            onClick={handleOpenArchiveDialog}
          >
            Manage Archive
          </Button>
        </Box>

        {/* Messages Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader aria-label="message inbox">
              <TableHead>
                <TableRow>
                  <TableCell>Business Name</TableCell>
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
                  messages.map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      onClick={() => handleRowClick(row)}
                    >
                      <TableCell>
                        {!row.is_read ? (
                          <strong>
                            <span style={{ color: 'red' }}>New*</span>{" "}
                          </strong>
                        ) : ""}
                        {getBusinessInfoFromEmail(row.sender).value}
                      </TableCell>
                      <TableCell>{row.subject}</TableCell>
                      <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Tooltip title="Reply">
                          <IconButton color="primary" onClick={(event) => handleReply(event, row)}>
                            <ReplyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Archive">
                          <IconButton color="secondary" onClick={(event) => handleArchive(event, row)}>
                            <ArchiveIcon />
                          </IconButton>
                        </Tooltip>
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
              label="Select Business"
              value={selectedStall}
              onChange={handleStallChange}
              fullWidth
              margin="normal"
            >
              {stallOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.value}
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

        {/* Modal for Viewing Full Message Details */}
        <Dialog open={openMessageDialog} onClose={handleCloseMessageDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {/* Stall Logo or First Letter */}
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: '#ccc',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 2,
                }}
              >
                {selectedMessage && getBusinessInfoFromEmail(selectedMessage.sender).logo ? (
                  <img
                    src={getBusinessInfoFromEmail(selectedMessage.sender).logo}
                    alt="Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    {selectedMessage && getBusinessInfoFromEmail(selectedMessage.sender).value.charAt(0)}
                  </Typography>
                )}
              </Box>

              {/* Business Name, Email, and Date */}
              <Box>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 600, marginBottom: 0 }}>
                  {selectedMessage && getBusinessInfoFromEmail(selectedMessage.sender).value}
                </Typography>
                <Typography variant="body2" gutterBottom style={{ marginBottom: 0 }}>
                  {selectedMessage?.sender}
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: 0 }}>
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
                  value={selectedMessage.message_body}
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
              style={{ fontSize: '1rem' }}
              startIcon={<ReplyIcon />}
            >
              Reply
            </Button>
            {/* Close Button */}
            <Button onClick={handleCloseMessageDialog} color="primary" style={{ fontSize: '1rem' }}>
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
                <Box key={message.id} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">{message.subject}</Typography>
                  <Box>
                    <Tooltip title="Unarchive">
                      <IconButton onClick={() => handleUnarchive(message)}>
                        <UnarchiveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(message)}>
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
      </main>
    </div>
  );
}
