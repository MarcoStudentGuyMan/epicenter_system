import React, { useState, useEffect } from 'react';
import { TextField, Button, Avatar, Grid } from '@mui/material';
import { supabase } from '../supabaseConnect';
import styles from '../styles/tenantProfile.module.css'; // Import as CSS module
import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';
import { useDrawer } from '../Admin/drawerContext';
import { useNavigate } from 'react-router-dom';

function ProfileT() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer();
    const [tenantData, setTenantData] = useState({
        firstName: '',
        lastName: '',
        contact: '',
        password: '',
        profilePic: '',
        tenantId: ''
    });

    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState('');
    const [stalls, setStalls] = useState([]); // State to hold stall data
    const [stallEdits, setStallEdits] = useState({}); // State for editable fields


    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleStallChange = (e, stallId) => {
        const { name, value } = e.target;
        setStallEdits((prevState) => ({
            ...prevState,
            [stallId]: {
                ...prevState[stallId],
                [name]: value, 
            },
        }));
    };
    

    
    
    const handleStallFileChange = (e, stallId) => {
        const file = e.target.files[0];
        setStallEdits((prevState) => ({
            ...prevState,
            [stallId]: {
                ...prevState[stallId],
                imageFile: file,
            }
        }));
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
                        password: '',
                        profilePic: data.ten_ProfilePic || `${process.env.PUBLIC_URL}/default-avatar.png`,
                        tenantId: data.ten_id
                    });

                    // Fetch associated stalls after tenant data is retrieved
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
                    .select('stall_id, s_bus_name, s_desc, s_logo, stall_unit_name')
                    .eq('ten_id', tenantId)
                    .eq('archived',false)

                if (error) throw error;

                setStalls(stallData); // Set stalls to the state
            } catch (error) {
                console.error('Error fetching stalls:', error.message);
            }
        };

        fetchTenantData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTenantData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const { error: updateError } = await supabase
                .from('TENANT')
                .update({
                    ten_FirstName: tenantData.firstName,
                    ten_LastName: tenantData.lastName,
                    ten_ContactNum: tenantData.contact,
                    ten_password: tenantData.password ? tenantData.password : undefined
                })
                .eq('ten_Email', session.user.email);

            if (updateError) throw updateError;

            if (tenantData.password) {
                const { error: passwordError } = await supabase.auth.updateUser({
                    password: tenantData.password
                });
                if (passwordError) throw passwordError;

                setMessage('Profile and password updated successfully!');
            } else {
                setMessage('Profile updated successfully!');
            }

            if (imageFile) {
                const path = `tenant-${tenantData.tenantId}/${imageFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('tenant-profile-pic')
                    .upload(path, imageFile, { upsert: true });

                if (uploadError) throw uploadError;

                const newProfilePicUrl = supabase.storage.from('tenant-profile-pic').getPublicUrl(path).data.publicUrl;

                const { error: picUpdateError } = await supabase
                    .from('TENANT')
                    .update({ ten_ProfilePic: newProfilePicUrl })
                    .eq('ten_Email', session.user.email);

                if (picUpdateError) throw picUpdateError;

                setTenantData((prevState) => ({
                    ...prevState,
                    profilePic: newProfilePicUrl
                }));

                setMessage('Profile picture updated successfully!');
            }

        } catch (error) {
            setMessage(`Error updating profile: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    const handleStallSave = async (stall) => {
        const stallId = stall.stall_id;
        const updatedData = stallEdits[stallId];
    
        if (!updatedData) return;
    
        setLoading(true);
        try {
            // Update stall description
            const { error: updateError } = await supabase
                .from('STALL')
                .update({
                    s_desc: updatedData.s_desc,
                })
                .eq('stall_id', stallId);
    
            if (updateError) throw updateError;
    
            // If there's a new image, upload it
            if (updatedData.imageFile) {
                const path = `stall-${stallId}/${updatedData.imageFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('stall-logo')
                    .upload(path, updatedData.imageFile, { upsert: true });
    
                if (uploadError) throw uploadError;
    
                const newLogoUrl = supabase.storage.from('stall-logo').getPublicUrl(path).data.publicUrl;
    
                // Update the stall logo in the database
                const { error: logoUpdateError } = await supabase
                    .from('STALL')
                    .update({ s_logo: newLogoUrl })
                    .eq('stall_id', stallId);
    
                if (logoUpdateError) throw logoUpdateError;
    
                // Update the UI with the new logo
                setStalls((prevStalls) =>
                    prevStalls.map((s) =>
                        s.stall_id === stallId ? { ...s, s_logo: newLogoUrl } : s
                    )
                );
            }
    
            setMessage('Stall updated successfully!');
        } catch (error) {
            setMessage(`Error updating stall: ${error.message}`);
        } finally {
            setLoading(false);
        }
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
                className="tenantSide-main-content"
                style={{
                    marginLeft: isOpen ? 240 : 60,
                    transition: 'margin-left 0.3s',
                }}
            >
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
                            onChange={handleChange}
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="lastName"
                            value={tenantData.lastName}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Contact"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="contact"
                            value={tenantData.contact}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Change Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="password"
                            value={tenantData.password}
                            onChange={handleChange}
                        />
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSave}
                            className={styles['save-button-tenant']}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                        {message && <div>{message}</div>}
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
                            style={{ color: 'black' }}
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
                                style={{ display: 'block', marginTop: '8px', color: 'black' }}
                             
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => handleStallSave(stall)}
                                disabled={loading}
                                style={{ display: 'flex', marginTop: '25px'}}
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
        </div>

    );
}

export default ProfileT;
