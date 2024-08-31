import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { mail, notifications, home, pencil, trash } from 'ionicons/icons';
import '../styles/unitStall_a.css';  
import '../styles/Layouts.css';
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

const columns = [
  { id: 'unit_id', label: 'Stall Unit ID', minWidth: 100 },
  { id: 'unit_name', label: 'Stall Unit Name', minWidth: 170 },
  { id: 'unit_price', label: 'Stall Unit Price', minWidth: 100 },
  { id: 'unit_status', label: 'Stall Unit Status', minWidth: 150 },
  { id: 'actions', label: 'Actions', minWidth: 170 },
];

function createData(unit_id, unit_name, unit_price, unit_status, handleDelete, navigate) {
  return {
    unit_id, 
    unit_name, 
    unit_price, 
    unit_status: unit_status ? "Occupied" : "Not Occupied",
    actions: (
      <>
        <button className="edit" onClick={() => navigate('/edit_unit_stall_admin')}>
          <IonIcon icon={pencil} className="edit" />
          <span>Edit</span>
        </button>
        <button className="delete" onClick={() => handleDelete(unit_id)}>
          <IonIcon icon={trash} className="delete" />
          <span>Delete</span>
        </button>
      </>
    )
  };
}

export default function UnitStallA() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);

  // State to manage checkbox selections
  const [occupiedChecked, setOccupiedChecked] = useState(false);
  const [notOccupiedChecked, setNotOccupiedChecked] = useState(false);

  // Handle checkbox change
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

  useEffect(() => {
    // Fetch your stall units data here and set it to `data`
    const fetchData = async () => {
      // Example data, replace with your data fetching logic
      const exampleData = [
        createData(1000, 'Unit A', 5000, true, handleDelete, navigate),
        createData(1001, 'Unit B', 4500, false, handleDelete, navigate),
        // Add more data as needed
      ];

      setData(exampleData);
    };

    fetchData();
  }, []);

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
      <MiniDrawer onDrawerToggle={(isOpen) => setDrawerOpen(isOpen)} />
      <header
        className="tenantSide-header"
        style={{
          marginLeft: drawerOpen ? 240 : 60, // Adjust header margin based on drawer state
          transition: 'margin-left 0.3s', // Smooth transition for margin change
        }}
      >
        <div className="header-left">
          <a onClick={() => navigate('/dashboard_admin')}>
            <img className="logo-nav" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
          </a>
          <span className="app-name">Epicenter</span>
        </div>
        <div className="header-right">
          <a onClick={() => navigate('/email_admin')}>
            <IonIcon icon={mail} className="icon" />
          </a>
          <IonIcon icon={notifications} className="icon" />
        </div>
      </header>

      <main
        className="tenantSide-main-content"
        style={{
          marginLeft: drawerOpen ? 240 : 60, // Adjust main content margin based on drawer state
          transition: 'margin-left 0.3s', // Smooth transition for margin change
        }}
      >
        <div className="Title">Stall Units</div>
        <div className="page-container">
          <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
            <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link">
              <IonIcon icon={home} className="breadcrumb-icon" />
              <span>Home</span>
            </Link>
            <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link">
              Stall Units
            </Link>
          </Breadcrumbs>

          <section className="profile-Align">
            <div className="stall-form">
              <div className="form-group">
                <label>Stall Unit Status:</label>
                <FormGroup className="horizontal-checkboxes">
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
                    label="OCCUPIED"
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
                    label="NOT OCCUPIED"
                    classes={{ label: 'checkbox-label' }} // Apply label font size
                  />
                </FormGroup>
              </div>
              <div className="form-group">
                <label>Stall Unit Name: </label>
                <input placeholder="Enter Stall Unit Name" />
              </div>
              <div className="form-group">
                <label>Stall Unit Price: </label>
                <input type="number" placeholder="Enter Stall Unit Price" />
              </div>
              <div className="form-group">
                <label>Stall ID:</label>
                <select>
                  <option value="" disabled selected>Select Stall ID</option>
                  <option>Sample Stall ID </option>
                </select>
              </div>
              <div className="form-group">
                <button>Add</button>
              </div>
            </div>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.unit_id}>
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id}>
                                {value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
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
