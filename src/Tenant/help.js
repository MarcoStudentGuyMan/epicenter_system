import React, { useState } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';
import '../styles/unitStall_a.css';
import '../styles/HeaderAdmin.css';
import { useDrawer } from '../Admin/drawerContext'; // Use the drawer context
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import BookIcon from '@mui/icons-material/Book';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

function Help() {
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer(); // Use drawer context

    const [anchorEl, setAnchorEl] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const toggleModal = () => {
        navigate('/message_tenant', { state: { openCompose: true } });
    };
    

    return (
        <IonApp>
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
                <main
                    className="tenantSide-main-content"
                    style={{
                        marginLeft: isOpen ? 240 : 60,
                        transition: 'margin-left 0.3s',
                    }}
                >
                    <Box sx={{ padding: 3 }}>
                        <Paper elevation={6} sx={{ padding: 6, maxWidth: 900, margin: '0 auto', borderRadius: 4 }}>
                            <Grid container spacing={3} alignItems="center">
                                <Grid item>
                                    <HelpOutlineIcon color="primary" sx={{ fontSize: 50 }} />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h3" gutterBottom>
                                        Help & Support
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Typography variant="body1" paragraph sx={{ marginTop: 2 }}>
                                Welcome to the Epicenter Help Page! Here you will find all the information you need to get started and to resolve any issues you might have while using our platform.
                            </Typography>
                            <Grid container spacing={2} alignItems="center" sx={{ marginTop: 4 }}>
                                <Grid item>
                                    <BookIcon color="secondary" sx={{ fontSize: 40 }} />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h5" gutterBottom>
                                        Online Manual
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Typography variant="body1" paragraph>
                                If you need more detailed guidance, please visit our online manual by clicking the link below.
                            </Typography>
                            <Link
                                href="https://drive.google.com/uc?export=download&id=1o1QAiYpxFABmpKuiLDEBTkOFvUcVS6i9" // Direct link to download
                                download="EPICENTER_MANUAL_TENANT.pdf" // Suggested download file name
                                underline="hover"
                                sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                                >
                                Download PDF Manual
                            </Link>
                            
                            
                            

                            <Box sx={{ marginTop: 6 }}>
                                <Typography variant="h5" gutterBottom>
                                    Frequently Asked Questions
                                </Typography>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6">How to change password?</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            Go to the Profile section, click on 'Change Password', and follow the prompts.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6">How to view messages?</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            Navigate to the 'Message' section from the dashboard to see all your messages.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6">How to access mini-sites?</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            Click on the 'Mini Sites' option in the dashboard and select your stall to manage.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                            <Box sx={{ marginTop: 6, textAlign: 'center' }}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    startIcon={<ContactSupportIcon />} 
                                    onClick={toggleModal}
                                    sx={{ padding: '10px 20px', fontSize: '1rem' }}
                                >
                                    Contact Support
                                </Button>
                            </Box>
                            
                        </Paper>
                    </Box>
                </main>
            </div>
        </IonApp>
    );
}


export default Help;
