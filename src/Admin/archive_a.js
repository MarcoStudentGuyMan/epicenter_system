import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseConnect'; 
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home } from 'ionicons/icons';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MiniDrawer from './drawer_admin'; 
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Header from './header_admin';
import { useDrawer } from './drawerContext';
import {  Modal, Box, Snackbar } from '@mui/material';


export default function Archive_A() {
  const navigate = useNavigate();
  const { isOpen, toggleDrawer } = useDrawer();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [archivedMiniSites, setArchivedMiniSites] = useState([]); // State to hold archived minisites
  const [archivedTenants, setArchivedTenants] = useState([]); // State to hold archived tenants
  const [archivedStalls, setArchivedStalls] = useState([]); // State to hold archived stalls
  const [selectedFilter, setSelectedFilter] = useState('Mini Sites'); // Track selected filter

  const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');

const [openModal, setOpenModal] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [restoreType, setRestoreType] = useState(''); // To determine what type of content is being restored




  const [anchorEl, setAnchorEl] = React.useState(null);



  const handleOpenModal = (item, type) => {
    setSelectedItem(item);
    setRestoreType(type);
    setOpenModal(true);
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
    setRestoreType('');
  };
  
  const handleConfirmRestore = () => {
    if (restoreType === 'Mini Sites') {
      handleRestoreMiniSite(selectedItem.id);
    } else if (restoreType === 'Tenants') {
      handleRestoreTenant(selectedItem.ten_id);
    } else if (restoreType === 'Stalls') {
      handleRestoreStall(selectedItem.stall_id);
    }
    setOpenModal(false);
    setOpenSnackbar(true);
  };
  
 
  





  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  // Fetch archived minisites on component mount
  useEffect(() => {
    if (selectedFilter === 'Mini Sites') {
      fetchArchivedMiniSites();
    } else if (selectedFilter === 'Tenants') {
      fetchArchivedTenants();
    } else if (selectedFilter === 'Stalls') {
      fetchArchivedStalls();
    }
  }, [selectedFilter]);

  // Fetch archived minisites
  const fetchArchivedMiniSites = async () => {
    const { data, error } = await supabase
      .from('MINISITES')
      .select('*')
      .eq('archived', true); 

    if (!error) {
      setArchivedMiniSites(data);
    } else {
      console.error('Error fetching archived minisites:', error);
    }
  };

  // Fetch archived tenants
  const fetchArchivedTenants = async () => {
    const { data, error } = await supabase
      .from('TENANT')
      .select('*')
      .eq('archived', true); 

    if (!error) {
      setArchivedTenants(data);
    } else {
      console.error('Error fetching archived tenants:', error);
    }
  };

  // Fetch archived stalls
  const fetchArchivedStalls = async () => {
    const { data, error } = await supabase
      .from('STALL')
      .select('*')
      .eq('archived', true); 

    if (!error) {
      setArchivedStalls(data);
    } else {
      console.error('Error fetching archived stalls:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Handle restore function for Mini Sites
  
const handleRestoreMiniSite = async (miniSiteId) => {
  try {
      // Update the minisite to set archived to false
      const { error: restoreError } = await supabase
          .from('MINISITES')
          .update({ archived: false })
          .eq('id', miniSiteId);
         
      if (!restoreError) {
          setArchivedMiniSites(archivedMiniSites.filter((site) => site.id !== miniSiteId));

          // Fetch mini-site details for adding to history
          const { data: miniSiteData, error: fetchError } = await supabase
              .from('MINISITES')
              .select('stall_name')
              .eq('id', miniSiteId)
              .single();

          if (fetchError) {
              console.error('Error fetching mini-site details:', fetchError);
              return;
          }

          // Fetch the manager last name from local storage session
          const storedAdminSession = localStorage.getItem('adminSession');
          if (!storedAdminSession) {
              console.error('No admin session found in localStorage.');
              return;
          }

          const sessionData = JSON.parse(storedAdminSession);
          if (!sessionData || !sessionData.user) {
              console.error('Invalid session data:', sessionData);
              return;
          }

          const user = sessionData.user;
          const { data: managerData, error: managerError } = await supabase
              .from('MANAGER')
              .select('Manager_LastName')
              .eq('Manager_Email', user.email)
              .single();

          if (managerError) {
              console.error('Error fetching manager details:', managerError);
              return;
          }

          const managerLastName = managerData?.Manager_LastName || 'N/A';

          // Insert restore action into HISTORY table
          const { error: historyError } = await supabase
              .from('HISTORY')
              .insert([
                  {
                      Manager_LastName: managerLastName,
                      Action_Type: `Restore mini-site (${miniSiteData.stall_name})`,
                      
                  },
              ]);

          if (historyError) {
              console.error('Error inserting history record:', historyError);
          } else {
              console.log('History record inserted successfully.');
              
          }
      } else {
          console.error('Error restoring minisite:', restoreError);
      }
  } catch (error) {
      console.error('Unexpected error during restore operation:', error);
  }
};



// Handle restore function for Tenants
const handleRestoreTenant = async (tenantId) => {
  const { error } = await supabase
    .from('TENANT')
    .update({ archived: false })
    .eq('ten_id', tenantId);

  if (!error) {
    setArchivedTenants(archivedTenants.filter((tenant) => tenant.ten_id !== tenantId));

    // Fetch manager details from localStorage (assuming admin session is stored here)
    try {
      const storedAdminSession = localStorage.getItem('adminSession');
      if (!storedAdminSession) {
        console.error('No admin session found in localStorage.');
        return;
      }

      const sessionData = JSON.parse(storedAdminSession);
      if (!sessionData || !sessionData.user) {
        console.error('Invalid session data:', sessionData);
        return;
      }

      const user = sessionData.user;
      const { data: managerData, error: managerError } = await supabase
        .from('MANAGER')
        .select('Manager_LastName')
        .eq('Manager_Email', user.email)
        .single();

      if (managerError) {
        console.error('Error fetching manager details:', managerError);
        return;
      }

      const managerLastName = managerData?.Manager_LastName || 'N/A';

      // Fetch tenant details to get tenant name
      const { data: tenantData, error: tenantError } = await supabase
        .from('TENANT')
        .select('ten_FirstName, ten_LastName')
        .eq('ten_id', tenantId)
        .single();

      if (tenantError) {
        console.error('Error fetching tenant details:', tenantError);
        return;
      }

      const tenantName = `${tenantData.ten_FirstName} ${tenantData.ten_LastName}`;

      // Add entry to HISTORY table
      const { error: historyError } = await supabase
        .from('HISTORY')
        .insert([
          {
            Manager_LastName: managerLastName,
            Action_Type: `Restore tenant (${tenantName})`,
          },
        ]);

      if (historyError) {
        console.error('Error inserting history record:', historyError);
      } else {
        console.log('History record inserted successfully.');
      }
    } catch (historyError) {
      console.error('Error adding history entry:', historyError);
    }
  } else {
    console.error('Error restoring tenant:', error);
  }
};


  // Handle restore function for Stalls
const handleRestoreStall = async (stallId) => {
  const { error } = await supabase
    .from('STALL')
    .update({ archived: false })
    .eq('stall_id', stallId);

  if (!error) {
    setArchivedStalls(archivedStalls.filter((stall) => stall.stall_id !== stallId));

    // Fetch manager details from localStorage (assuming admin session is stored here)
    try {
      const storedAdminSession = localStorage.getItem('adminSession');
      if (!storedAdminSession) {
        console.error('No admin session found in localStorage.');
        return;
      }

      const sessionData = JSON.parse(storedAdminSession);
      if (!sessionData || !sessionData.user) {
        console.error('Invalid session data:', sessionData);
        return;
      }

      const user = sessionData.user;
      const { data: managerData, error: managerError } = await supabase
        .from('MANAGER')
        .select('Manager_LastName')
        .eq('Manager_Email', user.email)
        .single();

      if (managerError) {
        console.error('Error fetching manager details:', managerError);
        return;
      }

      const managerLastName = managerData?.Manager_LastName || 'N/A';

      // Fetch stall details to get stall name
      const { data: stallData, error: stallError } = await supabase
        .from('STALL')
        .select('s_bus_name')
        .eq('stall_id', stallId)
        .single();

      if (stallError) {
        console.error('Error fetching stall details:', stallError);
        return;
      }

      const stallName = stallData.s_bus_name;

      // Add entry to HISTORY table
      const { error: historyError } = await supabase
        .from('HISTORY')
        .insert([
          {
            Manager_LastName: managerLastName,
            Action_Type: `Restore stall (${stallName})`,
          },
        ]);

      if (historyError) {
        console.error('Error inserting history record:', historyError);
      } else {
        console.log('History record inserted successfully.');
      }
    } catch (historyError) {
      console.error('Error adding history entry:', historyError);
    }
  } else {
    console.error('Error restoring stall:', error);
  }
};


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const renderTableContent = () => {
    if (selectedFilter === 'Mini Sites') {
      return archivedMiniSites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
        <TableRow key={row.id}>
          <TableCell>{row.id}</TableCell>
          <TableCell>{row.ten_id}</TableCell>
          <TableCell>{row.stall_name}</TableCell>
          <TableCell>
            <Button variant="contained" color="primary" onClick={() => handleRestoreMiniSite(row.id)}>
              Restore
            </Button>
          </TableCell>
        </TableRow>
      ));
    } else if (selectedFilter === 'Tenants') {
      return archivedTenants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tenant) => (
        <TableRow key={tenant.ten_id}>
          <TableCell>{tenant.ten_id}</TableCell>
          <TableCell>{tenant.ten_FirstName} {tenant.ten_LastName}</TableCell>
          <TableCell>{tenant.ten_Email}</TableCell>
          <TableCell>
            <Button variant="contained" color="primary" onClick={() => handleRestoreTenant(tenant.ten_id)}>
              Restore
            </Button>
          </TableCell>
        </TableRow>
      ));
    } else if (selectedFilter === 'Stalls') {
      return archivedStalls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((stall) => (
        <TableRow key={stall.stall_id}>
          <TableCell>{stall.stall_id}</TableCell>
          <TableCell>{stall.s_bus_name}</TableCell>
          <TableCell>{stall.s_desc}</TableCell>
          <TableCell>
            <Button variant="contained" color="primary" onClick={() => handleRestoreStall(stall.stall_id)}>
              Restore
            </Button>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000} // Snackbar will auto-hide after 3 seconds
                onClose={handleCloseSnackbar}
                message="Stall restored successfully"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Adjust position as needed
              />
          </TableCell>
        </TableRow>
      ));
    }
  };


  <Modal
  open={openModal}
  onClose={handleCloseModal}
  aria-labelledby="confirm-restore-modal"
  aria-describedby="confirm-restore-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      bgcolor: 'background.paper',
      p: 4,
      borderRadius: 1,
      boxShadow: 24,
    }}
  >
    <h2 id="confirm-restore-modal">Confirm Restore</h2>
    <p id="confirm-restore-description">Are you sure you want to restore this content?</p>
    <Button variant="contained" color="primary" onClick={handleConfirmRestore}>
      Yes, Restore
    </Button>
    <Button variant="outlined" color="secondary" onClick={handleCloseModal} sx={{ ml: 2 }}>
      Cancel
    </Button>
  </Box>
