import React, { useEffect, useState } from 'react';
import { Badge, Popover, Typography, List, ListItem, CircularProgress, Card, Avatar, Box, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Using MUI Notifications icon
import MessageIcon from '@mui/icons-material/Message'; // Importing MUI Message icon
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseConnect'; // Assuming you have set up supabase
import { ListItemText } from '@mui/material';

function HeaderTenant({ drawerOpen, handleDrawerToggle, handleClick, anchorEl, handleClose }) {
    const [notificationCount, setNotificationCount] = useState(0); // Track unread notifications
    const [notificationsList, setNotificationsList] = useState([]); // Store notifications
    const [loading, setLoading] = useState(true); // Loader for notification list
    const [tenantEmail, setTenantEmail] = useState(null); // Store tenant email
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const navigate = useNavigate();

    // Fetch tenant email from session and then fetch notifications
    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const userEmail = session.user.email;
                setTenantEmail(userEmail);
                fetchUnreadNotifications(userEmail); // Fetch unread notifications with tenant email
                subscribeToMessages(userEmail); // Subscribe to real-time notifications
            }
        };

        const fetchUnreadNotifications = async (email) => {
            try {
                const { data, error } = await supabase
                    .from('MESSAGES')
                    .select('*')
                    .eq('receiver', email)  // Use the dynamic tenant email
                    .eq('receiver_type', 'Tenant')
                    .eq('is_read', false);  // Only fetch unread messages

                if (error) throw error;

                setNotificationCount(data.length); // Set count of unread notifications
                setNotificationsList(data); // Set notifications for the list
                setLoading(false);
            } catch (error) {
                console.error('Error fetching unread notifications:', error);
            }
        };

        const subscribeToMessages = (email) => {
            // Real-time listener for new notifications
            const messageSubscription = supabase
                .channel('public:MESSAGES')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'MESSAGES' }, (payload) => {
                    if (payload.new.receiver === email && payload.new.receiver_type === 'Tenant') {
                        setNotificationCount((prevCount) => prevCount + 1); // Increment notification count
                        setNotificationsList((prevList) => [payload.new, ...prevList]); // Add new notification to the list
                    }
                })
                .subscribe();

            return () => {
                supabase.removeChannel(messageSubscription); // Cleanup subscription on unmount
            };
        };

        fetchSession(); // Fetch session on component mount

        return () => {
            supabase.removeAllChannels(); // Cleanup all Supabase subscriptions on unmount
        };
    }, []);

    // Handle marking message as read
    const handleMarkAsRead = async (notification) => {
        try {
            const { error } = await supabase
                .from('MESSAGES')
                .update({ is_read: true })
                .eq('id', notification.id);

            if (error) throw error;

            // Update the local notification list and notification count
            setNotificationsList((prevList) => 
                prevList.filter((notif) => notif.id !== notification.id)
            );
            setNotificationCount((prevCount) => prevCount - 1);

            // Redirect to tenant message inbox
            navigate('/message_tenant');
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    return (
        <header className="adminSide-header" style={{ marginLeft: drawerOpen ? 240 : 60, transition: 'margin-left 0.3s' }}>
            <div className="header-left">
                <a onClick={() => navigate('/dashboard_tenant')}>
                    <img className="logo-nav" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                </a>
                <span className="app-name">Epicenter</span>
            </div>
            <div className="header-right">
                <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon className="icon" onClick={handleClick} /> {/* Use MUI NotificationsIcon */}
                </Badge>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    PaperProps={{
                        sx: { width: 350, maxHeight: 400, padding: 2, overflowY: 'auto', borderRadius: 2, boxShadow: 3 }
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#062536' }}>Notifications</Typography>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <List>
                            {notificationsList.length === 0 ? (
                                <ListItem>
                                    <ListItemText primary="No new notifications" />
                                </ListItem>
                            ) : (
                                notificationsList.map((notification, index) => (
                                    <Box 
                                        key={index} 
                                        sx={{ 
                                            cursor: 'pointer', 
                                            '&:hover': { 
                                                backgroundColor: '#f0f0f0',  // Change background color on hover
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'  // Add shadow on hover
                                            } 
                                        }} 
                                        onClick={() => handleMarkAsRead(notification)}  // Mark as read and update notification count
                                    >
                                        <Card variant="outlined" sx={{ mb: 1, p: 2, display: 'flex', alignItems: 'center', borderRadius: '12px', borderColor: '#e0e0e0' }}>
                                            <Avatar sx={{ bgcolor: '#0D5369', mr: 2 }}>
                                                <MessageIcon sx={{ color: 'white' }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: '500', color: '#333' }}>{notification.subject}</Typography>
                                                <Typography variant="body2" sx={{ color: '#777' }}>{notification.message_body}</Typography>
                                            </Box>
                                        </Card>
                                    </Box>
                                ))
                            )}
                            <Divider sx={{ mt: 2 }} />
                            <Typography 
                                sx={{ textAlign: 'center', mt: 1, color: '#888', fontSize: '0.875rem', cursor: 'pointer' }} 
                                onClick={() => navigate('/message_tenant')}
                            >
                               
                            </Typography>
                        </List>
                    )}
                </Popover>
            </div>
        </header>
    );
}

export default HeaderTenant;
