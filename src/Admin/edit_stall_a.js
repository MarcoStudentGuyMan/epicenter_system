import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { home } from 'ionicons/icons';
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly imported
import CustomButton from '../Component/Buttons';
import Header from './header_admin';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import SaveDialog from '../Component/Modals/SaveStallDialog';
import DeleteDialog from '../Component/Modals/DeleteStallDialog';
import { useDrawer } from './drawerContext'; // Use drawer context if applicable

function EditStallA() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context for state management

    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedStalls, setSelectedStalls] = useState([]);

    const handleSaveDialogOpen = () => setSaveDialogOpen(true);
    const handleSaveDialogClose = () => setSaveDialogOpen(false);
    const handleDeleteDialogOpen = () => setDeleteDialogOpen(true);
    const handleDeleteDialogClose = () => setDeleteDialogOpen(false);

    const handleStallChange = (selectedOptions) => {
        setSelectedStalls(selectedOptions);
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
                <div className="Title">
                    Edit Stall Information
                </div>

                <div>
                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs-container">
                        <Link underline="hover" color="inherit" onClick={() => navigate('/dashboard_admin')} className="breadcrumb-link">
                            <IonIcon icon={home} className="breadcrumb-icon" />
                            <span>Home</span>
                        </Link>
                        <Link underline="hover" color="text.primary" onClick={() => navigate('/stall_admin')} aria-current="page" className="breadcrumb-link">
                            Stalls
                        </Link>
                        <Link underline="hover" color="text.primary" aria-current="page" className="breadcrumb-link">
                            Edit Stall
                        </Link>
                    </Breadcrumbs>

                    <section className="profileA-align">
                        <div className="noButtons">
                            <li>
                                <label>Stall Type:</label>
                                <select className='for-input'>
                                    <option value="" disabled selected>Select Stall Type</option>
                                    <option>Cafe and Pastry</option>
                                    <option>Restaurant and Bar</option>
                                    <option>Sweets and Desserts</option>
                                    <option>Groceries</option>
                                    <option>Others</option>
                                </select>
                            </li>
                            <li>
                                <label>Stall Unit/s:</label>
                                <div className="for-input">
                                    <Select 
                                        isMulti
                                        options={stallOptions}
                                        onChange={handleStallChange}
                                        value={selectedStalls}
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </li>
                            <li>
                                <label>Business Name:</label>
                                <input className="for-input" placeholder="Enter Business Name" value="Hogwarts" size="30" />
                            </li>
                            <li>
                                <label>Business Description:</label>
                                <input className="for-input" placeholder="Enter Business Description" value="Medina" size="30" />
                            </li>
                            <li>
                                <label>Tenant ID:</label>
                                <select className='for-input'>
                                    <option value="" disabled selected>Select Tenant ID</option>
                                    <option>sample tenant name</option>
                                </select>
                            </li>
                        </div>
                        <div className="profile-image">
                            <img className="user-profile" src={`${process.env.PUBLIC_URL}/hogwarts.jpg`} alt="UserProfile" />
                            <p>Stall ID: 0012</p>
                        </div>
                        <div className="buttons">
                            <CustomButton color="primary" variant="contained" onClick={handleSaveDialogOpen}>Save</CustomButton>
                            <CustomButton color="error" variant="contained" onClick={handleDeleteDialogOpen}>Delete</CustomButton>
                            <CustomButton color="warning" variant="contained" onClick={() => navigate('/stall_admin')}>Cancel</CustomButton>
                        </div>
                    </section>
                </div>
            </main>
            <SaveDialog open={saveDialogOpen} onClose={handleSaveDialogClose} />
            <DeleteDialog open={deleteDialogOpen} onClose={handleDeleteDialogClose} />
        </div>
    );
}

export default EditStallA;
