import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, IconButton, List, ListItem, ListItemText } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/MiniTemp.module.css';
import { supabase } from '../supabaseConnect';
import logo from '../assets/logo.png';

function MinisiteTemplate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedSection, setSelectedSection] = useState('About Stall');
  const [stallData, setStallData] = useState({});

  useEffect(() => {
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
  }, [id]);

  const handleBack = () => {
    navigate(-1);
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
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" onClick={handleBack}>
          Back
        </Typography>
      </Box>

      <Container maxWidth="lg" className={styles.mainContent}>
        <Grid container spacing={2}>
          {/* Sidebar Menu */}
          <Grid item xs={12} md={3} className={styles.sidebar}>
            <Paper elevation={3} className={styles.sidebarPaper}>
              <Typography variant="h6" gutterBottom>
                Epicenter
              </Typography>
              <List>
                {['About Stall', 'Menu and Best Sellers', 'Pictures of Place', 'Location'].map((section) => (
                  <ListItem button key={section} onClick={() => handleSectionChange(section)}>
                    <ListItemText primary={section} />
                  </ListItem>
                ))}
              </List>
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
                <Paper elevation={3} className={styles.menuContainer}>
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
      <Box className={styles.footer}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} className={styles.footerSection}>
              <Box className={styles.footerLogoSection}>
                <img src={logo} alt="Epicenter Logo" className={styles.footerLogo} />
                <Typography>
                  Epicenter is a food park that is located in San Jose Extension, Dumaguete City, that has 11 food stalls with different varieties of delicacies and cuisines. We are happy to present and showcase the local food that the city of gentle people can make. Stop by at Epicenter to taste a bite of these food that can only be found at the heart of Dumaguete City.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3} className={styles.footerLinks}>
              <Typography variant="h6" gutterBottom>
                Epicenter
              </Typography>
              <List>
                <ListItem button>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Location" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Community" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Join Us" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={6} md={3} className={styles.footerLinks}>
              <Typography variant="h6" gutterBottom>
                Mini Sites
              </Typography>
              <List>
                <ListItem button>
                  <ListItemText primary="Epicenter Stalls" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
}

export default MinisiteTemplate;