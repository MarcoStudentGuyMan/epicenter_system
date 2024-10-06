import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { home } from 'ionicons/icons';
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly imported
import CustomButton from '../Component/Buttons';
import Header from './header_admin';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { supabase } from '../supabaseConnect';  // Ensure admin import for deletion
import { useDrawer } from './drawerContext';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function EditStallA() {
    const navigate = useNavigate();
    const { stall_id } = useParams();
    const { isOpen, toggleDrawer } = useDrawer();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);

    const [stall, setStall] = useState({
        s_bus_name: '',
        s_desc: '',
        s_logo: '',  // The logo URL
    });

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Fetch the stall data
    useEffect(() => {
        const fetchStall = async () => {
            try {
                const { data, error } = await supabase
                    .from('STALL')
                    .select('*')
                    .eq('stall_id', stall_id)
                    .single();

                if (error) {
                    console.error('Error fetching stall:', error);
                } else {
                    setStall(data);
                    console.log('Stall data fetched:', data);
                }
            } catch (err) {
                console.error('Error fetching stall data:', err);
            }
        };

        if (stall_id) {
            fetchStall();
        }
    }, [stall_id]);

    // Handle the input changes for the fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStall((prevStall) => ({
            ...prevStall,
            [name]: value,
        }));
    };

    // Handle logo upload
    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const { data, error } = await supabase.storage
            .from('stall-logo')
            .upload(`stall-logo/${stall_id}`, file);

        if (error) {
            console.error('Error uploading logo:', error);
        } else {
            const publicURL = supabase.storage
                .from('stall-logo')
                .getPublicUrl(`stall-logo/${stall_id}`).data.publicUrl;
            setStall((prevStall) => ({ ...prevStall, s_logo: publicURL }));
        }
    };

   // Handle saving stall updates
const handleSave = async () => {
    console.log("Saving stall data:", stall);  // Debugging output

    try {
        const { data, error } = await supabase
            .from('STALL')
            .update({
                s_bus_name: stall.s_bus_name,
                s_desc: stall.s_desc,
                s_logo: stall.s_logo || null, // Ensure logo is properly handled
            })
            .eq('stall_id', stall_id);

        if (error) {
            console.error('Error saving stall:', error);
            alert("Failed to update stall. Please try again.");
        } else {
            // Confirm success and navigate to the stall list
            console.log("Stall successfully updated:", data);
            setSaveDialogOpen(true);
            
        }
    } catch (err) {
        console.error('Error during stall save:', err);
        alert("An error occurred while updating the stall.");
    }
};


    // Handle archiving the stall
    const handleArchive = async () => {
        try {
            const { error } = await supabase
                .from('STALL')
                .delete()
                .eq('stall_id', stall_id);

            if (error) {
                console.error('Error archiving stall:', error);
            } else {
                navigate('/stall_admin');
            }
        } catch (err) {
            console.error('Error during stall archive:', err);
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

            <main className="tenantSide-main-content" style={{ marginLeft: isOpen ? 240 : 60, transition: 'margin-left 0.3s' }}>
                <div className="Title">Edit Stall Information</div>

                <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem' }}>
                    <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
                        <IonIcon icon={home} className="breadcrumb-icon" />
                        <span>Home</span>
                    </Link>
                    <Link underline="hover" color="text.primary" onClick={() => navigate('/stall_admin')} className="breadcrumb-link"sx={{ fontSize: '1.5rem' }}> 
                        Stalls
                    </Link>
                    <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link">
                        Edit Stall
                    </Link>
                </Breadcrumbs>

                <section className="profileA-align">
                    <div className="noButtons">
                        <li>
                            <label>Business Name:</label>
                            <input
                                className="for-input"
                                name="s_bus_name"
                                placeholder="Enter Business Name"
                                value={stall.s_bus_name}
                                size="30"
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Business Description:</label>
                            <input
                                className="for-input"
                                name="s_desc"
                                placeholder="Enter Business Description"
                                value={stall.s_desc}
                                size="30"
                                onChange={handleInputChange}
                                
                            />
                        </li>
                    </div>

                    <div className="profile-image">
                        <img className="user-profile" src={stall.s_logo} alt="Stall Logo" />
                        <p>Stall ID: {stall_id}</p>
                        <input type="file"  accept=".jpg,.jpeg,.png" onChange={handleLogoUpload}     style={{ color: 'black', marginLeft:'30%'}}  />
                    </div>

                    <div className="buttons">
                        <CustomButton color="primary" variant="contained" onClick={handleSave}>Save</CustomButton>
                        <CustomButton color="error" variant="contained" onClick={() => setDeleteDialogOpen(true)}>Archive</CustomButton>
                        <CustomButton color="warning" variant="contained" onClick={() => navigate('/stall_admin')}>Cancel</CustomButton>
                    </div>
                </section>
            </main>
           {/* Save Success Modal */}
                   <Modal open={saveDialogOpen} onClose={() => {
                    setSaveDialogOpen(false);
                    navigate('/stall_admin'); // Redirect after closing the modal
                  }}>
                   <Box sx={modalStyle}>
                   <Typography variant="h6" component="h2">Successfully Updated</Typography>
                   <CustomButton onClick={() => navigate('/stall_admin')} color="primary">OK</CustomButton>
                  </Box>
                 </Modal>


            {/* Archive Confirmation Modal */}
            <Modal open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">Are you sure you want to archive this stall?</Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <CustomButton onClick={handleArchive} color="error">Archive</CustomButton>
                        <CustomButton onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</CustomButton>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default EditStallA;
