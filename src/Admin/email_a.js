import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { mail, notifications, home, pencil, trash } from 'ionicons/icons';
import '../styles/unitStall_a.css';  
import '../styles/Layouts.css';
import '../styles/HeaderAdmin.css';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly imported
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
import Header from './header_admin';
import { useDrawer } from './drawerContext'; // Import the drawer context

export default function EmailA() {
  const navigate = useNavigate();
  const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  // State to manage checkbox selections
  const [occupiedChecked, setOccupiedChecked] = useState(false);
  const [notOccupiedChecked, setNotOccupiedChecked] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleCheckboxChange = (checkbox) => {
    if (checkbox === 'occupied') {
      setOccupiedChecked(!occupiedChecked);
      if (occupiedChecked) {
        setNotOccupiedChecked(false);
      }
    } else {
      setNotOccupiedChecked(!notOccupiedChecked);
      if (notOccupiedChecked) {
        setOccupiedChecked(false);
      }
    }
  };

  const handleDelete = async (unitId) => {
    // Add your delete logic here
    setData(data.filter((item) => item.unit_id !== unitId));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="app-container">
      <MiniDrawer isOpen={isOpen} onDrawerToggle={toggleDrawer} /> {/* Use context values */}
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
          marginLeft: isOpen ? 240 : 60, // Adjust main content margin based on drawer state
          transition: 'margin-left 0.3s', // Smooth transition for margin change
        }}
      >
        <div className="Title">Archives</div>
        <div>
          <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
            <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link">
              <IonIcon icon={home} className="breadcrumb-icon" />
              <span>Home</span>
            </Link>
            <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link">
              Emails
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
                        checked={occupiedChecked}
                        onChange={() => handleCheckboxChange('occupied')}
                        disabled={!occupiedChecked && notOccupiedChecked}
                        sx={{ color: 'white' }} // Make checkbox white
                      />
                    } 
                    label="MANAGER"
                    classes={{ label: 'checkbox-label' }} // Apply label font size
                  />
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        className="small-checkbox" 
                        checked={notOccupiedChecked}
                        onChange={() => handleCheckboxChange('notOccupied')}
                        disabled={!notOccupiedChecked && occupiedChecked}
                        sx={{ color: 'white' }} // Make checkbox white
                      />
                    } 
                    label="TENANT"
                    classes={{ label: 'checkbox-label' }} // Apply label font size
                  />
                </FormGroup>
              </div>
            </div>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {/* Render column headers if needed */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Render table rows if needed */}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </section>
        </div>
      </main>
    </div>
  );
}
