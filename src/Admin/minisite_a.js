import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Modal,
  Box,
  Chip,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { supabase } from '../supabaseConnect';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MiniDrawer from './drawer_admin';
import Header from './header_admin';
import { useDrawer } from './drawerContext';
import MinisiteTemplate from '../MinisitesTemplate/MinisitesTemplate';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useNavigate } from 'react-router-dom';

function MiniSiteA() {
  const navigate = useNavigate();
  const { isOpen, toggleDrawer } = useDrawer();
  const [minisites, setMiniSites] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedMiniSite, setSelectedMiniSite] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedStall, setSelectedStall] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  

  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [stallLocation, setStallLocation] = useState(null);
  const [ManagerId, setManagerId] = useState(null);

  const handleConfirmSave = async () => {
    if (selectedFile && selectedSite) {
      await handleUploadImage(selectedSite, selectedFile);
      setAlertMessage('Image uploaded successfully!');
      setAlertSeverity('success');
    } else {
      setAlertMessage('No file selected or site missing.');
      setAlertSeverity('error');
    }
    setOpenSnackbar(true);
    setOpenConfirmModal(false); // Close the confirmation modal
    setSelectedFile(null);
    setSelectedSite(null);
  };
  

  const handleImageUploadClick = (site) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        setSelectedSite(site);
        setOpenConfirmModal(true); // Open the confirmation modal
      }
    };
    fileInput.click();
  };
  
  

  const handleUploadImage = async (site, file) => {
    if (!file) return;
  
    const filePath = `stall_images/${site.id}/${file.name}`;
    try {
      const { data, error: uploadError } = await supabase.storage
        .from('minisite-stall')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });
  
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        setAlertMessage('Error uploading image.');
        setAlertSeverity('error');
        setOpenSnackbar(true);
        return;
      }
  
      // Get the public URL of the uploaded image
      const { data: urlData, error: urlError } = supabase.storage
        .from('minisite-stall')
        .getPublicUrl(filePath);
  
      if (urlError) {
        console.error('Error getting public URL for the image:', urlError);
        setAlertMessage('Error getting image URL.');
        setAlertSeverity('error');
        setOpenSnackbar(true);
        return;
      }
  
      // Update the image URL in the `stall_pic` field of the `MINISITES` table
      const { error: updateError } = await supabase
        .from('MINISITES')
        .update({ stall_location: urlData.publicUrl })
        .eq('id', site.id);
  
      if (updateError) {
        console.error('Error updating MINISITES with image URL:', updateError);
        setAlertMessage('Error saving image to database.');
        setAlertSeverity('error');
        setOpenSnackbar(true);
        return;
      }
  
      setAlertMessage('Image uploaded and saved successfully!');
      setAlertSeverity('success');
      setOpenSnackbar(true);
      console.log('Image uploaded and URL updated successfully!');
    } catch (error) {
      console.error('Error during image upload:', error);
      setAlertMessage('Unexpected error during upload.');
      setAlertSeverity('error');
      setOpenSnackbar(true);
    }
  };
  


    const handleSelectStall = async (event) => {
    setSelectedStall(event.target.value);
    setShowEditor(true);
    }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  

  const handleBack = () => {
    setShowEditor(false); // Hide the editor
    setSelectedMiniSite(null); // Clear the selected mini-site
  };
  

  useEffect(() => {
    const fetchMiniSites = async () => {
      const { data: minisites, error } = await supabase
        .from('MINISITES')
        .select('*')
        .eq('archived', false) // Fetch only mini-sites where archive is FALSE
        
  
      if (!error) {
        setMiniSites(minisites);
      } else {
        console.error('Error fetching mini-sites:', error.message);
      }
    };
  
    fetchMiniSites();

    // Subscribe to real-time updates for mini-sites
    const subscribeToMiniSites = () => {
      const minisiteSubscription = supabase
        .channel('public:MINISITES')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'MINISITES' }, (payload) => {
          if (payload.new.pending_approval && !payload.new.archived && payload.new.Publish) {
            // Add the new mini-site if it is unpublished
            setMiniSites((prevSites) => [payload.new, ...prevSites]);
          }
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'MINISITES' }, (payload) => {
          setMiniSites((prevSites) => 
            prevSites.map(site => site.id === payload.new.id ? payload.new : site)
          );
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'MINISITES' }, (payload) => {
          setMiniSites((prevSites) => 
            prevSites.filter(site => site.id !== payload.old.id)
          );
        })
        .subscribe();
  
      return () => {
        supabase.removeChannel(minisiteSubscription);  // Clean up subscription
      };
    };

    subscribeToMiniSites();
  }, []);

  const handlePreview = (site) => {
    setSelectedMiniSite(site);
    setOpenPreview(true);
    setShowEditor(false); // Temporarily hide the editor when previewing
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    // Restore the editor state based on whether a site was selected before previewing
    if (selectedMiniSite) {
      setShowEditor(true);
    }
  };

  const handleArchive = async (miniSiteId) => {
    const { error } = await supabase
      .from('MINISITES')
      .update({
        archived: true,  // Archive the mini-site
      })
      .eq('id', miniSiteId);

    if (!error) {
      setMiniSites(minisites.filter((site) => site.id !== miniSiteId));
    }
  };

  const handlePublish = async (miniSiteId, tenId) => {
    try {
      // Fetch current mini-site status to check if it has already been published
      const { data: currentSiteData, error: fetchError } = await supabase
        .from('MINISITES')
        .select('Publish')
        .eq('id', miniSiteId)
        .single();
  
      if (fetchError) {
        console.error('Error fetching mini-site publish status:', fetchError);
        return;
      }
  
      // If the mini-site is already published, skip the notification
      if (currentSiteData.Publish) {
        console.log('Mini-site is already published. Skipping notification.');
        await supabase
          .from('MINISITES')
          .update({ pending_approval: false })  // Just update the approval status
          .eq('id', miniSiteId);
        // Remove the mini-site from the state
        setMiniSites((prevSites) => prevSites.filter(site => site.id !== miniSiteId));
        return;
      }
  
      // Step 1: Publish the mini-site
      const { error: publishError } = await supabase
        .from('MINISITES')
        .update({
          pending_approval: false,
          Publish: true,
        })
        .eq('id', miniSiteId);
  
      if (publishError) {
        console.error('Error publishing mini-site:', publishError);
        return;
      }
  
      // Step 2: Fetch the tenant email based on ten_id
      const { data: tenants, error: tenantError } = await supabase
        .from('TENANT')
        .select('ten_Email')
        .eq('ten_id', tenId);
  
      if (tenantError || !tenants || tenants.length === 0) {
        console.error('Error fetching tenant email or no tenant found:', tenantError);
        return;
      }
  
      const tenantEmail = tenants[0].ten_Email;
  
      // Step 3: Send a notification message to the tenant (only if it's not previously published)
      if (tenantEmail) {
        const { error: messageError } = await supabase
          .from('MESSAGES')
          .insert([{
            sender: 'Epicenter System',
            receiver: tenantEmail,
            subject: 'Mini-site Approved',
            message_body: 'Your mini-site has been approved and published!',
            sender_type: 'system',
            receiver_type: 'Tenant',
            is_read: false,
          }]);
  
        if (messageError) {
          console.error(`Error sending notification to ${tenantEmail}:`, messageError);
        } else {
          console.log(`Notification sent to tenant: ${tenantEmail}`);
        }
      }
  
      // Step 4: Remove the mini-site from the state after publishing
      setMiniSites((prevSites) => prevSites.filter(site => site.id !== miniSiteId));
  
    } catch (error) {
      console.error('Error in handlePublish:', error);
    }
  };

  // Filter unpublished mini-sites
  const unpublishedMiniSites = minisites.filter(site => site.pending_approval);

  return (
    <div className="app-container">
      <MiniDrawer isOpen={isOpen} onDrawerToggle={toggleDrawer} />
      <Header
                drawerOpen={isOpen}
                handleDrawerToggle={toggleDrawer}
                handleClick={handleClick}
                anchorEl={anchorEl}
                handleClose={handleClose}
                navigate={navigate}
            />  

      <main
        style={{
          marginLeft: isOpen ? 240 : 60,
          transition: 'margin-left 0.3s',
        }}
      >
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
          {/* First Section: Unpublished Mini Sites - Show only if there are unpublished mini-sites */}
          {unpublishedMiniSites.length > 0 && (
            <>
          
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Unpublished Mini Sites
              </Typography>

              {unpublishedMiniSites.map((site) => (
                <Card
                  key={site.id}
                  sx={{
                    width: '100%',
                    maxWidth: '600px',
                    margin: '10px 0',
                    border: '1px solid #e0e0e0',
                    boxShadow: 2,
                    '&:hover': { boxShadow: 6 },
                    position: 'relative',
                  }}
                >
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                      {site.stall_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {site.about_us}
                    </Typography>
                  </CardContent>
                  <Chip
                    label="Unpublished"
                    color="warning"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      fontWeight: 'bold',
                    }}
                  />
                  <CardActions sx={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handlePreview(site)}
                      sx={{ borderRadius: '20px', padding: '8px 16px' }}
                    >
                      Preview
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handlePublish(site.id, site.ten_id)}
                      sx={{ borderRadius: '20px', padding: '8px 16px' }}
                    >
                      Accept
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </>
          )}

<Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', marginTop: '40px', fontSize: '2rem' }}>
  List of Minisites
</Typography>

<TableContainer component={Paper} sx={{ width: '100%', maxWidth: '900px', margin: 'auto', borderRadius: '8px', boxShadow: 3,marginBottom: '40px' }}>
  <Table sx={{ minWidth: 650 }} aria-label="minisites table">
    <TableHead>
      <TableRow sx={{ backgroundColor: '#004c75' }}>
        <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '16px', fontSize: '1.25rem' }}>
          Stall Name
        </TableCell>
        <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '16px', fontSize: '1.25rem' }} align="right">
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {minisites.map((site) => (
        <TableRow key={site.id} hover sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
          <TableCell sx={{ padding: '16px', fontWeight: 'bold', fontSize: '1.1rem' }}>
            {site.stall_name}
          </TableCell>
          <TableCell align="right" sx={{ padding: '16px', fontSize: '1.1rem' }}>
          <IconButton
              onClick={() => handleImageUploadClick(site)}
              color="error"
              aria-label="addPhotoAlternateIcon"
            >
              <AddPhotoAlternateIcon />
            </IconButton>


            <IconButton
              onClick={() => handlePreview(site)}
              color="primary"
              aria-label="preview"
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              onClick={() => handleArchive(site.id)}
              color="secondary"
              aria-label="archive"
            >
              <ArchiveIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

        </Container>
      </main>

      {/* Preview Modal */}
      {selectedMiniSite && (
        <Modal open={openPreview} onClose={handleClosePreview}>
          <Box sx={{  position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: '80%', md: '60%' }, // Adjust width for different screen sizes
                        maxHeight: '80vh', // Limit the height to 80% of the viewport
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto', // Make content scrollable when it overflows
                        borderRadius: 2, }}>
            <MinisiteTemplate previewData={selectedMiniSite} />
          </Box>
        </Modal>
      )}



{/* Confirmation Modal */}
<Modal
  open={openConfirmModal}
  onClose={() => setOpenConfirmModal(false)}
  aria-labelledby="confirm-save-modal"
  aria-describedby="confirm-save-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 300,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
      textAlign: 'center',
    }}
  >
    <Typography id="confirm-save-modal" variant="h6" gutterBottom>
      Set as Location?
    </Typography>
    {selectedFile && (
      <Box sx={{ my: 2 }}>
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Selected preview"
          style={{ width: '100%', borderRadius: '8px' }}
        />
      </Box>
    )}
    <Box display="flex" justifyContent="center" gap={2}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleConfirmSave}
      >
        Yes
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setOpenConfirmModal(false)}
      >
        No
      </Button>
    </Box>
  </Box>
</Modal>


<Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={() => setOpenSnackbar(false)}
>
  <Alert onClose={() => setOpenSnackbar(false)} severity={alertSeverity}>
    {alertMessage}
  </Alert>
</Snackbar>


    </div>
  );
}

export default MiniSiteA;
