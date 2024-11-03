import React, { useState, useEffect } from 'react';
import { TextField, Button, Avatar, Grid, IconButton, InputAdornment, Modal, Box, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { supabase } from '../supabaseConnect';
import styles from '../styles/tenantProfile.module.css'; // Import as CSS module
import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';
import { useDrawer } from '../Admin/drawerContext';
import { useNavigate } from 'react-router-dom';

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

function ProfileT() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer();
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const [tenantData, setTenantData] = useState({
        firstName: '',
        lastName: '',
        contact: '',
        newPassword: '',
        confirmPassword: '',
        profilePic: '',
        tenantId: ''
    });
    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false,
    });
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const [stalls, setStalls] = useState([]);
    const [stallEdits, setStallEdits] = useState({});
    const [isStallSaveEnabled, setIsStallSaveEnabled] = useState({});

    const handleStallChange = (e, stallId) => {
        const { name, value } = e.target;
        setStallEdits((prevState) => ({
            ...prevState,
            [stallId]: {
                ...prevState[stallId],
                [name]: value,
            },
        }));
        setIsStallSaveEnabled((prevState) => ({ ...prevState, [stallId]: true }));
    };

    const handleStallFileChange = (e, stallId) => {
        const file = e.target.files[0];
        setStallEdits((prevState) => ({
            ...prevState,
            [stallId]: {
                ...prevState[stallId],
                imageFile: file,
            },
        }));
        setIsStallSaveEnabled((prevState) => ({ ...prevState, [stallId]: true }));
    };

    useEffect(() => {
        const fetchTenantData = async () => {
            try {
                const storedTenantSession = localStorage.getItem('tenantSession');
                let userEmail = null;

                if (storedTenantSession) {
                    const sessionData = JSON.parse(storedTenantSession);
                    userEmail = sessionData?.user?.email;
                } else {
                    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                    if (sessionError || !sessionData?.session) {
                        throw new Error('Session not found. Please log in.');
                    }
                    userEmail = sessionData.session.user.email;
                }

                if (userEmail) {
                    const { data, error } = await supabase
                        .from('TENANT')
                        .select('ten_FirstName, ten_LastName, ten_ContactNum, ten_ProfilePic, ten_id')
                        .eq('ten_Email', userEmail)
                        .single();

                    if (error) throw error;

                    setTenantData({
                        firstName: data.ten_FirstName,
                        lastName: data.ten_LastName,
                        contact: data.ten_ContactNum || '',
                        profilePic: data.ten_ProfilePic || `${process.env.PUBLIC_URL}/default-avatar.png`,
                        tenantId: data.ten_id,
                    });

                    fetchStalls(data.ten_id);
                }
            } catch (error) {
                console.error('Error fetching tenant data:', error.message);
            }
        };

        const fetchStalls = async (tenantId) => {
            try {
                const { data: stallData, error } = await supabase
                    .from('STALL')
                    .select('stall_id, s_bus_name, s_desc, s_logo')
                    .eq('ten_id', tenantId)
                    .eq('archived', false);

                if (error) throw error;

                setStalls(stallData);
            } catch (error) {
                console.error('Error fetching stalls:', error.message);
            }
        };

        fetchTenantData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTenantData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        if (name === 'newPassword' || name === 'confirmPassword') {
            setIsSaveEnabled(true);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setIsSaveEnabled(true);
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const handleSave = async () => {
        const { newPassword, confirmPassword } = tenantData;

        if (newPassword !== confirmPassword) {
            setMessage("New password and confirm password don't match.");
            setModalOpen(true);
            return;
        }

        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            let passwordChanged = false;
            let profilePicChanged = false;

            // Update password if provided
            if (newPassword) {
                const { error: updateError } = await supabase.auth.updateUser({
                    password: newPassword,
                });
                if (updateError) throw updateError;
                passwordChanged = true;


              // Optional: Update the password field in the TENANT table
              const { error: tenantUpdateError } = await supabase
              .from('TENANT')
              .update({ ten_password: newPassword }) // Ensure this field exists in your table
              .eq('ten_id', tenantData.tenantId);
              
          if (tenantUpdateError) throw tenantUpdateError;





            }

            // Update profile picture if a new one is selected
            if (imageFile) {
                const path = `tenant-${tenantData.tenantId}/${imageFile.name}`;
                const { error: uploadError } = await supabase
                    .storage
                    .from('tenant-profile-pic')
                    .upload(path, imageFile, { upsert: true });

                if (uploadError) throw uploadError;

                const newProfilePicUrl = supabase
                    .storage
                    .from('tenant-profile-pic')
                    .getPublicUrl(path).data.publicUrl;

                const { error: picUpdateError } = await supabase
                    .from('TENANT')
                    .update({ ten_ProfilePic: newProfilePicUrl })
                    .eq('ten_Email', session.user.email);

                if (picUpdateError) throw picUpdateError;

                setTenantData((prevState) => ({
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
                setMessage('Profile picture updated successfully!');
            } else {
                setMessage('No changes detected.');
            }
        } catch (error) {
            setMessage(`Error updating profile: ${error.message}`);
        } finally {
            setLoading(false);
            setModalOpen(true);
            setIsSaveEnabled(false);
        }
    };

    const handleStallSave = async (stall) => {
        const stallId = stall.stall_id;
        const updatedData = stallEdits[stallId];

        if (!updatedData) return;

        setLoading(true);
        try {
            let descriptionChanged = !!updatedData.s_desc;
            let logoChanged = !!updatedData.imageFile;

            // Update stall description
            if (descriptionChanged) {
                const { error: updateError } = await supabase
                    .from('STALL')
                    .update({ s_desc: updatedData.s_desc })
                    .eq('stall_id', stallId);
                if (updateError) throw updateError;
            }

            // If there's a new image, upload it
            if (logoChanged) {
                const path = `stall-${stallId}/${updatedData.imageFile.name}`;
                const { error: uploadError } = await supabase
                    .storage
                    .from('stall-logo')
                    .upload(path, updatedData.imageFile, { upsert: true });
                if (uploadError) throw uploadError;

                const newLogoUrl = supabase
                    .storage
                    .from('stall-logo')
                    .getPublicUrl(path).data.publicUrl;

                const { error: logoUpdateError } = await supabase
                    .from('STALL')
                    .update({ s_logo: newLogoUrl })
                    .eq('stall_id', stallId);

                if (logoUpdateError) throw logoUpdateError;

                setStalls((prevStalls) =>
                    prevStalls.map((s) =>
                        s.stall_id === stallId ? { ...s, s_logo: newLogoUrl } : s
                    )
                );
            }

            if (descriptionChanged && logoChanged) {
                setMessage('Stall description and logo updated successfully!');
            } else if (descriptionChanged) {
                setMessage('Stall description updated successfully!');
            } else if (logoChanged) {
                setMessage('Stall logo updated successfully!');
            } else {
                setMessage('No changes detected in stall.');
            }
        } catch (error) {
            setMessage(`Error updating stall: ${error.message}`);
        } finally {
            setLoading(false);
            setModalOpen(true);
            setIsStallSaveEnabled((prevState) => ({ ...prevState, [stallId]: false }));
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
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
            <main className="tenantSide-main-content" style={{ marginLeft: isOpen ? 240 : 60 }}>
                <div className={styles['prof-content']}>
                    <div className={styles['prof-form']}>
                        <h2>Profile</h2>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="firstName"
                            value={tenantData.firstName}
                            InputProps={{
                                readOnly: true,
                                style: { backgroundColor: '#f5f5f5' },
                            }}
                            InputLabelProps={{ style: { fontSize: '1.2rem' } }}
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="lastName"
                            value={tenantData.lastName}
                            InputProps={{
                                readOnly: true,
                                style: { backgroundColor: '#f5f5f5' },
                            }}
                            InputLabelProps={{ style: { fontSize: '1.2rem' } }}
                        />
                        <TextField
                            label="Contact"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="contact"
                            value={tenantData.contact}
                            InputProps={{
                                readOnly: true,
                                style: { backgroundColor: '#f5f5f5' },
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
                            value={tenantData.newPassword}
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
                            value={tenantData.confirmPassword}
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

                    <div className={styles['prof-image']}>
                        <Avatar
                            alt="User Avatar"
                            src={tenantData.profilePic}
                            sx={{ width: 150, height: 150 }}
                        />
                        <label>Upload Profile</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={styles['file-upload-tenant']}
                        />
                        <span className={styles['tenant-id-tenant']}>Tenant ID: {tenantData.tenantId}</span>
                    </div>
                </div>

                <div className={styles['prof-content']}>
                    <div className={styles['stall-list']}>
                        <h2>Edit Your Stalls</h2>
                        {stalls.length > 0 ? (
                            <ul>
                                {stalls.map(stall => (
                                    <li key={stall.stall_id} style={{ listStyle: 'none', marginBottom: '20px' }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} sm={2}>
                                                <strong>{stall.s_bus_name}</strong>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label="Description"
                                                    variant="outlined"
                                                    fullWidth
                                                    name="s_desc"
                                                    value={stallEdits[stall.stall_id]?.s_desc || ''}
                                                    onChange={(e) => handleStallChange(e, stall.stall_id)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <Avatar
                                                    alt="Stall Logo"
                                                    src={stall.s_logo}
                                                    sx={{ width: 80, height: 80 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <label>Upload Logo</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleStallFileChange(e, stall.stall_id)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleStallSave(stall)}
                                                    disabled={!isStallSaveEnabled[stall.stall_id] || loading}
                                                    style={{
                                                        marginTop: '30px'
                                                    }}
                                                >
                                                    {loading ? 'Saving...' : 'Save Stall'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No stalls associated with this tenant.</p>
                        )}
                    </div>
                </div>
            </main>

            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6">{message}</Typography>
                    <Button variant="contained" color="primary" onClick={handleCloseModal}>
                        OK
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default ProfileT;
