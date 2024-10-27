import React, { useEffect, useState } from 'react';
import { Badge, Popover, Typography, List, ListItem, CircularProgress, Card, Avatar, Box, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Using MUI Notifications icon
import MessageIcon from '@mui/icons-material/Message'; // Importing MUI Message icon
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseConnect'; // Assuming you have set up supabase
import { ListItemText } from '@mui/material';
import { addMonths, isSameDay, differenceInDays } from 'date-fns'; // Importing date-fns for date calculations

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
    
                // Fetch all types of notifications initially
                await fetchUnreadNotifications(userEmail);
                await fetchRentDueNotifications(userEmail);
                await fetchUpcomingRentNotifications(userEmail);
    
                // Subscribe to real-time message notifications
                subscribeToMessages(userEmail);
            }
        };
    
        const fetchUnreadNotifications = async (email) => {
            try {
                const { data, error } = await supabase
                    .from('MESSAGES')
                    .select('*')
                    .eq('receiver', email)
                    .eq('receiver_type', 'Tenant')
                    .eq('is_read', false);
    
                if (error) throw error;
    
                setNotificationCount(data.length);
                setNotificationsList(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching unread notifications:', error);
            }
        };
    
        const fetchRentDueNotifications = async (email) => {
            try {
                const { data, error } = await supabase
                    .from('RENT_INFORMATION')
                    .select('tenant_name, rent_start')
                    .eq('tenant_email', email);
    
                if (error) throw error;
    
                const today = new Date();
                const rentDueNotifications = data.filter((rent) => {
                    const rentDueDate = addMonths(new Date(rent.rent_start), 1);
                    return isSameDay(rentDueDate, today);
                }).map((rent) => ({
                    subject: 'Rent Due Reminder',
                    message_body: `Rent is due today for ${rent.tenant_name}.`,
                }));
    
                if (rentDueNotifications.length > 0) {
                    setNotificationCount((prevCount) => prevCount + rentDueNotifications.length);
                    setNotificationsList((prevList) => [...rentDueNotifications, ...prevList]);
                }
            } catch (error) {
                console.error('Error fetching rent due notifications:', error);
            }
        };
    
        const fetchUpcomingRentNotifications = async (email) => {
            try {
                const { data, error } = await supabase
                    .from('RENT_INFORMATION')
                    .select('tenant_name, rent_start')
                    .eq('tenant_email', email);
    
                if (error) throw error;
    
                const today = new Date();
                const upcomingRentNotifications = data.filter((rent) => {
                    const rentDueDate = addMonths(new Date(rent.rent_start), 1);
                    const daysUntilDue = differenceInDays(rentDueDate, today);
                    return daysUntilDue > 0 && daysUntilDue <= 7;
                }).map((rent) => ({
                    subject: 'Upcoming Rent Due Reminder',
                    message_body: `Your rent is due in ${differenceInDays(addMonths(new Date(rent.rent_start), 1), today)} days for ${rent.tenant_name}.`,
                }));
    
                if (upcomingRentNotifications.length > 0) {
                    setNotificationCount((prevCount) => prevCount + upcomingRentNotifications.length);
                    setNotificationsList((prevList) => [...upcomingRentNotifications, ...prevList]);
                }
            } catch (error) {
                console.error('Error fetching upcoming rent notifications:', error);
            }
        };
    
        const subscribeToMessages = (email) => {
            const messageSubscription = supabase
                .channel('public:MESSAGES')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'MESSAGES' }, (payload) => {
                    if (payload.new.receiver === email && payload.new.receiver_type === 'Tenant') {
                        fetchUnreadNotifications(email); // Refetch unread notifications on new message
                    }
                })
                .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'MESSAGES' }, () => {
                    fetchUnreadNotifications(email); // Refetch on delete
                })
                .subscribe();
    
            return () => {
                supabase.removeChannel(messageSubscription);
            };
        };
    
        fetchSession();
    
        return () => {
            supabase.removeAllChannels();
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
                        sx: { 
                            width: { xs: '90%', sm: 350 }, // Responsive width: 90% on mobile, 350px on larger screens
                            maxHeight: { xs: '60vh', sm: 400 }, // Adjust height to 60% of viewport on mobile, 400px on larger screens
                            padding: { xs: 1, sm: 2 }, // Adjust padding for different screen sizes
                            overflowY: 'auto', 
                            borderRadius: 2, 
                            boxShadow: 3 
                        }
                    }}
                >
              <Typography 
    variant="h6" 
    sx={{ 
        mb: { xs: 1, sm: 2 }, 
        fontWeight: 'bold', 
        color: '#062536', 
        fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' }, // Adjust font size for different screen sizes
        textAlign: { xs: 'center', sm: 'left' } // Center text on small screens
    }}
