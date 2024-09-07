import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home, pencil, trash } from 'ionicons/icons';
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
import Header from './header_admin';
import { useDrawer } from './drawerContext'; 
import { supabase } from '../supabaseConnect'; 

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
  const { isOpen, toggleDrawer } = useDrawer();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);

  // Add states for input fields
  const [stallUnitName, setStallUnitName] = useState('');
  const [stallUnitPrice, setStallUnitPrice] = useState('');
  const [occupiedChecked, setOccupiedChecked] = useState(false);
  const [notOccupiedChecked, setNotOccupiedChecked] = useState(false);

  // Fetch stall units data from the database
  const fetchData = async () => {
    try {
      const { data: stallUnits, error } = await supabase
        .from('STALL_UNIT')
        .select('stall_unit_id, stall_unit_name, stall_unit_price, stall_unit_status');
      
      if (error) {
        console.error('Error fetching stall units:', error);
        return;
      }

      const mappedData = stallUnits.map(unit => 
        createData(
          unit.stall_unit_id,
          unit.stall_unit_name,
          unit.stall_unit_price,
          unit.stall_unit_status === 'Occupied',
          handleDelete,
          navigate
        )
      );

      setData(mappedData); 
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  const handleAdd = async () => {
    let stallUnitStatus = occupiedChecked ? 'Occupied' : 'Not Occupied';
  
    // Get the user's session and token
    const { data: session } = await supabase.auth.getSession();
    if (session && session.session) {
      const token = session.session.access_token;
  
      // Fetch the latest stall_unit_id to generate the next one
      try {
        const { data: latestUnit, error: fetchError } = await supabase
          .from('STALL_UNIT')
          .select('stall_unit_id')
          .order('stall_unit_id', { ascending: false })
          .limit(1);
  
        if (fetchError) {
          throw fetchError;
        }
  
        let newStallUnitId = 'STALL-UNIT-001'; // Default stall unit ID if none exists
        if (latestUnit.length > 0) {
          const latestId = latestUnit[0].stall_unit_id; // Example format: STALL-UNIT-001
          const idNumber = parseInt(latestId.split('-')[2]); // Extract the number part
          newStallUnitId = `STALL-UNIT-${String(idNumber + 1).padStart(3, '0')}`; // Increment and format
        }
  
        console.log("New Stall Unit ID:", newStallUnitId);
  
        // Insert the stall unit data
        const { error } = await supabase
          .from('STALL_UNIT')
          .insert([
            {
              stall_unit_id: newStallUnitId, // New unique stall unit ID
              stall_unit_name: stallUnitName,
              stall_unit_price: stallUnitPrice,
              stall_unit_status: stallUnitStatus
            }
          ], {
            headers: { Authorization: `Bearer ${token}` }, // Token for authorization
            apikey: process.env.REACT_APP_SUPABASE_ANON_KEY
          });
  
        if (error) {
          alert('Error inserting stall unit');
          console.error(error);
        } else {
          alert('Successfully added stall unit');
          // Reset fields after successful insertion
          setStallUnitName('');
          setStallUnitPrice('');
          setOccupiedChecked(false);
          setNotOccupiedChecked(false);
          fetchData(); // Refresh the table
        }
  
      } catch (err) {
        console.error('Error:', err);
      }
  
    } else {
      alert("No authenticated user found. Please login.");
    }
  };
  

  const handleDelete = async (unitId) => {
    try {
      const { error } = await supabase
        .from('STALL_UNIT')
        .delete()
        .eq('stall_unit_id', unitId);

      if (error) {
        console.error('Error deleting unit:', error);
        return;
      }

      setData(data.filter((item) => item.unit_id !== unitId));
    } catch (err) {
      console.error('Error deleting unit:', err);
    }
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
      <MiniDrawer />
      <Header
        drawerOpen={isOpen}
        handleDrawerToggle={toggleDrawer}
        navigate={navigate}
      />
      <main className="tenantSide-main-content">
        <div className="Title">Stall Units</div>
        <div>
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
                        onChange={() => setOccupiedChecked(!occupiedChecked)}
                        disabled={!occupiedChecked && notOccupiedChecked}
                      />
                    }
                    label="OCCUPIED"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        className="small-checkbox"
                        checked={notOccupiedChecked}
                        onChange={() => setNotOccupiedChecked(!notOccupiedChecked)}
                        disabled={!notOccupiedChecked && occupiedChecked}
                      />
                    }
                    label="NOT OCCUPIED"
                  />
                </FormGroup>
              </div>
              <div className="form-group">
                <label>Stall Unit Name:</label>
                <input
                  placeholder="Enter Stall Unit Name"
                  value={stallUnitName}
                  onChange={(e) => setStallUnitName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Stall Unit Price:</label>
                <input
                  type="number"
                  placeholder="Enter Stall Unit Price"
                  value={stallUnitPrice}
                  onChange={(e) => setStallUnitPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <button onClick={handleAdd}>Add</button>
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