</Modal>




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
        className="tenantSide-main-content"
        style={{
          marginLeft: isOpen ? 240 : 60,
          transition: 'margin-left 0.3s',
        }}
      >
        <div className="Title">Restore Archive</div>

        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem' }}>
          <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
            <IonIcon icon={home} className="breadcrumb-icon" />
            <span>Home</span>
          </Link>
          <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
            Archive
          </Link>
        </Breadcrumbs>

        <section className="profile-Align">
          <div className="stall-form">
            <div className="form-group">
              <FormGroup className="horizontal-checkboxes">
                <label>Filter By:</label>
                <FormControlLabel
                  control={
                    <Checkbox
                      className="small-checkbox"
                      checked={selectedFilter === 'Mini Sites'}
                      onChange={() => setSelectedFilter('Mini Sites')}
                      sx={{ color: 'white' }}
                    />
                  }
                  label="Mini Sites"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      className="small-checkbox"
                      checked={selectedFilter === 'Tenants'}
                      onChange={() => setSelectedFilter('Tenants')}
                      sx={{ color: 'white' }}
                    />
                  }
                  label="Tenants"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      className="small-checkbox"
                      checked={selectedFilter === 'Stalls'}
                      onChange={() => setSelectedFilter('Stalls')}
                      sx={{ color: 'white' }}
                    />
                  }
                  label="Stalls"
                />
              </FormGroup>
            </div>
          </div>

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="archived table">
                <TableHead>
                  <TableRow>
                    {selectedFilter === 'Mini Sites' && (
                      <>
                        <TableCell>MiniSite ID</TableCell>
                        <TableCell>Tenant ID</TableCell>
                        <TableCell>Stall Name</TableCell>
                        <TableCell>Action</TableCell>
                      </>
                    )}
                    {selectedFilter === 'Tenants' && (
                      <>
                        <TableCell>Tenant ID</TableCell>
                        <TableCell>Tenant Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Action</TableCell>
                      </>
                    )}
                    {selectedFilter === 'Stalls' && (
                      <>
                        <TableCell>Stall ID</TableCell>
                        <TableCell>Business Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Action</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderTableContent()}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={
                selectedFilter === 'Mini Sites'
                  ? archivedMiniSites.length
                  : selectedFilter === 'Tenants'
                  ? archivedTenants.length
                  : archivedStalls.length
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </section>
      </main>
    </div>
  );
}
