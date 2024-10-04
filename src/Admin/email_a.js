import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home } from 'ionicons/icons';
import '../styles/unitStall_a.css';  
import '../styles/Layouts.css';
import '../styles/HeaderAdmin.css';
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
import Button from '@mui/material/Button';  // Import Button component
import Header from './header_admin';
import { useDrawer } from './drawerContext'; 

export default function EmailA() {
  const navigate = useNavigate();
  const { isOpen, toggleDrawer } = useDrawer();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(''); // Track selected filter

  // Example data
  const stallsData = [
    { stallId: 1, businessDesc: 'Coffee Shop', stallType: 'Food', logo: 'logo1.png', tenantId: 'T01' },
    { stallId: 2, businessDesc: 'Clothing Store', stallType: 'Retail', logo: 'logo2.png', tenantId: 'T02' },
  ];
  
  const tenantsData = [
    { tenantId: 'T01', firstName: 'John', lastName: 'Doe', contact: '123-456-7890', email: 'john@example.com' },
    { tenantId: 'T02', firstName: 'Jane', lastName: 'Smith', contact: '098-765-4321', email: 'jane@example.com' },
  ];
  
  const miniSitesData = [
    { miniSiteId: 'M01', tenant: 'John Doe', stall: 'Coffee Shop', stallType: 'Food' },
    { miniSiteId: 'M02', tenant: 'Jane Smith', stall: 'Clothing Store', stallType: 'Retail' },
  ];

  const handleCheckboxChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRestore = (row) => {
    // Add your restore logic here
    console.log(`Restored ${row}`);
  };

  const renderTableContent = () => {
    if (selectedFilter === 'Stalls') {
      return stallsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
        <TableRow key={row.stallId}>
          <TableCell>{row.stallId}</TableCell>
          <TableCell>{row.businessDesc}</TableCell>
          <TableCell>{row.stallType}</TableCell>
          <TableCell>{row.logo}</TableCell>
          <TableCell>{row.tenantId}</TableCell>
          <TableCell>
            <Button variant="contained" color="primary" onClick={() => handleRestore(row)}>
              Restore
            </Button>
          </TableCell>
        </TableRow>
      ));
    } else if (selectedFilter === 'Tenants') {
      return tenantsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
        <TableRow key={row.tenantId}>
          <TableCell>{row.tenantId}</TableCell>
          <TableCell>{row.firstName}</TableCell>
          <TableCell>{row.lastName}</TableCell>
          <TableCell>{row.contact}</TableCell>
          <TableCell>{row.email}</TableCell>
          <TableCell>
            <Button variant="contained" color="primary" onClick={() => handleRestore(row)}>
              Restore
            </Button>
          </TableCell>
        </TableRow>
      ));
    } else if (selectedFilter === 'Mini Sites') {
      return miniSitesData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
        <TableRow key={row.miniSiteId}>
          <TableCell>{row.miniSiteId}</TableCell>
          <TableCell>{row.tenant}</TableCell>
          <TableCell>{row.stall}</TableCell>
          <TableCell>{row.stallType}</TableCell>
          <TableCell>
            <Button variant="contained" color="primary" onClick={() => handleRestore(row)}>
              Restore
            </Button>
          </TableCell>
        </TableRow>
      ));
    } else {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">Please select a filter to display data</TableCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="app-container">
      <MiniDrawer isOpen={isOpen} onDrawerToggle={toggleDrawer} />
      <Header
        drawerOpen={isOpen}
        handleDrawerToggle={toggleDrawer}
        handleClick={() => {}}
        anchorEl={anchorEl}
        handleClose={() => {}}
        navigate={navigate}
      />

      <main
        className="tenantSide-main-content"
        style={{
          marginLeft: isOpen ? 240 : 60,
          transition: 'margin-left 0.3s',
        }}
      >

                    <div className="Title">
                      Restore Archive
                    </div>
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem' }} >
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
                      checked={selectedFilter === 'Stalls'}
                      onChange={() => handleCheckboxChange('Stalls')}
                      sx={{ color: 'white' }}
                    />
                  }
                  label="Stalls"
                  classes={{ label: 'checkbox-label' }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      className="small-checkbox"
                      checked={selectedFilter === 'Tenants'}
                      onChange={() => handleCheckboxChange('Tenants')}
                      sx={{ color: 'white' }}
                    />
                  }
                  label="Tenants"
                  classes={{ label: 'checkbox-label' }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      className="small-checkbox"
                      checked={selectedFilter === 'Mini Sites'}
                      onChange={() => handleCheckboxChange('Mini Sites')}
                      sx={{ color: 'white' }}
                    />
                  }
                  label="Mini Sites"
                  classes={{ label: 'checkbox-label' }}
                />
              </FormGroup>
            </div>
          </div>

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="filtered table">
                <TableHead>
                  <TableRow>
                    {selectedFilter === 'Stalls' && (
                      <>
                        <TableCell>Stall ID</TableCell>
                        <TableCell>Business Description</TableCell>
                        <TableCell>Stall Type</TableCell>
                        <TableCell>Logo</TableCell>
                        <TableCell>Tenant ID</TableCell>
                        <TableCell>Action</TableCell> {/* Added Action Column */}
                      </>
                    )}
                    {selectedFilter === 'Tenants' && (
                      <>
                        <TableCell>Tenant ID</TableCell>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Contact Number</TableCell>
                        <TableCell>Email Address</TableCell>
                        <TableCell>Action</TableCell> {/* Added Action Column */}
                      </>
                    )}
                    {selectedFilter === 'Mini Sites' && (
                      <>
                        <TableCell>MiniSite ID</TableCell>
                        <TableCell>Tenant</TableCell>
                        <TableCell>Stall</TableCell>
                        <TableCell>Stall Type</TableCell>
                        <TableCell>Action</TableCell> {/* Added Action Column */}
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
              count={selectedFilter === 'Stalls' ? stallsData.length : selectedFilter === 'Tenants' ? tenantsData.length : miniSitesData.length}
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
