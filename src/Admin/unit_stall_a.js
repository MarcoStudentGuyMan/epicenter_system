import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import StallRow from './untiStallRow';
import { Button, Modal, Box, Typography } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const columns = [
  { id: 'unit_id', label: 'Stall Unit ID', minWidth: 100 },
  { id: 'unit_name', label: 'Stall Unit Name', minWidth: 170 },
  { id: 'unit_price', label: 'Stall Unit Price', minWidth: 100 },
  { id: 'unit_status', label: 'Stall Unit Status', minWidth: 150 },
  { id: 'actions', label: 'Actions', minWidth: 170 },
];

export default function UnitStallA() {
  const navigate = useNavigate();
  const { isOpen, toggleDrawer } = useDrawer();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // State for adding a new stall unit
  const [stallUnitName, setStallUnitName] = useState('');
  const [stallUnitPrice, setStallUnitPrice] = useState('');

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const fetchData = async () => {
    try {
      const { data: stallUnits, error } = await supabase
        .from('STALL_UNIT')
        .select('stall_unit_id, stall_unit_name, stall_unit_price, stall_unit_status');

      if (error) {
        console.error('Error fetching stall units:', error);
        return;
      }

      setData(stallUnits);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle adding a new stall unit using your custom logic
  const handleAdd = async () => {
    // Validate inputs
    if (!stallUnitName && !stallUnitPrice) {
      setMessage('Error: Please input the fields');
      setModalOpen(true);
      return;
    } else if (!stallUnitName) {
      setMessage('Error: Please input stall name');
      setModalOpen(true);
      return;
    } else if (!stallUnitPrice) {
      setMessage('Error: Please input stall unit price');
      setModalOpen(true);
      return;
    }

    let stallUnitStatus = 'Not Occupied';

    // Get the user's session and token
    const { data: session } = await supabase.auth.getSession();
    if (session && session.session) {
      const token = session.session.access_token;

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
          const latestId = latestUnit[0].stall_unit_id;
          const idNumber = parseInt(latestId.split('-')[2]);
          newStallUnitId = `STALL-UNIT-${String(idNumber + 1).padStart(3, '0')}`;
        }

        console.log('New Stall Unit ID:', newStallUnitId);

        const { error } = await supabase
          .from('STALL_UNIT')
          .insert([
            {
              stall_unit_id: newStallUnitId,
              stall_unit_name: stallUnitName,
              stall_unit_price: stallUnitPrice,
              stall_unit_status: stallUnitStatus,
            },
          ], {
            headers: { Authorization: `Bearer ${token}` },
            apikey: process.env.REACT_APP_SUPABASE_ANON_KEY,
          });

        if (error) {
          setMessage('Error inserting stall unit');
          console.error(error);
        } else {
          setMessage('Successfully added stall unit');
          // Reset fields after successful insertion
          setStallUnitName('');
          setStallUnitPrice('');

          // Refresh the data without reloading the page
          fetchData();
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setModalOpen(true);
      }
    } else {
      setMessage('No authenticated user found. Please login.');
      setModalOpen(true);
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

      setData(data.filter((item) => item.stall_unit_id !== unitId));
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

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  
  return (
    <div className="app-container">
      <MiniDrawer />
      <Header
                drawerOpen={isOpen}
                handleDrawerToggle={toggleDrawer}
                handleClick={handleClick}
                anchorEl={anchorEl}
                handleClose={handleClose}
                navigate={navigate}
            />   
      <main className="tenantSide-main-content" style={{ marginLeft: isOpen ? 240 : 60, transition: 'margin-left 0.3s' }}>
        <div className="Title"> Stall Unit Maintenance </div>
        <div>
          <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
            <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
              Home
            </Link>
            <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
              Stall Units
            </Link>
          </Breadcrumbs>

          <section className="profile-Align">
            {/* Add Stall Unit Form */}
            <div className="stall-form">
              <div className="form-group"></div>
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

              <div>
                <Button
                  variant="contained"
                  color="success"
                  className="admin-save-button"
                  onClick={handleAdd}
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </div>

            {/* Stall Units Table */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((unit) => (
                        <StallRow
                          key={unit.stall_unit_id}
                          unit_id={unit.stall_unit_id}
                          unit_name={unit.stall_unit_name}
                          unit_price={unit.stall_unit_price.toLocaleString()} // Format with commas
                          unit_status={unit.stall_unit_status === 'Occupied'}
                          handleDelete={handleDelete}
                          navigate={navigate}
                        />
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

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6">{message}</Typography>
          <Button variant="contained" color="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
