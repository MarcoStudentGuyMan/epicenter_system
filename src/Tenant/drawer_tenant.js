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
import useMediaQuery from '@mui/material/useMediaQuery';
import { supabase } from '../supabaseConnect';
import { useDrawer } from '../Admin/drawerContext';
import {
    easel, personCircle, prism, mail, chatbubble, newspaper, exit,helpCircleOutline
} from 'ionicons/icons';

const drawerWidth = 240;

function MiniDrawer() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { isOpen, setIsOpen, toggleDrawer } = useDrawer();
    const [tenantName, setTenantName] = React.useState();

    // Check if the screen size is small (mobile)
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Ensure the drawer remains closed on mobile screens
    React.useEffect(() => {
        if (isMobile) {
            setIsOpen(false); // Force the drawer to stay closed on mobile
        }
    }, [isMobile, setIsOpen]);

    // Fetch tenant data from Supabase when the component mounts
    React.useEffect(() => {
        const fetchTenantData = async () => {
            try {
                const storedTenantSession = localStorage.getItem('tenantSession');
                if (storedTenantSession) {
                    const session = JSON.parse(storedTenantSession);
                    const userEmail = session?.user?.email;

                    if (userEmail) {
                        const { data, error } = await supabase
                            .from('TENANT')
                            .select('ten_FirstName')
                            .eq('ten_Email', userEmail)
                            .single();

                        if (error) throw error;
                        setTenantName(data.ten_FirstName);
                    }
                } else {
                    alert('No tenant session found. Please log in.');
                    navigate('/login_tenant');
                }
            } catch (error) {
                console.error('Error fetching tenant data:', error.message);
            }
        };

        fetchTenantData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('tenantSession');
            navigate('/login_tenant');
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                open={!isMobile && isOpen} // Keep drawer closed on mobile
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
                    {!isMobile && (
                        <>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={toggleDrawer}
                                edge="start"
                                sx={[{ margin: '0 auto', color: '#E9E9E9' }, isOpen && { display: 'none' }]}
                            >
                                <MenuIcon />
                            </IconButton>
                            <IconButton
                                onClick={toggleDrawer}
                                sx={{ margin: 'right', display: !isOpen ? 'none' : 'block', color: '#E9E9E9' }}
                            >
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </>
                    )}
                </div>

                {isOpen && (
                    <div className="tenant-name">
                        <div style={{ padding: '10px', color: '#E9E9E9', textAlign: 'center' }}>
                            Hello, {tenantName}!
                        </div>
                    </div>
                )}

                <List>
                    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
                    <ListItem button onClick={() => navigate('/dashboard_tenant')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={easel} /></ListItemIcon>
                        <ListItemText primary="Dashboard" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
                    <ListItem button onClick={() => navigate('/profile_tenant')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={personCircle} /></ListItemIcon>
                        <ListItemText primary="Profile" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/minisite_tenant')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={prism} /></ListItemIcon>
                        <ListItemText primary="Mini Sites" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
                    <ListItem button onClick={() => navigate('/rentbalance_tenant')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={newspaper} /></ListItemIcon>
                        <ListItemText primary="Rent Balance" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
                    <ListItem button onClick={() => navigate('/message_tenant')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={chatbubble} /></ListItemIcon>
                        <ListItemText primary="Message" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <ListItem button onClick={() => navigate('')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '28px' }}><IonIcon icon={helpCircleOutline} /></ListItemIcon>
                        <ListItemText primary="Help" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}><IonIcon icon={exit} /></ListItemIcon>
                        <ListItemText primary="Logout" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
}

export default MiniDrawer;
