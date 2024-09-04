import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { pencil, trash, home } from 'ionicons/icons';
import '../styles/stallA.css'; 
import '../styles/Layouts.css';
import '../styles/HeaderAdmin.css';
import { supabase } from '../supabaseConnect';
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
import { useDrawer } from './drawerContext'; // Use the drawer context

const columns = [
  { id: 'stall_id', label: 'Stall ID', minWidth: 100 },
  { id: 's_bus_name', label: 'Business Name', minWidth: 170 },
  { id: 's_desc', label: 'Description', minWidth: 200 },
  { id: 's_type', label: 'Stall Type', minWidth: 170 },
  { id: 's_logo', label: 'Business Logo', minWidth: 100 },
  { id: 'ten_id', label: 'Tenant ID', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 170 },
];

function createData(stall_id, s_bus_name, s_desc, s_type, s_logo, ten_id, handleDelete, navigate) {
  return {
    stall_id, 
    s_bus_name, 
    s_desc, 
    s_type, 
    s_logo: <img src={s_logo} alt={s_bus_name} style={{ width: '50px', height: '50px' }} />,
    ten_id,
    actions: (
      <>
        <button className="edit" onClick={() => navigate('/editstall_admin')}>
          <IonIcon icon={pencil} className="edit" />
          <span>Edit</span>
        </button>
        <button className="delete" onClick={() => handleDelete(stall_id)}>
          <IonIcon icon={trash} className="delete" />
          <span>Delete</span>
        </button>
      </>
    )
  };
}

export default function StallA() {
  const navigate = useNavigate();
  const [selectedStalls, setSelectedStalls] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { isOpen } = useDrawer(); // Use drawer context
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    const fetchData = async () => {
      const { data: tableData, error } = await supabase
        .from('STALL')
        .select('stall_id, s_bus_name, s_desc, s_type, s_logo, ten_id');
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(tableData.map(item => createData(item.stall_id, item.s_bus_name, item.s_desc, item.s_type, item.s_logo, item.ten_id, handleDelete, navigate)));
        console.log('Fetched data:', tableData); // Log fetched data
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (stallId) => {
    const { error } = await supabase
      .from('STALL')
      .delete()
      .eq('stall_id', stallId);

    if (error) {
      console.error('Error deleting stall:', error);
    } else {
      setData(data.filter((item) => item.stall_id !== stallId));
    }
  };

  const handleStallChange = (selectedOptions) => {
    setSelectedStalls(selectedOptions);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const stallOptions = [
    { value: '1A', label: <span className="black-text">1A</span> },
    { value: '1B', label: <span className="black-text">1B</span> },
    { value: '1C', label: <span className="black-text">1C</span> },
    { value: '1D', label: <span className="black-text">1D</span> },
    { value: '1E', label: <span className="black-text">1E</span> },
    // Add more options as needed
  ];

  return (
    <div className="app-container">
      <MiniDrawer />
      <Header
        drawerOpen={isOpen}
        handleDrawerToggle={() => {}}
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
        <div className="Title">Stalls</div>
        <div>
          <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
            <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link">
              <IonIcon icon={home} className="breadcrumb-icon" />
              <span>Home</span>
            </Link>
            <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link">
              Stalls
            </Link>
          </Breadcrumbs>

          <div className="stall-form">
            <div className="form-group">
              <label>Business Name:</label>
              <input placeholder="Enter Business Name" />
            </div>
            <div className="form-group">
              <label>Business Description:</label>
              <input placeholder="Enter Business Description" />
            </div>
            
            <div className="form-group">
              <label>Tenant ID:</label>
              <select>
                <option value="" disabled selected>Select Tenant ID</option>
                <option>Sample Tenant ID</option>
              </select>
            </div>
            <div className="form-group">
              <label>Stall Type:</label>
              <select>
                <option value="" disabled selected>Select Stall Type</option>
                <option>Cafe and Pastry</option>
                <option>Restaurant and Bar</option>
                <option>Sweets and Desserts</option>
                <option>Groceries</option>
                <option>Others</option>
              </select>
            </div>

            <div className="form-group">
              <label>Stall Unit/s:</label>
              <Select 
                isMulti
                options={stallOptions}
                onChange={handleStallChange}
                value={selectedStalls}
                classNamePrefix="react-select"
              />
            </div>
            <div className="form-group">
              <label>Business Logo:</label>
              <div className="business-logo-field">
                <input type="file" />
                <button>Add</button>
              </div>
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
                        align={column.align}
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
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.stall_id}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
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
        </div>
      </main>
    </div>
  );
}