>
    Notifications
</Typography>
{loading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <CircularProgress />
    </Box>
) : (
    <List>
        {notificationsList.length === 0 ? (
            <ListItem>
                <ListItemText 
                    primary="No new notifications" 
                    sx={{ 
                        textAlign: 'center', 
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } // Adjust font size for mobile
                    }} 
                />
            </ListItem>
        ) : (
            notificationsList.map((notification, index) => (
                <Box 
                    key={index} 
                    sx={{ 
                        cursor: 'pointer', 
                        '&:hover': { 
                            backgroundColor: '#f0f0f0', // Change background color on hover
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // Add shadow on hover
                        },
                        mb: { xs: 1, sm: 2 }, // Adjust margin bottom for different screen sizes
                        px: { xs: 1, sm: 2 } // Adjust padding for mobile and larger screens
                    }} 
                    onClick={() => handleMarkAsRead(notification)} // Mark as read and update notification count
                >
                    <Card 
                        variant="outlined" 
                        sx={{ 
                            p: { xs: 1, sm: 2, md: 3 }, // Adjust padding for different screens
                            display: 'flex', 
                            alignItems: 'center', 
                            borderRadius: '12px', 
                            borderColor: '#e0e0e0',
                            flexDirection: { xs: 'column', sm: 'row' }, // Stack content vertically on mobile, horizontally on larger screens
                            gap: { xs: 1, sm: 2 }, // Add spacing between items
                        }}
                    >
                        <Avatar 
                            sx={{ 
                                bgcolor: '#0D5369', 
                                mr: { xs: 0, sm: 2 }, // No margin on mobile, margin on larger screens
                                mb: { xs: 1, sm: 0 }, // Margin bottom on mobile for spacing
                                width: { xs: 48, sm: 56, md: 64 }, // Adjust avatar size for smaller screens
                                height: { xs: 48, sm: 56, md: 64 }
                            }}
                        >
                            <MessageIcon sx={{ color: 'white', fontSize: { xs: 20, sm: 24, md: 28 } }} />
                        </Avatar>
                        <Box 
                            sx={{ 
                                textAlign: { xs: 'center', sm: 'left' }, 
                                width: '100%' 
                            }}
                        >
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    fontWeight: '500', 
                                    color: '#333', 
                                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' } // Adjust font size for different screens
                                }}
                            >
                                {notification.subject}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: '#777', 
                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } // Adjust font size for different screens
                                }}
                            >
                                {notification.message_body}
                            </Typography>
                        </Box>
                    </Card>
                </Box>
            ))
        )}
        <Divider sx={{ mt: 2 }} />
        <Typography 
            sx={{ 
                textAlign: 'center', 
                mt: { xs: 1, sm: 2 }, 
                color: '#888', 
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, // Adjust font size for smaller screens
                cursor: 'pointer',
                '&:hover': {
                    textDecoration: 'underline', // Add underline on hover for better feedback
                }
            }} 
            onClick={() => navigate('/message_tenant')}
        >
            View all messages
        </Typography>
    </List>

)}

                </Popover>
            </div>
        </header>
    );
}

export default HeaderTenant;

