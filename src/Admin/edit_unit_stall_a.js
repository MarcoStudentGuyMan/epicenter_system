import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { home } from 'ionicons/icons';
import '../styles/unitStall_a.css';  
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MiniDrawer from './drawer_admin';
import CustomButton from '../Component/Buttons';
import Header from './header_admin';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useDrawer } from './drawerContext'; 
import { supabase } from '../supabaseConnect'; 
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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

function EditUnitStallA() {
    const navigate = useNavigate();
    const { stall_unit_id } = useParams(); 
    const { isOpen, toggleDrawer } = useDrawer(); 
    const [saveDialogOpen, setSaveDialogOpen] = useState(false); 
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); 
    const [loading, setLoading] = useState(true); 
    
    const [stallUnit, setStallUnit] = useState({
        stall_unit_name: '',
        stall_unit_price: '',
        stall_unit_status: ''
    });

    useEffect(() => {
        const fetchStallUnit = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('STALL_UNIT')
                    .select('*')
                    .eq('stall_unit_id', stall_unit_id)
                    .single();

                if (error) {
                    console.error('Error fetching stall unit:', error);
                } else {
                    setStallUnit(data);
                }
            } catch (err) {
                console.error('Error during stall unit fetch:', err);
            } finally {
                setLoading(false);
            }
        };

        if (stall_unit_id) {
            fetchStallUnit(); 
        }
    }, [stall_unit_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStallUnit((prevUnit) => ({
            ...prevUnit,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (checkbox) => {
        if (checkbox === 'occupied') {
            setStallUnit((prevUnit) => ({
                ...prevUnit,
                stall_unit_status: 'Occupied',
            }));
        } else {
            setStallUnit((prevUnit) => ({
                ...prevUnit,
                stall_unit_status: 'Not Occupied',
            }));
        }
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from('STALL_UNIT')
                .update({
                    stall_unit_name: stallUnit.stall_unit_name,
                    stall_unit_price: stallUnit.stall_unit_price,
                    stall_unit_status: stallUnit.stall_unit_status,
                })
                .eq('stall_unit_id', stall_unit_id); 

            if (error) {
                console.error('Error updating stall unit:', error);
            } else {
                setSaveDialogOpen(true); 
            }
        } catch (err) {
            console.error('Error during stall unit update:', err);
        }
    };

    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from('STALL_UNIT')
                .delete()
                .eq('stall_unit_id', stall_unit_id);

            if (error) {
                console.error('Error deleting stall unit:', error);
            } else {
                setDeleteDialogOpen(false); 
                navigate('/unit_stall_admin');
            }
        } catch (err) {
            console.error('Error deleting stall unit:', err);
        }
    };

    return (
        <div className="app-container">
            <MiniDrawer isOpen={isOpen} onDrawerToggle={toggleDrawer} />
            <Header
                drawerOpen={isOpen}
                handleDrawerToggle={toggleDrawer}
                navigate={navigate}
            />
            <main className="tenantSide-main-content">
                {loading ? (
                    <p>Loading...</p> 
                ) : (
                    <>
                        <div className='Title'>
                            Edit Stall Unit
                        </div>

                        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container" sx={{ fontSize: '1.5rem' }}>
                            <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
                                <IonIcon icon={home} className="breadcrumb-icon" />
                                <span>Home</span>
                            </Link>
                            <Link underline="hover" color="text.primary" onClick={() => navigate('/unit_stall_admin')} className="breadcrumb-link" sx={{ fontSize: '1.5rem' }}>
                                Stall Units
                            </Link>
                            <Link underline="hover" color="text.primary" className="breadcrumb-link">
                                Edit Stall Unit
                            </Link>
                        </Breadcrumbs>

                        <section className="none-pic">
                            <div className="noButtons">
                                <li>
                                    <label>Stall Unit Name:</label>
                                    <input
                                        className="for-input"
                                        name="stall_unit_name"
                                        placeholder="Enter Stall Unit Name"
                                        value={stallUnit.stall_unit_name || ''}
                                        size="30"
                                        onChange={handleInputChange}
                                    />
                                </li>
                                <li>
                                    <label>Stall Unit Price:</label>
                                    <input
                                        type="number"
                                        className="for-input"
                                        name="stall_unit_price"
                                        placeholder="Enter Stall Unit Price"
                                        value={stallUnit.stall_unit_price || ''}
                                        size="30"
                                        onChange={handleInputChange}
                                    />
                                </li>
                              
                                <li>
                                    <div className="buttons">
                                        <CustomButton color="primary" variant="contained" onClick={handleSave}>Save</CustomButton>
                                        <CustomButton color="error" variant="contained" onClick={() => setDeleteDialogOpen(true)}>Delete</CustomButton>
                                        <CustomButton color="warning" variant="contained" onClick={() => navigate('/unit_stall_admin')}>Cancel</CustomButton>
                                    </div>
                                </li>
                            </div>
                        </section>
                    </>
                )}
            </main>

            {/* Save Success Modal */}
            <Modal
                open={saveDialogOpen}
                onClose={() => setSaveDialogOpen(false)}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        Successfully Saved
                    </Typography>
                    <CustomButton onClick={() => navigate('/unit_stall_admin')} color="primary">OK</CustomButton>
                </Box>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">
                        Are you sure you want to delete this unit?
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <CustomButton onClick={handleDelete} color="error">Delete</CustomButton>
                        <CustomButton onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</CustomButton>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default EditUnitStallA;
