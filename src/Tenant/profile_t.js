import React, { useState, useEffect } from 'react';
import TenantLayout from '../Tenant/TenantLayout'; // Import the global layout
import { TextField, Button, Avatar } from '@mui/material';
import { supabase } from '../supabaseConnect'; 
import styles from '../styles/profileT.module.css'; // Import as CSS module
import { IonIcon, IonApp } from '@ionic/react';
import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';

import '../styles/HeaderAdmin.css';
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

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null); // State to handle the image file upload
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchTenantData = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                const userEmail = session?.user?.email;
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
            
            // Upload image if file selected
            if (imageFile) {
                const path = `tenant-${tenantData.tenantId}/${imageFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('tenant-profile-pic')
                    .upload(path, imageFile, { upsert: true });
                
                if (uploadError) throw uploadError;

                const newProfilePicUrl = supabase.storage.from('tenant-profile-pic').getPublicUrl(path).data.publicUrl;
                
                // Update the database with new image URL
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
                    marginLeft: isOpen ? 240 : 60, // Adjust main content margin based on drawer state
                    transition: 'margin-left 0.3s', // Smooth transition for margin change
                }}
            >
            <div className={styles['profile-content']}>
                <div className={styles['profile-form']}>
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
                        className={styles['save-button']}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                    {message && <div>{message}</div>}
                </div>

                {/* Profile Picture and File Upload */}
                <div className={styles['profile-image']}>
                    <Avatar
                        alt="User Avatar"
                        src={tenantData.profilePic}
                        sx={{ width: 150, height: 150 }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={styles['file-upload']}
                    />
                    <span className={styles['tenant-id']}>Tenant ID: {tenantData.tenantId}</span>
                </div>
            </div>
            </main>
        
        </div>
        </IonApp>
    );
}

export default ProfileT;
