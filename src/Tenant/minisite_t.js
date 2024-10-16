import React, { useState, useEffect } from 'react';
import { TextField, Grid, Container, Typography, Box, Button, Paper, InputLabel, Alert, Snackbar, MenuItem, Select, FormControl, Modal, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';
import { useDrawer } from '../Admin/drawerContext';
import { supabase } from '../supabaseConnect';
import styles from '../styles/epicentersiteA.module.css';
import MinisiteTemplate from '../MinisitesTemplate/MinisitesTemplate';

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
        <Typography variant="h2" color="textSecondary" sx={{ fontSize: 40, fontWeight: 'light' }}>
          +
        </Typography>
      )}
    </Box>
  );
}

function MinisiteT() {
  const { isOpen, toggleDrawer } = useDrawer();
  const [tenantId, setTenantId] = useState(null);
  const [stalls, setStalls] = useState([]);
  const [selectedStall, setSelectedStall] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [stallName, setStallName] = useState('');
  const [aboutUs, setAboutUs] = useState('');
  const [backgroundIMG, setBackgroundIMG] = useState(null);
  const [menuImage1, setMenuImage1] = useState(null);
  const [menuImage2, setMenuImage2] = useState(null);
  const [bestSeller1, setBestSeller1] = useState(null);
  const [bestSeller2, setBestSeller2] = useState(null);
  const [placeImage1, setPlaceImage1] = useState(null);
  const [placeImage2, setPlaceImage2] = useState(null);
  const [stallLogo, setStallImage] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);  
  const [open, setOpen] = useState(false); // State to manage modal
  const [anchorEl, setAnchorEl] = useState(null);

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
            .select('ten_id')
            .eq('ten_Email', userEmail)
            .single();

          if (error) throw error;

          setTenantId(data.ten_id);

          const { data: stallsData, error: stallsError } = await supabase
            .from('STALL')
            .select('*')
            .eq('ten_id', data.ten_id);

          if (stallsError) {
            console.error('Error fetching stalls data:', stallsError);
          } else {
            setStalls(stallsData);
          }
        }
      } catch (error) {
        console.error('Error fetching tenant data:', error.message);
      }
    };

    fetchTenantData();
  }, []);

  const handleSelectStall = async (event) => {
    setSelectedStall(event.target.value);
    setShowEditor(true);

    try {
      const { data: miniSiteData, error: miniSiteError } = await supabase
        .from('MINISITES')
        .select('*')
        .eq('stall_name', event.target.value)
        .single();

      if (miniSiteError && miniSiteError.code !== 'PGRST116') {
        console.error('Error fetching MINISITES data:', miniSiteError);
      } else if (miniSiteData) {
        setStallName(miniSiteData.stall_name);
        setAboutUs(miniSiteData.about_us);
        setBackgroundIMG(miniSiteData.bg_img);
        setMenuImage1(miniSiteData.menu_img1);
        setMenuImage2(miniSiteData.menu_img2);
        setBestSeller1(miniSiteData.best_seller1);
        setBestSeller2(miniSiteData.best_seller2);
        setPlaceImage1(miniSiteData.place_img1);
        setPlaceImage2(miniSiteData.place_img2);
        setStallImage(miniSiteData.stall_pic);
      } else {
        setStallName('');
        setAboutUs('');
        setBackgroundIMG(null);
        setMenuImage1(null);
        setMenuImage2(null);
        setBestSeller1(null);
        setBestSeller2(null);
        setPlaceImage1(null);
        setPlaceImage2(null);
        setStallImage(null);
        console.log('No existing mini site data. Tenant can create new content.');
      }
    } catch (error) {
      console.error('Error fetching mini site data:', error.message);
    }
  };

  const handleImageChange = (setImageState, folder, imageField) => async (e) => {
    const file = e.target.files[0];
    if (file) {
      const filePath = `${folder}/${file.name}`;
      console.log(`Uploading ${file.name} to ${filePath}`);

      const { data, error: uploadError } = await supabase.storage
        .from('minisite-stall')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error(`Error uploading ${imageField}:`, uploadError);
        return;
      }

      const { data: urlData, error: urlError } = supabase.storage
        .from('minisite-stall')
        .getPublicUrl(filePath);

      if (urlError) {
        console.error(`Error getting public URL for ${imageField}:`, urlError);
      } else {
        console.log(`Public URL for ${imageField}: `, urlData.publicUrl);
        setImageState(urlData.publicUrl);
      }
    }
  };

  const handleSave = async () => {
    if (!tenantId) {
      setAlertMessage('No tenant ID found. Cannot save data.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    if (!stallName || !aboutUs) {
      setAlertMessage('Required fields are missing. Please fill in all required information.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    const { data, error } = await supabase.from('MINISITES').upsert(
      {
        ten_id: tenantId,
        stall_name: selectedStall,
        about_us: aboutUs,
        bg_img: backgroundIMG,
        menu_img1: menuImage1,
        menu_img2: menuImage2,
        best_seller1: bestSeller1,
        best_seller2: bestSeller2,
        place_img1: placeImage1,
        place_img2: placeImage2,
        stall_pic: stallLogo,
        pending_approval: true,
      },
      { onConflict: ['stall_name'] } 
    );

    if (error) {
      setAlertMessage('Error saving MINISITES data.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
      console.error('Error saving MINISITES data:', error);
    } else {
      setAlertMessage('Successfully saved MINISITES data.');
      setAlertSeverity('success');
      setOpenSnackbar(true);
      console.log('Successfully saved MINISITES data:', data);
    }
  };

  const handleOpenPreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleBack = () => {
    setShowEditor(false);
    setSelectedStall('');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
      />

      <main
        className="editor-pages"
        style={{
          marginLeft: isOpen ? 240 : 60,
          transition: 'margin-left 0.3s',
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 2,
            backgroundColor: '#e0f7fa',
            minHeight: '100vh',
          }}
        >
          <Container maxWidth="md">
            <Paper elevation={2} sx={{ padding: 4, borderRadius: 4 }}>
              {!showEditor ? (
                <>
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
                      },
                    }}
                  >
                    Select a Stall
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id="select-stall-label">Stall</InputLabel>
                    <Select
                      labelId="select-stall-label"
                      value={selectedStall}
                      label="Stall"
                      onChange={handleSelectStall}
                    >
                      {stalls.map((stall) => (
                        <MenuItem key={stall.stall_id} value={stall.s_bus_name}>
                          {stall.s_bus_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              ) : (
                <>
                  <Button onClick={handleBack} variant="outlined" startIcon={<ArrowBackIcon />} sx={{ marginBottom: 2 }}>
                    Back to Stall Selection
                  </Button>
                  <Typography variant="h4" gutterBottom align="center">
                    Mini Site Editor
                  </Typography>

                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Stall Name"
                        name="stall_name"
                        value={stallName}
                        onChange={(e) => setStallName(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="About Us"
                        name="about_us"
                        value={aboutUs}
                        onChange={(e) => setAboutUs(e.target.value)}
                        multiline
                        rows={1}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel>Background Image</InputLabel>
                      <ImageUploadBox
                        image={backgroundIMG}
                        onImageChange={handleImageChange(setBackgroundIMG, 'bg_img', 'bg_img')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel>Menu Image 1</InputLabel>
                      <ImageUploadBox
                        image={menuImage1}
                        onImageChange={handleImageChange(setMenuImage1, 'menu_img', 'menu_img1')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel>Menu Image 2</InputLabel>
                      <ImageUploadBox
                        image={menuImage2}
                        onImageChange={handleImageChange(setMenuImage2, 'menu_img', 'menu_img2')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel>Best Seller 1</InputLabel>
                      <ImageUploadBox
                        image={bestSeller1}
                        onImageChange={handleImageChange(setBestSeller1, 'best_seller', 'best_seller1')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel>Best Seller 2</InputLabel>
                      <ImageUploadBox
                        image={bestSeller2}
                        onImageChange={handleImageChange(setBestSeller2, 'best_seller', 'best_seller2')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel>Place Image 1</InputLabel>
                      <ImageUploadBox
                        image={placeImage1}
                        onImageChange={handleImageChange(setPlaceImage1, 'place_img', 'place_img1')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel>Place Image 2</InputLabel>
                      <ImageUploadBox
                        image={placeImage2}
                        onImageChange={handleImageChange(setPlaceImage2, 'place_img', 'place_img2')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <InputLabel>Stall Logo</InputLabel>
                      <ImageUploadBox
                        image={stallLogo}
                        onImageChange={handleImageChange(setStallImage, 'stall_pic', 'stall_pic')}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Alert
                        severity="info"
                        sx={{
                          backgroundColor: '#e0f7fa', 
                          color: '#00695c',
                          borderRadius: '8px', 
                          padding: '10px',
                          fontSize: '0.9rem',
                        }}
                      >
                        Note: The photos and text will be passed through admin verification. Please make sure that the details you submit are aligned with our community standards.{' '}
                        <Link
                          href="#"
                          onClick={handleOpenModal}
                          sx={{ fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          Community Standards
                        </Link>
                      </Alert>
                    </Grid>

                    {/* Preview Button */}
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleOpenPreview}
                        sx={{ padding: '12px 0', fontSize: 16, borderRadius: 2 }}
                      >
                        Preview Mini Site
                      </Button>
                    </Grid>

                    {/* Save Button */}
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSave}
                        sx={{ padding: '12px 0', fontSize: 16, borderRadius: 2 }}
                      >
                        Save Mini Site
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
            </Paper>
          </Container>
        </Box>
      </main>

      {/* Preview Modal */}
      <Modal open={openPreview} onClose={handleClosePreview}>
        <Box sx={{ width: '80%', height: '80%', margin: 'auto', mt: 4 }}>
          <MinisiteTemplate
            previewData={{
              stall_name: stallName,
              about_us: aboutUs,
              bg_img: backgroundIMG,
              menu_img1: menuImage1,
              menu_img2: menuImage2,
              best_seller1: bestSeller1,
              best_seller2: bestSeller2,
              place_img1: placeImage1,
              place_img2: placeImage2,
              stall_pic: stallLogo,
            }}
            onClose={handleClosePreview}
          />
        </Box>
      </Modal>

      {/* Community Standards Modal */}
      <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="community-standards-title"
  aria-describedby="community-standards-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
      bgcolor: '#f0f4f7',  // Light soothing background
      borderRadius: '10px',
      boxShadow: 24,
      p: 5,
    }}
  >
    <Typography
      id="community-standards-title"
      variant="h4"
      component="h2"
      gutterBottom
      sx={{ textAlign: 'center', fontWeight: 'bold' }}
    >
      Community Standards
    </Typography>
    <Typography
      id="community-standards-description"
      sx={{
        mt: 2,
        lineHeight: '1.8',  // Increase line spacing
        fontSize: '1.1rem',  // Increase font size
        color: '#333',  // Darker text color for contrast
      }}
    >
      To maintain a positive and inclusive environment, all content posted on mini-site stall pages must adhere to our community standards. <strong>Stall owners are expected to ensure that their text, images, and other content are respectful, appropriate, and in compliance with local laws and regulations.</strong> Content that contains offensive language, discriminatory remarks, or explicit material is strictly prohibited.
      <br /><br />
      All images must accurately represent your stall, products, and services without infringing on copyright or intellectual property rights. <strong>Misleading information, false claims, or deceptive practices will not be tolerated.</strong> We reserve the right to review and moderate all content submitted for publication, and any violations of these guidelines may result in the removal of your mini-site or further action.
    </Typography>
    <Button
      onClick={handleCloseModal}
      variant="contained"
      color="warning"
      sx={{
        mt: 4,
        display: 'block',
        mx: 'auto',
        padding: '10px 20px',
        fontSize: '1rem',
      }}
    >
      Close
    </Button>
  </Box>
</Modal>


      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default MinisiteT;
