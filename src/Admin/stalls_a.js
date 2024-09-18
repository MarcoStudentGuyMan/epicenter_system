import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { pencil, trash, home } from 'ionicons/icons';
import '../styles/Stall.css'; 
import '../styles/Layouts.css';
import '../styles/HeaderAdmin.css';
import { supabase } from '../supabaseConnect';
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

import CustomButton from '../Component/Buttons';

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
  const logo = s_logo ? <img src={s_logo} alt={s_bus_name} style={{ width: '50px', height: '50px' }} /> : 'No image';
  return {
    stall_id, 
    s_bus_name, 
    s_desc, 
    s_type, 
    s_logo: logo,
    ten_id,
    actions: (
      <>
        <div className="action-buttons">
          <button 
              className="edit-btn" 
              onClick={() => navigate(`/editstall_admin/${stall_id}`)} // Pass stall_id directly here
          >
              <IonIcon icon={pencil} />
              <span>Edit</span>
          </button>
        </div>
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
  const { isOpen } = useDrawer(); 
  const [anchorEl, setAnchorEl] = useState(null);

  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [stallType, setStallType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); 
  const [businessLogo, setBusinessLogo] = useState(null); 
  const [tenantOptions, setTenantOptions] = useState([]); 
  const [stallUnitOptions, setStallUnitOptions] = useState([]); 

  useEffect(() => {
    const fetchTenants = async () => {
      const { data: tenants, error } = await supabase
        .from('TENANT')
        .select('ten_id, ten_FirstName'); // Fetch tenant ID and first name
  
      if (error) {
        console.error('Error fetching tenants:', error);
      } else {
        const tenantOptions = tenants.map(tenant => ({
          value: tenant.ten_id,
          label: `${tenant.ten_id} (${tenant.ten_FirstName})`, // Combine tenant ID and first name
        }));
        setTenantOptions(tenantOptions);
      }
    };
  
    const fetchStallUnits = async () => {
      const { data: stallUnits, error } = await supabase
        .from('STALL_UNIT')
        .select('stall_unit_name')
        .eq('stall_unit_status', 'Not Occupied');  // Filter for Not Occupied units
  
      if (error) {
        console.error('Error fetching stall units:', error);
      } else {
        const unitOptions = stallUnits.map(unit => ({
          value: unit.stall_unit_name,
          label: unit.stall_unit_name,
        }));
        setStallUnitOptions(unitOptions);
      }
    };
  
    fetchTenants();
    fetchStallUnits(); 
  }, []);
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchData = async () => {
    const { data: tableData, error } = await supabase
      .from('STALL')
      .select('stall_id, s_bus_name, s_desc, s_type, s_logo, ten_id');
    if (error) {
      console.error('Error fetching data:', error);
    } else {
      console.log('Fetched data:', tableData); 
      setData(tableData.map(item => createData(item.stall_id, item.s_bus_name, item.s_desc, item.s_type, item.s_logo, item.ten_id, handleDelete, navigate)));
    }
  };

  useEffect(() => {
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setBusinessLogo(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    let logoURL = null; 

    const { data: session } = await supabase.auth.getSession();
    if (session && session.session) {
      const user = session.session.user;
      const token = session.session.access_token;

      if (selectedFile) {
        const timestamp = Date.now(); 
        const fileName = `stall-logo/${timestamp}-${selectedFile.name}`;

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('stall-logo')
          .upload(fileName, selectedFile, {
            headers: { Authorization: `Bearer ${token}` }, 
            apikey: process.env.REACT_APP_SUPABASE_ANON_KEY,
          });

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          alert('Error uploading logo. Please try again.');
          return; 
        } else {
          const { data: publicURLData, error: urlError } = supabase
            .storage
            .from('stall-logo')
            .getPublicUrl(fileName);

          if (urlError) {
            console.error('Error generating public URL:', urlError);
            alert('Error generating public URL for the logo.');
            return;
          }

          logoURL = publicURLData.publicUrl;
          setBusinessLogo(logoURL);
        }
      }

      if (!businessName || !businessDescription || !tenantId || !stallType) {
        alert("Please fill in all required fields: Business Name, Business Description, Tenant ID, and Stall Type.");
        return;
      }

      try {
        const { data: latestStall, error: fetchError } = await supabase
          .from('STALL')
          .select('stall_id')
          .order('stall_id', { ascending: false })
          .limit(1);

        if (fetchError) {
          throw fetchError;
        }

        let newStallId = 'STALL-24-001'; 
        if (latestStall.length > 0) {
          const latestId = latestStall[0].stall_id; 
          const idNumber = parseInt(latestId.split('-')[2]); 
          newStallId = `STALL-24-${String(idNumber + 1).padStart(3, '0')}`; 
        }

        const { error: insertError } = await supabase
          .from('STALL')
          .insert([
            {
              stall_id: newStallId,
              s_bus_name: businessName,
              s_desc: businessDescription,
              s_type: stallType,
              s_logo: logoURL, 
              ten_id: tenantId,
              stall_unit_name: selectedStalls.map(option => option.value).join(', '),
            }
          ]);

        if (insertError) {
          console.error('Error adding stall:', insertError);
          alert('Error adding stall in the table. Please try again.');
        } else {
          alert('Successfully added stall.');
          fetchData(); 

          // Update selected stall units to mark them as "Occupied"
          await updateStallUnitsStatus(selectedStalls.map(option => option.value), 'Occupied');

          setBusinessName('');
          setBusinessDescription('');
          setTenantId('');
          setStallType('');
          setSelectedStalls([]);
          setSelectedFile(null);
          setBusinessLogo(null);
        }
      } catch (error) {
        console.error('Error fetching the latest stall ID:', error);
        alert('Error fetching the latest stall ID. Please try again.');
      }
    } else {
      alert('No authenticated user found. Please log in again.');
    }
  };

  // Function to update the status of stall units
  const updateStallUnitsStatus = async (stallUnits, status) => {
    try {
      const { error } = await supabase
        .from('STALL_UNIT')
        .update({ stall_unit_status: status })
        .in('stall_unit_name', stallUnits);

      if (error) {
        console.error('Error updating stall unit status:', error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

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
          marginLeft: isOpen ? 240 : 60, 
          transition: 'margin-left 0.3s',
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

          <form onSubmit={handleSubmit}>
            <div className="stall-form">
              <div className="form-group">
                <label>Business Name:</label>
                <input
                  placeholder="Enter Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Business Description:</label>
                <input
                  placeholder="Enter Business Description"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Tenant ID:</label>
                <select value={tenantId} onChange={(e) => setTenantId(e.target.value)}>
                  <option value="" disabled>Select Tenant ID</option>
                  {tenantOptions.map(tenant => (
                    <option key={tenant.value} value={tenant.value}>
                      {tenant.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Stall Type:</label>
                <select value={stallType} onChange={(e) => setStallType(e.target.value)}>
                  <option value="" disabled>Select Stall Type</option>
                  <option value="Cafe and Pastry">Cafe and Pastry</option>
                  <option value="Restaurant and Bar">Restaurant and Bar</option>
                  <option value="Sweets and Desserts">Sweets and Desserts</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="form-group">
                <label>Stall Unit/s:</label>
                <Select
                    isMulti
                    options={stallUnitOptions} 
                    onChange={handleStallChange}
                    value={selectedStalls}
                    styles={{
                      option: (provided, state) => ({
                        ...provided,
                        color: state.isSelected ? 'white' : 'black', 
                        backgroundColor: state.isSelected ? '#4caf50' : 'white',
                      }),
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: 'white',
                        color: 'black',
                      }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999, 
                      }),
                    }}
                  />
              </div>

              <div className="form-group">
                <label>Business Logo:</label>
                <div className="business-logo-field">
                  <input type="file" onChange={handleFileChange} />
                </div>
              </div>
              <CustomButton color="primary" variant="contained" type="submit">Add</CustomButton>
            </div>
          </form>

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
