import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { supabase } from '../supabaseConnect'; // Assuming you have a file for Supabase connection
import { useDrawer } from './drawerContext';
import {
    easel, personCircle, cube, storefront, people,
    triangle, prism, chatbubble, archive, newspaper,
    calculator, exit, receipt, idCard
} from 'ionicons/icons';

const drawerWidth = 240;

function MiniDrawer() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { isOpen, setIsOpen } = useDrawer();
    const [managerName, setManagerName] = React.useState('');

    // Check if the screen size is small (mobile)
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Ensure the drawer remains closed on mobile screens
    React.useEffect(() => {
        if (isMobile) {
            setIsOpen(false); // Force the drawer to stay closed on mobile
        }
    }, [isMobile, setIsOpen]);

    // Fetch manager data from Supabase when the component mounts
    React.useEffect(() => {
        const fetchManagerData = async () => {
            try {
                const storedManagerSession = localStorage.getItem('adminSession');
                if (storedManagerSession) {
                    const session = JSON.parse(storedManagerSession);
                    const userEmail = session?.user?.email;

                    if (userEmail) {
                        const { data, error } = await supabase
                            .from('MANAGER') // Replace with your actual table name
                            .select('Manager_FirstName') // The field you want to display
                            .eq('Manager_Email', userEmail)
                            .single();

                        if (error) throw error;
                        setManagerName(data.Manager_FirstName); // Set the manager's first name
                    }
                } else {
                    alert('No manager session found. Please log in.');
                    navigate('/login_admin'); // Redirect to the login page if no session is found
                }
            } catch (error) {
                console.error('Error fetching manager data:', error.message);
            }
        };

        fetchManagerData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('adminSession');
            navigate('/login_admin');
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
                                onClick={() => setIsOpen(!isOpen)}
                                edge="start"
                                sx={[{ margin: '0 auto', color: '#E9E9E9' }, isOpen && { display: 'none' }]}
                            >
                                <MenuIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => setIsOpen(!isOpen)}
                                sx={{ margin: 'right', display: !isOpen ? 'none' : 'block', color: '#E9E9E9' }}
                            >
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </>
                    )}
                </div>

                {/* Display manager's name when the drawer is open */}
                {isOpen && (
                    <div className="tenant-name">
                    <div className="manager-name" style={{ padding: '10px', color: '#E9E9E9', textAlign: 'center' }}>
                        Hello, {managerName}!
                    </div>
                    </div>
                )}

                <List>
                    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
                    <ListItem button onClick={() => navigate('/dashboard_admin')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}>
                            <IonIcon icon={easel} />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
                    <ListItem button onClick={() => navigate('/profile_admin')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}>
                            <IonIcon icon={personCircle} />
                        </ListItemIcon>
                        <ListItemText primary="Profile" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/unit_stall_admin')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}>
                            <IonIcon icon={cube} />
                        </ListItemIcon>
                        <ListItemText primary="Stall Units" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/stall_admin')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}>
                            <IonIcon icon={storefront} />
                        </ListItemIcon>
                        <ListItemText primary="Stalls" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/tenant_admin')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}>
                            <IonIcon icon={people} />
                        </ListItemIcon>
                        <ListItemText primary="Tenants" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
                    <ListItem button onClick={() => navigate('/epicentersite_admin')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}>
                            <IonIcon icon={triangle} />
                        </ListItemIcon>
                        <ListItemText primary="Epicenter Site" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/minisite_admin')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}>
                            <IonIcon icon={prism} />
                        </ListItemIcon>
                        <ListItemText primary="Mini Sites" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
                    <ListItem button onClick={() => navigate('/archive_admin')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}>
                            <IonIcon icon={archive} />
                        </ListItemIcon>
                        <ListItemText primary="Archive" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/message_admin')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}>
                            <IonIcon icon={chatbubble} />
                        </ListItemIcon>
                        <ListItemText primary="Message" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <Divider sx={{ borderBottomWidth: 2, backgroundColor: '#00344F', borderRadius: 8 }} />
                    <ListItem button onClick={() => navigate('/rentbalance_admin')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}>
                            <IonIcon icon={newspaper} />
                        </ListItemIcon>
                        <ListItemText primary="Rent Balance" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/rentautomation_admin')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}>
                            <IonIcon icon={calculator} />
                        </ListItemIcon>
                        <ListItemText primary="Rent Automation" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/rentreceipt_admin')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}>
                            <IonIcon icon={receipt} />
                        </ListItemIcon>
                        <ListItemText primary="Rent Receipt" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/history_admin')}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '24px' }}>
                            <IonIcon icon={idCard} />
                        </ListItemIcon>
                        <ListItemText primary="History" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon sx={{ color: '#E9E9E9', fontSize: '28px' }}>
                            <IonIcon icon={exit} />
                        </ListItemIcon>
                        <ListItemText primary="Logout" sx={{ color: '#E9E9E9', fontSize: '1.5rem' }} />
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
}

export default MiniDrawer;
