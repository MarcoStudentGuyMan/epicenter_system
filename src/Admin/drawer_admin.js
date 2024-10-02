import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import { supabase } from '../supabaseConnect';  
import {
    easel, personCircle, cube, storefront, people,
    triangle, prism, mail, chatbubble, newspaper,
    calculator, exit,archive
} from 'ionicons/icons';
import { useDrawer } from './drawerContext';

const drawerWidth = 240;

function MiniDrawer() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer();

    const handleLogout = async () => {
        try {
            
            localStorage.removeItem('adminSession'); // Also clear the admin session from localStorage
            navigate('/login_admin'); // Redirect to the login page
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };
    

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                open={isOpen}
                sx={{
                    width: isOpen ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: isOpen ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
                        boxSizing: 'border-box',
                        transition: 'width 0.3s',
                        overflowX: 'hidden',
                        backgroundColor: '#062536',
                        color: '#E9E9E9',
                    },
                }}
            >
                <div className="sidebar-header">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        edge="start"
                        sx={[
                            {
                                margin: '0 auto',
                                color: '#E9E9E9',
                            },
                            isOpen && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <IconButton
                        onClick={toggleDrawer}
                        sx={{ margin: 'right', display: !isOpen ? 'none' : 'block', color: '#E9E9E9' }}
                    >
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
               
                <List>
    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
    <ListItem button onClick={() => navigate('/dashboard_admin')}>
        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={easel} /></ListItemIcon>
        <ListItemText primary="Dashboard" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
    </ListItem>
    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
    <ListItem button onClick={() => navigate('/profile_admin')}>
        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={personCircle} /></ListItemIcon>
        <ListItemText primary="Profile" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
    </ListItem>
    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
    <ListItem button onClick={() => navigate('/unit_stall_admin')}>
        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={cube} /></ListItemIcon>
        <ListItemText primary="Stall Units" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
    </ListItem>
    <ListItem button onClick={() => navigate('/stall_admin')}>
        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={storefront} /></ListItemIcon>
        <ListItemText primary="Stalls" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
    </ListItem>
    <ListItem button onClick={() => navigate('/tenant_admin')}>
        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={people} /></ListItemIcon>
        <ListItemText primary="Tenants" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
    </ListItem>
    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
    <ListItem button onClick={() => navigate('/epicentersite_admin')}>
        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={triangle} /></ListItemIcon>
        <ListItemText primary="Epicenter Site" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
    </ListItem>
    <ListItem button onClick={() => navigate('/minisite_admin')}>
        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={prism} /></ListItemIcon>
        <ListItemText primary="Mini Sites" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
    </ListItem>
    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
    <ListItem button onClick={() => navigate('/email_admin')}>
        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={archive} /></ListItemIcon>
        <ListItemText primary="Archives" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
    </ListItem>
    <ListItem button onClick={() => navigate('/message_admin')}>
        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={chatbubble} /></ListItemIcon>
        <ListItemText primary="Message" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
    </ListItem>
    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
    <ListItem button onClick={() => navigate('/rentbalance_admin')}>
        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={newspaper} /></ListItemIcon>
        <ListItemText primary="Rent Balance" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
    </ListItem>
    <ListItem button onClick={() => navigate('/rentautomation_admin')}>
        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={calculator} /></ListItemIcon>
        <ListItemText primary="Rent Automation" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
    </ListItem>
    {/* The logout button will now clear the session */}
    <ListItem button onClick={handleLogout}>
        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '28px' }}><IonIcon icon={exit} /></ListItemIcon>
        <ListItemText primary="Logout" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
    </ListItem>
</List>

            </Drawer>
        </Box>
    );
}

export default MiniDrawer;
