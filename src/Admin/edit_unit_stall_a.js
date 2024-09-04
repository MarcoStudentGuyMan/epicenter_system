import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home } from 'ionicons/icons';
import '../styles/unitStall_a.css';  
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly imported
import CustomButton from '../Component/Buttons';
import Header from './header_admin';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import SaveDialog from '../Component/Modals/SaveUnitStallDialog';
import DeleteDialog from '../Component/Modals/DeleteUnitStallDialog';
import { useDrawer } from './drawerContext'; // Use drawer context if applicable

function EditUnitStallA() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context if applicable
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleSaveDialogOpen = () => setSaveDialogOpen(true);
    const handleSaveDialogClose = () => setSaveDialogOpen(false);
    const handleDeleteDialogOpen = () => setDeleteDialogOpen(true);
    const handleDeleteDialogClose = () => setDeleteDialogOpen(false);

    // State to manage checkbox selections
    const [occupiedChecked, setOccupiedChecked] = useState(false);
    const [notOccupiedChecked, setNotOccupiedChecked] = useState(false);

    // Handle checkbox change
    const handleCheckboxChange = (checkbox) => {
        if (checkbox === 'occupied') {
            setOccupiedChecked(!occupiedChecked);
            if (!occupiedChecked) {
                setNotOccupiedChecked(false);
            }
        } else {
            setNotOccupiedChecked(!notOccupiedChecked);
            if (!notOccupiedChecked) {
                setOccupiedChecked(false);
            }
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

            <main
                className="tenantSide-main-content"
                style={{
                    marginLeft: isOpen ? 240 : 60, // Adjust main content margin based on drawer state
                    transition: 'margin-left 0.3s', // Smooth transition for margin change
                }}
            >
                <div className='Title'>
                    Edit Stall Unit
                </div>

                <div>
                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
                        <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link">
                            <IonIcon icon={home} className="breadcrumb-icon" />
                            <span>Home</span>
                        </Link>
                        <Link underline="hover" color="text.primary" onClick={() => navigate('/unit_stall_admin')} className="breadcrumb-link">
                            Stall Units
                        </Link>
                        <Link underline="hover" color="text.primary" className="breadcrumb-link">
                            Edit Stall Unit
                        </Link>
                    </Breadcrumbs>

                    <section className="profileA-align">
                        <div className="noButtons">
                            <li>
                                <label>Stall Unit Name:</label>
                                <input className="for-input" placeholder="Enter Stall Unit Name" size="30" />
                            </li>
                            <li>
                                <label>Stall Unit Price:</label>
                                <input type="number" className="for-input" placeholder="Enter Stall Unit Price" size="30" />
                            </li>
                            <div className="form-group">
                                <li>
                                    <label>Stall ID:</label>
                                    <select className='for-input'>
                                        <option value="" disabled selected>Select Stall Type</option>
                                        <option>Sample Stall ID</option>
                                    </select>
                                </li>
                            </div>
                            <div className="form-group">
                                <label>Stall Unit Status:</label>
                                <FormGroup className="horizontal-checkboxes black-version">
                                    <FormControlLabel 
                                        control={
                                            <Checkbox 
                                                className="small-checkbox" 
                                                checked={occupiedChecked}
                                                onChange={() => handleCheckboxChange('occupied')}
                                                disabled={!occupiedChecked && notOccupiedChecked}
                                                sx={{ color: 'black' }} // Make checkbox black
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
                                                sx={{ color: 'black' }} // Make checkbox black
                                            />
                                        } 
                                        label="NOT OCCUPIED"
                                        classes={{ label: 'checkbox-label' }} // Apply label font size
                                    />
                                </FormGroup>
                            </div>
                            <li> 
                                <div className="buttons">
                                    <CustomButton color="primary" variant="contained" onClick={handleSaveDialogOpen}>Save</CustomButton>
                                    <CustomButton color="error" variant="contained" onClick={handleDeleteDialogOpen}>Delete</CustomButton>
                                    <CustomButton color="warning" variant="contained" onClick={() => navigate('/unit_stall_admin')}>Cancel</CustomButton>
                                </div>
                            </li> 
                        </div>
                    </section>
                </div>
            </main>
            <SaveDialog open={saveDialogOpen} onClose={handleSaveDialogClose} />
            <DeleteDialog open={deleteDialogOpen} onClose={handleDeleteDialogClose} />
        </div>
    );
}

export default EditUnitStallA;
