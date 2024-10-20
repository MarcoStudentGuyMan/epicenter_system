import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profileA.css';
import '../styles/Layouts.css';
import '../styles/HeaderAdmin.css';
import MiniDrawer from './drawer_admin';
import Header from './header_admin';
import {
  Avatar, Button, TextField, Modal, Box, Typography, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDrawer } from './drawerContext';
import { supabase } from '../supabaseConnect';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function ProfileA() {
  const navigate = useNavigate();
  const { isOpen, toggleDrawer } = useDrawer();
  const [managerData, setManagerData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    newPassword: '',
    confirmPassword: '',
    profilePic: '',
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [managerId, setManagerId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  useEffect(() => {
    const fetchManagerProfile = async () => {
      const storedAdminSession = localStorage.getItem('adminSession');
      if (storedAdminSession) {
        const sessionData = JSON.parse(storedAdminSession);
        const user = sessionData?.user;
        if (!user) {
          alert("No user session found. Please log in.");
          return;
        }

        const { data: managerData, error } = await supabase
          .from('MANAGER')
          .select('*')
          .eq('Manager_Email', user.email)
          .single();

        if (error) {
          console.error('Error fetching manager data:', error);
          return;
        }

        setManagerData({
          firstName: managerData.Manager_FirstName,
          lastName: managerData.Manager_LastName,
          contact: managerData.Contact_Num,
          profilePic: managerData.Manager_Profile_Pic,
        });
        setManagerId(managerData.Manager_id);
      } else {
        alert("No admin session found. Please log in.");
      }
    };

    fetchManagerProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setManagerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Enable the save button if password fields are filled
    if (
      (name === 'newPassword' && value) ||
      (name === 'confirmPassword' && value)
    ) {
      setIsSaveEnabled(true);
    }
  };

  const handleProfilePicChange = (e) => {
    setProfilePicFile(e.target.files[0]);
    setIsSaveEnabled(true); // Enable the save button if a new profile picture is selected
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSave = async () => {
    const { newPassword, confirmPassword } = managerData;

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password don't match.");
      setModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const storedAdminSession = localStorage.getItem('adminSession');
      if (!storedAdminSession) {
        setMessage("No admin session found. Please log in.");
        setModalOpen(true);
        setLoading(false);
        return;
      }
      const session = JSON.parse(storedAdminSession);
      let passwordChanged = false;
      let profilePicChanged = false;

      // Update password if provided
      if (newPassword) {
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (updateError) throw updateError;

        passwordChanged = true;

      // Optional: Update the password field in the MANAGER table
      const { error: managerUpdateError } = await supabase
      .from('MANAGER')
      .update({ Manager_Password: newPassword }) // Ensure this field exists in your table
      .eq('Manager_id', managerId);

  if (managerUpdateError) throw managerUpdateError;




      }

      // Update profile picture if a new one is selected
      if (profilePicFile) {
        const path = `manager-${managerId}/${profilePicFile.name}`;
        const { error: uploadError } = await supabase
          .storage
          .from('manager-profile-pic')
          .upload(path, profilePicFile, { upsert: true });

        if (uploadError) throw uploadError;

        const newProfilePicUrl = supabase
          .storage
          .from('manager-profile-pic')
          .getPublicUrl(path).data.publicUrl;

        const { error: picUpdateError } = await supabase
          .from('MANAGER')
          .update({ Manager_Profile_Pic: newProfilePicUrl })
          .eq('Manager_Email', session.user.email);

        if (picUpdateError) throw picUpdateError;

        setManagerData((prevState) => ({
          ...prevState,
          profilePic: newProfilePicUrl,
        }));

        profilePicChanged = true;
      }

      if (passwordChanged && profilePicChanged) {
        setMessage('Profile and password updated successfully!');
      } else if (passwordChanged) {
        setMessage('Password changed successfully!');
      } else if (profilePicChanged) {
        setMessage('Profile picture changed successfully!');
      } else {
        setMessage('No changes detected.');
      }
    } catch (error) {
      setMessage(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
      setModalOpen(true);
      setIsSaveEnabled(false); // Disable the save button after saving
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    window.location.reload();
  };

  return (
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
      <main className="admin-main-content" style={{ marginLeft: isOpen ? 240 : 60 }}>
        <div className="admin-prof-content">
          <div className="admin-prof-form">
            <h1 style={{ color: 'black' }}>Profile</h1>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="firstName"
              value={managerData.firstName || ''}
              InputProps={{
                readOnly: true,
                style: { backgroundColor: '#f5f5f5' }, // Greyed-out appearance
              }}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="lastName"
              value={managerData.lastName || ''}
              InputProps={{
                readOnly: true,
                style: { backgroundColor: '#f5f5f5' }, // Greyed-out appearance
              }}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
            />
            <TextField
              label="Contact"
              variant="outlined"
              fullWidth
              margin="normal"
              name="contact"
              value={managerData.contact || ''}
              InputProps={{
                readOnly: true,
                style: { backgroundColor: '#f5f5f5' }, // Greyed-out appearance
              }}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
            />
            <TextField
              label="New Password"
              type={showPassword.new ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="normal"
              name="newPassword"
              value={managerData.newPassword || ''}
              onChange={handleInputChange}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility('new')}>
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              type={showPassword.confirm ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="normal"
              name="confirmPassword"
              value={managerData.confirmPassword || ''}
              onChange={handleInputChange}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePasswordVisibility('confirm')}>
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              disabled={!isSaveEnabled || loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>

          <div className="admin-prof-image">
            <Avatar
              alt="User Avatar"
              src={managerData.profilePic || 'path_to_default_image.png'}
              sx={{ width: 150, height: 150 }}
            />
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleProfilePicChange}
            />
            <span>Manager ID: {managerId}</span>
          </div>
        </div>
      </main>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6">{message}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseModal}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ProfileA;
