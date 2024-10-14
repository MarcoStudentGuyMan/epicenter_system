import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, IconButton, List, ListItem, ListItemText } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/MiniTemp.module.css';
import { supabase } from '../supabaseConnect';
import Footer from '../Homepage/footer';


function MinisiteTemplate({ previewData, onClose }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedSection, setSelectedSection] = useState('About Stall');
  const [stallData, setStallData] = useState({});

  useEffect(() => {
    if (previewData) {
      setStallData(previewData);  // Use preview data if passed
    } else {
      const fetchStallData = async () => {
        try {
          const { data, error } = await supabase
            .from('MINISITES')
            .select('*')
            .eq('id', id)
            .single();
  
          if (error) throw error;
  
          setStallData(data);
        } catch (error) {
          console.error('Error fetching stall data:', error);
        }
      };
      fetchStallData();
    }
  }, [id, previewData]);

  const handleBack = () => {
    if (onClose) {
      onClose();  // Close the modal when onClose function is provided
    } else {
      navigate(-1);  // Go back if in normal navigation mode
    }
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  return (
    <div
      className={styles.appContainer}
      style={{
        backgroundImage: stallData?.bg_img ? `url(${stallData.bg_img})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Navigation Section */}
      <Box className={`${styles.navigation} ${styles.transparentBackground}`}>
        <IconButton onClick={handleBack}style={{ color: 'white' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" onClick={handleBack}style={{ color: 'white' }} >
          Back
        </Typography>
      </Box>

      <Container maxWidth="lg" className={styles.mainContent}>
        <Grid container spacing={2}>
          {/* Sidebar Menu */}
          <Grid item xs={12} md={3} className={styles.sidebar}>
            <Paper elevation={3} className={styles.sidebarPaper}>
            <div className={styles.sidebarFiller}>
        
              <Typography variant="h4" gutterBottom>
              <img src={stallData.stall_pic} alt={`${stallData.stall_name} picture`} className={styles.stallPic} />
               <div  align="center">
                {stallData?.stall_name || 'stallName'}
                </div>
              </Typography>
   
              <List>
                {['About Stall', 'Menu and Best Sellers', 'Pictures of Place', 'Location'].map((section) => (
                  <ListItem button key={section} onClick={() => handleSectionChange(section)}>
                    <ListItemText primary={section} />
                  </ListItem>
                ))}
              </List>
              </div>
            </Paper>
         
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} md={9} className={styles.contentArea}>
            <Box className={styles.sectionContent}>
              {selectedSection === 'About Stall' && (
                <Paper elevation={3} className={styles.aboutUsContainer}>
                  <Typography variant="h5" gutterBottom>
                    About Us
                  </Typography>
                  <Typography>{stallData?.about_us || 'No description available.'}</Typography>
                </Paper>
              )}
              {selectedSection === 'Menu and Best Sellers' && (
                <Paper elevation={3} className={styles.aboutUsContainer}>
                  <Typography variant="h5" gutterBottom>
                    Menu
                  </Typography>
                  <div className={styles.imageGallery}>
                    {stallData?.menu_img1 && <img src={stallData.menu_img1} alt="Menu item 1" className={styles.galleryImage} />}
                    {stallData?.menu_img2 && <img src={stallData.menu_img2} alt="Menu item 2" className={styles.galleryImage} />}
                  </div>
                  <Typography variant="h5" gutterBottom>
                    Best Sellers
                  </Typography>
                  <div className={styles.imageGallery}>
                    {stallData?.best_seller1 && <img src={stallData.best_seller1} alt="Best seller 1" className={styles.galleryImage} />}
                    {stallData?.best_seller2 && <img src={stallData.best_seller2} alt="Best seller 2" className={styles.galleryImage} />}
                  </div>
                </Paper>
              )}
              {selectedSection === 'Pictures of Place' && (
                <Paper elevation={3} className={styles.aboutUsContainer}>
                  <Typography variant="h5" gutterBottom>
                    Pictures of Place
                  </Typography>
                  <div className={styles.imageGallery}>
                    {stallData?.place_img1 && <img src={stallData.place_img1} alt="Place image 1" className={styles.galleryImage} />}
                    {stallData?.place_img2 && <img src={stallData.place_img2} alt="Place image 2" className={styles.galleryImage} />}
                  </div>
                </Paper>
              )}
              {selectedSection === 'Location' && (
                <Paper elevation={3} className={styles.aboutUsContainer}>
                  <Typography variant="h5" gutterBottom>
                    Location
                  </Typography>
                  <Typography>Display location information here...</Typography>
                </Paper>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer Section */}
      <Footer/>
  
    </div>
  );
}

export default MinisiteTemplate;