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

export default function Archive_A() {
  const navigate = useNavigate();
  const { isOpen, toggleDrawer } = useDrawer();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [archivedMiniSites, setArchivedMiniSites] = useState([]); // State to hold archived minisites
  const [archivedTenants, setArchivedTenants] = useState([]); // State to hold archived tenants
  const [selectedFilter, setSelectedFilter] = useState('Mini Sites'); // Track selected filter

  const [anchorEl, setAnchorEl] = React.useState(null);

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
    }
  }, [selectedFilter]);

  // Fetch archived minisites
  const fetchArchivedMiniSites = async () => {
    const { data, error } = await supabase
      .from('MINISITES')
      .select('*')
      .eq('archived', true); // Fetch only archived minisites

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
      .eq('archived', true); // Fetch only archived tenants

    if (!error) {
      setArchivedTenants(data);
    } else {
      console.error('Error fetching archived tenants:', error);
    }
  };

  // Handle restore function for Mini Sites
  const handleRestoreMiniSite = async (miniSiteId) => {
    const { error } = await supabase
      .from('MINISITES')
      .update({ archived: false }) // Restore by setting archived to false
      .eq('id', miniSiteId);

    if (!error) {
      setArchivedMiniSites(archivedMiniSites.filter((site) => site.id !== miniSiteId));
    } else {
      console.error('Error restoring minisite:', error);
    }
  };

  // Handle restore function for Tenants
  const handleRestoreTenant = async (tenantId) => {
    const { error } = await supabase
      .from('TENANT')
      .update({ archived: false }) // Restore by setting archived to false
      .eq('ten_id', tenantId);

    if (!error) {
      setArchivedTenants(archivedTenants.filter((tenant) => tenant.ten_id !== tenantId));
    } else {
      console.error('Error restoring tenant:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Render content based on selected filter
  const renderTableContent = () => {
    if (selectedFilter === 'Mini Sites') {
      return archivedMiniSites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
        <TableRow key={row.id}>
          <TableCell>{row.id}</TableCell> {/* MiniSite ID */}
          <TableCell>{row.ten_id}</TableCell> {/* Tenant ID */}
          <TableCell>{row.stall_name}</TableCell> {/* Stall Name */}
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
          <TableCell>{tenant.ten_id}</TableCell> {/* Tenant ID */}
          <TableCell>{tenant.ten_FirstName} {tenant.ten_LastName}</TableCell> {/* Tenant Name */}
          <TableCell>{tenant.ten_Email}</TableCell> {/* Tenant Email */}
          <TableCell>
            <Button variant="contained" color="primary" onClick={() => handleRestoreTenant(tenant.ten_id)}>
              Restore
            </Button>
          </TableCell>
        </TableRow>
      ));
    }
  };

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
              count={selectedFilter === 'Mini Sites' ? archivedMiniSites.length : archivedTenants.length}
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
