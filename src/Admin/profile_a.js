import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profileA.css'; // Updated styles
import '../styles/Layouts.css';
import '../styles/HeaderAdmin.css';
import MiniDrawer from './drawer_admin';
import Header from './header_admin';
import { Avatar, Button, TextField, Modal, Box, Typography } from '@mui/material';
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
        password: '',
        profilePic: ''
    });
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [managerId, setManagerId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

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
            [name]: value
        }));
    };

    const handleProfilePicChange = (e) => {
        setProfilePicFile(e.target.files[0]);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const storedAdminSession = localStorage.getItem('adminSession');
            if (!storedAdminSession) {
                alert("No admin session found. Please log in.");
                setLoading(false);
                return;
            }
            const session = JSON.parse(storedAdminSession);
    
            const { error: updateError } = await supabase
                .from('MANAGER')
                .update({
                    Manager_FirstName: managerData.firstName,
                    Manager_LastName: managerData.lastName,
                    Contact_Num: managerData.contact,
                    Manager_Profile_Pic: managerData.profilePic,
                    Manager_Password: managerData.password ? managerData.password : undefined
                })
                .eq('Manager_Email', session.user.email);
    
            if (updateError) throw updateError;
    
            if (managerData.password) {
                const { error: passwordError } = await supabase.auth.updateUser({
                    password: managerData.password
                });
    
                if (passwordError) throw passwordError;
    
                setMessage('Profile and password updated successfully!');
            } else {
                setMessage('Profile updated successfully!');
            }
    
            if (profilePicFile) {
                const path = `manager-${managerId}/${profilePicFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('manager-profile-pic')
                    .upload(path, profilePicFile, { upsert: true });
    
                if (uploadError) throw uploadError;
    
                const newProfilePicUrl = supabase.storage.from('manager-profile-pic').getPublicUrl(path).data.publicUrl;
    
                const { error: picUpdateError } = await supabase
                    .from('MANAGER')
                    .update({ Manager_Profile_Pic: newProfilePicUrl })
                    .eq('Manager_Email', session.user.email);
    
                if (picUpdateError) throw picUpdateError;
    
                setManagerData((prevState) => ({
                    ...prevState,
                    profilePic: newProfilePicUrl
                }));
    
                setMessage('Profile picture updated successfully!');
            }
    
            setModalOpen(true);  // Open modal after successful update
    
        } catch (error) {
            setMessage(`Error updating profile: ${error.message}`);
            setModalOpen(true);  // Open modal on error
        } finally {
            setLoading(false);
        }
    };
    

    const handleCloseModal = () => {
        setModalOpen(false);
        window.location.reload(); // Refresh page on modal close
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
            <main
                className="admin-main-content"
                style={{
                    marginLeft: isOpen ? 240 : 60,
                    transition: 'margin-left 0.3s',
                }}
            >
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
                            onChange={handleInputChange}
                            InputLabelProps={{
                                style: { fontSize: '1.2rem' }  // Increase label font size
                            }}
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="lastName"
                            value={managerData.lastName || ''}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                style: { fontSize: '1.2rem' }  // Increase label font size
                            }}
                        />
                        <TextField
                            label="Contact"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="contact"
                            value={managerData.contact || ''}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                style: { fontSize: '1.2rem' }  // Increase label font size
                            }}
                        />
                        <TextField
                            label="Change Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="password"
                            value={managerData.password || ''}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                style: { fontSize: '1.2rem' }  // Increase label font size
                            }}
                        />
                        <Button
                            variant="contained"
                            color="success"
                            className="admin-save-button"
                            onClick={handleSave}
                            disabled={loading}
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
                            className="admin-file-upload"
                            onChange={handleProfilePicChange}
                            style={{ color: 'black' }}
                        />
                        <span className="admin-manager-id">Manager ID: {managerId}</span>
                    </div>
                </div>
            </main>

            {/* Modal for displaying both success and error messages */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="message-modal-title"
                aria-describedby="message-modal-description"
            >
                <Box
                    sx={{
                        ...modalStyle,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center',
                    }}
                >
                    <Typography id="message-modal-title" variant="h6" component="h2">
                        {message}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCloseModal}
                        sx={{ mt: 2 }}
                    >
                        OK
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default ProfileA;
