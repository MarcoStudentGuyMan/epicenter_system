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
import {  Modal, Box, Snackbar, TextField } from '@mui/material';
import { format } from 'date-fns';



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
  const [archivedRentInformation, setArchivedRentInformation] = useState([]); // State to hold archived rent information
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);


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
    } else if (restoreType === 'Rent Information') {
      handleRestoreRent(selectedItem.rent_id);
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
    const fetchData = async () => {
        try {
            switch (selectedFilter) {
                case 'Mini Sites':
                    await fetchArchivedMiniSites();
                    break;
                case 'Tenants':
                    await fetchArchivedTenants();
                    break;
                case 'Stalls':
                    await fetchArchivedStalls();
                    break;
                case 'Rent Information':
                    await fetchArchivedRentInformation();
                    break;
                default:
                    return;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

      fetchData();
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

          alert("Minisite Restored Successfully");

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

    alert("Tenant Restored Successfully");

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

// Fetch archived rent information
const fetchArchivedRentInformation = async () => {
  const { data, error } = await supabase
    .from('RENT_INFORMATION')
    .select('*')
    .eq('is_archived', true);

  if (!error) {
    setArchivedRentInformation(data);
  } else {
    console.error('Error fetching archived rent information:', error);
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

    alert("Stall Restored Successfully");

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

  // Handle restore function for Rent Information
const handleRestoreRent = async (rentId) => {
  try {
    const { error } = await supabase
      .from('RENT_INFORMATION')
      .update({ is_archived: false })
      .eq('rent_id', rentId);

    if (!error) {
      setArchivedRentInformation(archivedRentInformation.filter((rent) => rent.rent_id !== rentId));
      alert("Rent Information Restored Successfully");

      // Fetch the manager's last name from local storage session
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

      // Add entry to HISTORY table
      const { error: historyError } = await supabase
        .from('HISTORY')
        .insert([
          {
            Manager_LastName: managerLastName,
            Action_Type: `Restore Rent Information (Rent ID: ${rentId})`,
          },
        ]);

      if (historyError) {
        console.error('Error inserting history record:', historyError);
      } else {
        console.log('History record inserted successfully.');
      }
    } else {
      console.error('Error restoring rent information:', error);
    }
  } catch (error) {
    console.error('Unexpected error during restore operation:', error);
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
    let dataToRender = [];

    if (selectedFilter === 'Mini Sites') {
        dataToRender = archivedMiniSites;
    } else if (selectedFilter === 'Tenants') {
        dataToRender = archivedTenants;
    } else if (selectedFilter === 'Stalls') {
        dataToRender = archivedStalls;
    } else if (selectedFilter === 'Rent Information') {
        dataToRender = archivedRentInformation;
    }

    // Filter based on search query
    const filtered = dataToRender.filter((item) => {
        if (selectedFilter === 'Mini Sites' || selectedFilter === 'Stalls') {
            return item.stall_name?.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (selectedFilter === 'Tenants') {
            return (
                item.ten_FirstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.ten_LastName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        } else if (selectedFilter === 'Rent Information') {
            return item.stall_name?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
    });

    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
        if (selectedFilter === 'Mini Sites') {
            return (
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
            );
        } else if (selectedFilter === 'Tenants') {
            return (
                <TableRow key={row.ten_id}>
                    <TableCell>{row.ten_id}</TableCell>
                    <TableCell>{row.ten_FirstName} {row.ten_LastName}</TableCell>
                    <TableCell>{row.ten_Email}</TableCell>
                    <TableCell>
                        <Button variant="contained" color="primary" onClick={() => handleRestoreTenant(row.ten_id)}>
                            Restore
                        </Button>
                    </TableCell>
                </TableRow>
            );
        } else if (selectedFilter === 'Stalls') {
            return (
                <TableRow key={row.stall_id}>
                    <TableCell>{row.stall_id}</TableCell>
                    <TableCell>{row.s_bus_name}</TableCell>
                    <TableCell>{row.s_desc}</TableCell>
                    <TableCell>
                        <Button variant="contained" color="primary" onClick={() => handleRestoreStall(row.stall_id)}>
                            Restore
                        </Button>
                    </TableCell>
                </TableRow>
            );
        } else if (selectedFilter === 'Rent Information') {
            return (
                <TableRow key={row.rent_id}>
                    <TableCell>{row.rent_id}</TableCell>
                    <TableCell>{row.stall_name}</TableCell>
                    <TableCell>{row.tenant_name || '-'}</TableCell>
                    <TableCell>{row.r_interest || '-'}</TableCell>
                    <TableCell>{row.r_principal || '-'}</TableCell>
                    <TableCell>{row.last_month_paid ? format(new Date(row.last_month_paid), 'MMMM yyyy') : '-'}</TableCell>
                    <TableCell>
                        <Button variant="contained" color="primary" onClick={() => handleRestoreRent(row.rent_id)}>
                            Restore
                        </Button>
                    </TableCell>
                </TableRow>
            );
        }
        return null;
    });
  };

  
  
  const filterData = (query) => {
    let dataToFilter = [];

    if (selectedFilter === 'Mini Sites') {
      dataToFilter = archivedMiniSites;
    } else if (selectedFilter === 'Tenants') {
      dataToFilter = archivedTenants;
    } else if (selectedFilter === 'Stalls') {
      dataToFilter = archivedStalls;
    } else if (selectedFilter === 'Rent Information') {
      dataToFilter = archivedRentInformation;
    }

    const filtered = dataToFilter.filter((item) => {
        if (selectedFilter === 'Mini Sites' || selectedFilter === 'Stalls') {
            return item.stall_name?.toLowerCase().includes(query.toLowerCase());
        } else if (selectedFilter === 'Tenants') {
            return (
                item.ten_FirstName?.toLowerCase().includes(query.toLowerCase()) ||
                item.ten_LastName?.toLowerCase().includes(query.toLowerCase())
            );
        } else if (selectedFilter === 'Rent Information') {
            return item.stall_name?.toLowerCase().includes(query.toLowerCase());
        }
        return false;
    });

    setFilteredData(filtered);
  };



  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterData(query);
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
        <div className="Title">Archive</div>

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
          <div>
            <Paper
              elevation={3}
              sx={{
                padding: '20px',
                backgroundColor: '#002E46',
                borderRadius: '8px',
                marginBottom: '20px',
                marginTop: '20px', // Add this line to create space above the search box
              }}
            >
              <FormGroup
                className="horizontal-checkboxes"
                sx={{
                  backgroundColor: '#002E46',
                  padding: '20px',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column', // Change to column to stack items vertically
                  gap: '10px',
                  width: '100%',
                }}
              >
                <label style={{ color: 'white', fontWeight: 'bold' }}>
                  {`Search ${selectedFilter}`}
                </label>
                <TextField
                  variant="outlined"
                  value={searchQuery}
                  onChange={(event) => handleSearchChange(event)}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    width: '95%', // Adjust the width to your desired size (e.g., 50%)
                    marginBottom: '20px', // Add some space after the search bar
                  }}
                />


                <label style={{ color: 'white', fontWeight: 'bold' }}>Filter By:</label>

                {/* Align checkboxes below the search bar */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        className="small-checkbox"
                        checked={selectedFilter === 'Mini Sites'}
                        onChange={() => setSelectedFilter('Mini Sites')}
                        sx={{ color: 'white' }}
                      />
                    }
                    label={<span style={{ color: 'white' }}>Mini Sites</span>}
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
                    label={<span style={{ color: 'white' }}>Tenants</span>}
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
                    label={<span style={{ color: 'white' }}>Stalls</span>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        className="small-checkbox"
                        checked={selectedFilter === 'Rent Information'}
                        onChange={() => setSelectedFilter('Rent Information')}
                        sx={{ color: 'white' }}
                      />
                    }
                    label={<span style={{ color: 'white' }}>Rent Information</span>}
                  />
                </div>
              </FormGroup>

            </Paper>
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

                    {selectedFilter === 'Rent Information' && (
                      <>
                        <TableCell>Rent ID</TableCell>
                        <TableCell>Stall Name</TableCell>
                        <TableCell>Tenant Name</TableCell>
                        <TableCell>Monthly Rent</TableCell>
                        <TableCell>Principal</TableCell>
                        <TableCell>Last Month Paid</TableCell>
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
                  : selectedFilter === 'Stalls'
                  ? archivedStalls.length
                  : archivedRentInformation.length
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
