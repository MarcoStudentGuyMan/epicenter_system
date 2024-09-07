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
import { useDrawer } from '../Admin/drawerContext';
import {
    easel, personCircle, prism, mail, chatbubble, newspaper, exit
} from 'ionicons/icons';

const drawerWidth = 240;

function MiniDrawer() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { isOpen, toggleDrawer } = useDrawer();
    const [tenantName, setTenantName] = React.useState(); // Fix here: tenantName and setTenantName

    // Fetch tenant data from Supabase when the component mounts
    React.useEffect(() => {
        const fetchTenantData = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const userEmail = session?.user?.email;

                if (userEmail) {
                    const { data, error } = await supabase
                        .from('TENANT')
                        .select('ten_FirstName')
                        .eq('ten_Email', userEmail)
                        .single();

                    if (error) throw error;
                    setTenantName(data.ten_FirstName); // Set tenant's first name
                }
            } catch (error) {
                console.error('Error fetching tenant data:', error.message);
            }
        };

        fetchTenantData();
    }, []);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut(); // Clears the session
            navigate('/login_tenant'); // Redirect to the login page after sign out
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
                {/* Drawer Header */}
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

                {/* Tenant Name Display */}
                {isOpen && (
                    <div className="tenant-name">
                        <div style={{ padding: '10px', color: '#E9E9E9', textAlign: 'center' }}>
                            Hello, {tenantName}!
                        </div>
                    </div>
                )}

                {/* Drawer List Items */}
                <List>
                    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
                    <ListItem button onClick={() => navigate('/dashboard_tenant')}>
                        <ListItemIcon sx={{ color: '#E9E9E9' }}><IonIcon icon={easel} /></ListItemIcon>
                        <ListItemText primary="Dashboard" sx={{ color: '#E9E9E9' }} />
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
                    <ListItem button onClick={() => navigate('/profile_tenant')}>
                        <ListItemIcon sx={{ color: '#E9E9E9' }}><IonIcon icon={personCircle} /></ListItemIcon>
                        <ListItemText primary="Profile" sx={{ color: '#E9E9E9' }} />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/minisite_tenant')}>
                        <ListItemIcon sx={{ color: '#E9E9E9' }}><IonIcon icon={prism} /></ListItemIcon>
                        <ListItemText primary="Mini Sites" sx={{ color: '#E9E9E9' }} />
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
                    <ListItem button onClick={() => navigate('/rentbalance_tenant')}>
                        <ListItemIcon sx={{ color: '#E9E9E9' }}><IonIcon icon={newspaper} /></ListItemIcon>
                        <ListItemText primary="Rent Balance" sx={{ color: '#E9E9E9' }} />
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
                    <ListItem button onClick={() => navigate('/email_tenant')}>
                        <ListItemIcon sx={{ color: '#E9E9E9' }}><IonIcon icon={mail} /></ListItemIcon>
                        <ListItemText primary="Email" sx={{ color: '#E9E9E9' }} />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/message_tenant')}>
                        <ListItemIcon sx={{ color: '#E9E9E9' }}><IonIcon icon={chatbubble} /></ListItemIcon>
                        <ListItemText primary="Message" sx={{ color: '#E9E9E9' }} />
                    </ListItem>

                    {/* Other list items here... */}
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon sx={{ color: '#E9E9E9' }}><IonIcon icon={exit} /></ListItemIcon>
                        <ListItemText primary="Logout" sx={{ color: '#E9E9E9' }} />
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
}

export default MiniDrawer;
