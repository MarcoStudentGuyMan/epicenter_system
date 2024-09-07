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
  const [anchorEl, setAnchorEl] = useState(null);

  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [stallType, setStallType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // State for the logo file
  const [businessLogo, setBusinessLogo] = useState(null); // To store the URL of the uploaded logo
  const [tenantOptions, setTenantOptions] = useState([]); // State to store tenant options
  const [stallUnitOptions, setStallUnitOptions] = useState([]); // State for stall unit options

  // Fetch tenant data to populate tenant dropdown
  useEffect(() => {
    const fetchTenants = async () => {
      const { data: tenants, error } = await supabase
        .from('TENANT')
        .select('ten_id');

      if (error) {
        console.error('Error fetching tenants:', error);
      } else {
        // Map tenants to be used in the dropdown
        const tenantOptions = tenants.map(tenant => ({
          value: tenant.ten_id,
          label: tenant.ten_id,
        }));
        setTenantOptions(tenantOptions);
      }
    };

    const fetchStallUnits = async () => {
      // Fetch stall units from the database
      const { data: stallUnits, error } = await supabase
        .from('STALL_UNIT')
        .select('stall_unit_name');

      if (error) {
        console.error('Error fetching stall units:', error);
      } else {
        // Map stall unit names to options for the Select dropdown
        const unitOptions = stallUnits.map(unit => ({
          value: unit.stall_unit_name,
          label: unit.stall_unit_name,
        }));
        setStallUnitOptions(unitOptions);
      }
    };

    fetchTenants();
    fetchStallUnits(); // Fetch stall units for the dropdown
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
      console.log('Fetched data:', tableData); // Log the fetched data
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
    e.preventDefault(); // Prevent page reload

    let logoURL = null; // Fallback if no logo is uploaded

    // Get the user's session and token
    const { data: session } = await supabase.auth.getSession();
    if (session && session.session) {
      const user = session.session.user;
      const token = session.session.access_token;

      // Upload the file if one is selected
      if (selectedFile) {
        const timestamp = Date.now(); // Get current timestamp

        // Create a unique filename with Date.now() to avoid conflicts
        const fileName = `stall-logo/${timestamp}-${selectedFile.name}`;

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('stall-logo')
          .upload(fileName, selectedFile, {
            headers: { Authorization: `Bearer ${token}` }, // Token for authorization
            apikey: process.env.REACT_APP_SUPABASE_ANON_KEY,
          });

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          alert('Error uploading logo. Please try again.');
          return; // Exit function if file upload fails
        } else {
          // Get the public URL for the uploaded file
          const { data: publicURLData, error: urlError } = supabase
            .storage
            .from('stall-logo')
            .getPublicUrl(fileName);

          if (urlError) {
            console.error('Error generating public URL:', urlError);
            alert('Error generating public URL for the logo.');
            return;
          }

          // Set the logo URL
          logoURL = publicURLData.publicUrl;
          setBusinessLogo(logoURL);

          console.log('Logo uploaded successfully with public URL:', logoURL);
        }
      }

      // Ensure there is a valid tenant ID
      if (!tenantId) {
        alert('Please select a valid tenant.');
        return;
      }

      // Fetch the latest stall ID to generate the next one
      try {
        const { data: latestStall, error: fetchError } = await supabase
          .from('STALL')
          .select('stall_id')
          .order('stall_id', { ascending: false })
          .limit(1);

        if (fetchError) {
          throw fetchError;
        }

        let newStallId = 'STALL-24-001'; // Default stall ID if none exists
        if (latestStall.length > 0) {
          const latestId = latestStall[0].stall_id; // Example format: STALL-24-001
          const idNumber = parseInt(latestId.split('-')[2]); // Extract the number part
          newStallId = `STALL-24-${String(idNumber + 1).padStart(3, '0')}`; // Increment and format
        }

        // Insert the stall data after file upload
        const { error: insertError } = await supabase
          .from('STALL')
          .insert([
            {
              stall_id: newStallId,
              s_bus_name: businessName,
              s_desc: businessDescription,
              s_type: stallType,
              s_logo: logoURL, // If no file is uploaded, this will be NULL
              ten_id: tenantId,
              stall_unit_name: selectedStalls.map(option => option.value).join(', '),
            }
          ]);

        if (insertError) {
          console.error('Error adding stall:', insertError);
          alert('Error adding stall in the table. Please try again.');
        } else {
          alert('Successfully added stall.');
          fetchData(); // Refresh the table after insertion

          // Reset form fields
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
                  options={stallUnitOptions} // Use the fetched stall unit options
                  onChange={handleStallChange}
                  value={selectedStalls}
                />
              </div>

              <div className="form-group">
                <label>Business Logo:</label>
                <div className="business-logo-field">
                  <input type="file" onChange={handleFileChange} />
                  <button type="submit">Add</button>
                </div>
              </div>
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
