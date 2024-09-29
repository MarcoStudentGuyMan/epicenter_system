import React, { useState, useEffect } from 'react';
import { TextField, Button, Avatar } from '@mui/material';
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

    useEffect(() => {
        const fetchTenantData = async () => {
            try {
                // Check if there's a tenant session in localStorage
                const storedTenantSession = localStorage.getItem('tenantSession');
                let userEmail = null;
    
                if (storedTenantSession) {
                    const sessionData = JSON.parse(storedTenantSession);
                    userEmail = sessionData?.user?.email;
                } else {
                    // Fall back to Supabase session if localStorage is empty
                    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                    if (sessionError || !sessionData?.session) {
                        throw new Error('Session not found. Please log in.');
                    }
                    userEmail = sessionData.session.user.email;
                }
    
                if (userEmail) {
                    // Fetch tenant data based on email
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
                }
            } catch (error) {
                console.error('Error fetching tenant data:', error.message);
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

    return (
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
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={styles['file-upload-tenant']}
                        />
                        <span className={styles['tenant-id-tenant']}>Tenant ID: {tenantData.tenantId}</span>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProfileT;