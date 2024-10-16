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
  IconButton
} from '@mui/material';
import { supabase } from '../supabaseConnect';
import MiniDrawer from './drawer_admin';
import Header from './header_admin';
import { useDrawer } from './drawerContext';
import MinisiteTemplate from '../MinisitesTemplate/MinisitesTemplate';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useNavigate} from 'react-router-dom';

function MiniSiteA() {
  const navigate = useNavigate();
  const { isOpen, toggleDrawer } = useDrawer();
  const [minisites, setMiniSites] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedMiniSite, setSelectedMiniSite] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };
  useEffect(() => {
    const fetchMiniSites = async () => {
      const { data: minisites, error } = await supabase
        .from('MINISITES')
        .select('*')
        .eq('archived', false);  // Fetch only mini-sites where archive is FALSE
  
      if (!error) {
        setMiniSites(minisites);
      } else {
        console.error('Error fetching mini-sites:', error.message);
      }
    };
  
    fetchMiniSites();
  }, []);

  const handlePreview = (site) => {
    setSelectedMiniSite(site);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setSelectedMiniSite(null);
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

  const handlePublish = async (miniSiteId) => {
    const { error } = await supabase
      .from('MINISITES')
      .update({
        pending_approval: false, // Set pending approval to false
        Publish: true, // Ensure it remains published
      })
      .eq('id', miniSiteId);

    if (!error) {
      setMiniSites(minisites.filter((site) => site.id !== miniSiteId));
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
                      onClick={() => handlePublish(site.id)}
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
          <Box sx={{ width: '80%', height: '80%', margin: 'auto', mt: 4 }}>
            <MinisiteTemplate previewData={selectedMiniSite} />
          </Box>
        </Modal>
      )}
    </div>
  );
}

export default MiniSiteA;
