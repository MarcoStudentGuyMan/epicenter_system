import React, { useState, useEffect } from 'react';
import { TextField, Grid, Container, Typography, Box, Button, Paper, InputLabel, Snackbar, Alert } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import MiniDrawer from './drawer_admin';
import { useNavigate } from 'react-router-dom';
import Header from './header_admin';
import { useDrawer } from './drawerContext';
import { supabase } from '../supabaseConnect';
import styles from '../styles/epicentersiteA.module.css';

function ImageUploadBox({ onImageChange, image }) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 200,
                height: 120,
                border: '2px dashed #ccc',
                borderRadius: 2,
                cursor: 'pointer',
                position: 'relative',
                backgroundImage: image ? `url(${image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                    backgroundColor: '#f0f0f0',
                },
            }}
        >
            <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                }}
            />
            {!image && (
                <Typography
                    variant="h2"
                    color="textSecondary"
                    sx={{ fontSize: 40, fontWeight: 'light' }}
                >
                    +
                </Typography>
            )}
        </Box>
    );
}

function EpicenterA() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer();
    const [description, setDescription] = useState('');
    const [caption, setCaption] = useState('');
    const [images, setImages] = useState({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        image6: null,
    });
    const [imageFiles, setImageFiles] = useState({});
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [isModified, setIsModified] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
        setAnchorEl(null);
    };

    const imageLabels = {
        image1: 'Homepage',
        image2: 'Location Background',
        image3: '1st Location',
        image4: '2nd Location',
        image5: 'Join Us Background',
        image6: 'Community Background',
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from('EPICENTERSITE').select('*').single();
            if (error && error.code === 'PGRST116') {
                console.log('No data found, initializing with default values');
                setDescription('');
                setCaption('');
                setImages({
                    image1: null,
                    image2: null,
                    image3: null,
                    image4: null,
                    image5: null,
                    image6: null,
                });
            } else if (data) {
                setDescription(data.About_Us || '');
                setCaption(data.Caption_text || '');
                setImages({
                    image1: data.Home_bg || null,
                    image2: data.Location_bg || null,
                    image3: data['1st_Location'] || null,
                    image4: data['2nd_Location'] || null,
                    image5: data.JoinUs_bg || null,
                    image6: data.Community_bg || null,
                });
            } else if (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleImageChange = (imageKey) => (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImages((prevImages) => ({ ...prevImages, [imageKey]: previewUrl }));
            setImageFiles((prevFiles) => ({ ...prevFiles, [imageKey]: file }));
            setIsModified(true); // Mark as modified when an image is changed
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        setIsModified(true); // Mark as modified when description changes
    };

    const handleCaptionChange = (e) => {
        setCaption(e.target.value);
        setIsModified(true); // Mark as modified when caption changes
    };

    const handleSubmit = async () => {
        setLoading(true);
        setUploading(true);
    
        const updatedImages = { ...images };
        for (const [key, file] of Object.entries(imageFiles)) {
            if (file) {
                // Create a unique path using a timestamp
                const timestamp = Date.now(); // Get the current timestamp in milliseconds
                const uniqueFileName = `${timestamp}-${file.name}`;
                const path = `${uniqueFileName}`;
                const { error } = await supabase.storage.from('Epicenter-site').upload(path, file);
                if (error) {
                    setAlertMessage(`Failed to upload ${key}`);
                    setAlertSeverity('error');
                    setOpenSnackbar(true);
                    setLoading(false);
                    setUploading(false);
                    return;
                }
    
                const publicUrl = supabase.storage.from('Epicenter-site').getPublicUrl(path).data.publicUrl;
                updatedImages[key] = publicUrl;
            }
        }
    
        setUploading(false);
    
        const { data, error } = await supabase.from('EPICENTERSITE').select('*').single();
        if (!data) {
            const { insertError } = await supabase.from('EPICENTERSITE').insert({
                About_Us: description,
                Caption_text: caption,
                Home_bg: updatedImages.image1,
                Location_bg: updatedImages.image2,
                '1st_Location': updatedImages.image3,
                '2nd_Location': updatedImages.image4,
                JoinUs_bg: updatedImages.image5,
                Community_bg: updatedImages.image6,
            });
            if (insertError) {
                setAlertMessage('Error inserting new data');
                setAlertSeverity('error');
            } else {
                setAlertMessage('Data inserted successfully');
                setAlertSeverity('success');
            }
        } else {
            const { error: updateError } = await supabase.from('EPICENTERSITE').update({
                About_Us: description,
                Caption_text: caption,
                Home_bg: updatedImages.image1,
                Location_bg: updatedImages.image2,
                '1st_Location': updatedImages.image3,
                '2nd_Location': updatedImages.image4,
                JoinUs_bg: updatedImages.image5,
                Community_bg: updatedImages.image6,
            }).eq('id', 1);
    
            if (updateError) {
                setAlertMessage('Error updating data');
                setAlertSeverity('error');
            } else {
                setAlertMessage('Data updated successfully');
                setAlertSeverity('success');
            }
        }
    
        setIsModified(false); // Reset modified state after saving
        setOpenSnackbar(true);
        setLoading(false);
    };
    
    return (
        <div className={styles.appContainer}>
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
            className="editor-pages"
            style={{
            marginLeft: isOpen ? 240 : 60,
            transition: 'margin-left 0.3s',
          }}>
            <Box component="main" sx={{ flexGrow: 1, padding: 2, backgroundColor: '#e0f7fa', minHeight: '100vh' }}>
                <Container maxWidth="md">
                    <Paper elevation={2} sx={{ padding: 4, borderRadius: 4 }}>
                        <Typography
                            variant="h4"
                            gutterBottom
                            align="center"
                            sx={{
                                fontSize: {
                                    xs: '1.5rem',
                                    sm: '2rem',
                                    md: '2.5rem',
                                    lg: '3rem',
                                    pb: '1.5rem'
                                },
                            }}
                        >
                            Epicenter Site Editor
                        </Typography>
                       
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Edit Caption"
                                   
                                    value={caption}
                                    onChange={handleCaptionChange}
                                    multiline
                                    rows={1}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Edit About Us"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    multiline
                                    rows={1}
                                    variant="outlined"
                                />
                            </Grid>
                            
                            {Object.entries(images).map(([key, value]) => (
                                <Grid item xs={12} sm={6} key={key}>
                                    <InputLabel>{imageLabels[key]} (Click to edit)</InputLabel>
                                    <ImageUploadBox
                                        image={value}
                                        onImageChange={handleImageChange(key)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <div style={{ marginTop: '10px' }}>
                            {uploading && <LinearProgress />} 
                        </div>
                        <Box mt={4} display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                fullWidth
                                disabled={!isModified || loading} // Disable if not modified or while loading
                            >
                                Save
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
            </main>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default EpicenterA;
