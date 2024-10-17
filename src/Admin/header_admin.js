import React, { useEffect, useState } from 'react';
import { Badge, Popover, Typography, List, ListItem, CircularProgress, Card, Avatar, Box, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseConnect';

function HeaderAdmin({ drawerOpen, handleDrawerToggle, handleClick, anchorEl, handleClose }) {
    const [notificationCount, setNotificationCount] = useState(0);
    const [notificationsList, setNotificationsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('MESSAGES')
                    .select('*')
                    .eq('receiver_type', 'Admin')
                    .eq('is_read', false);

                if (error) throw error;

                setNotificationCount(data.length);
                setNotificationsList(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        const messageSubscription = supabase
            .channel('public:MESSAGES')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'MESSAGES' }, (payload) => {
                if (payload.new.receiver_type === 'Admin') {
                    setNotificationCount((prevCount) => prevCount + 1);
                    setNotificationsList((prevList) => [payload.new, ...prevList]);
                }
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'MESSAGES' }, (payload) => {
                if (payload.new.receiver_type === 'Admin') {
                    setNotificationsList((prevList) =>
                        prevList.map((message) =>
                            message.id === payload.new.id ? payload.new : message
                        )
                    );
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(messageSubscription);
        };
    }, []);

    const handleMarkAsRead = async (message) => {
        try {
            const { error } = await supabase
                .from('MESSAGES')
                .update({ is_read: true })
                .eq('id', message.id);

            if (error) throw error;

            setNotificationsList((prevList) =>
                prevList.filter((notif) => notif.id !== message.id)
            );
            setNotificationCount((prevCount) => prevCount - 1);

            navigate('/message_admin');
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    return (
        <header className="adminSide-header" style={{ marginLeft: drawerOpen ? 240 : 60, transition: 'margin-left 0.3s' }}>
            <div className="header-left">
                <a onClick={() => navigate('/dashboard_admin')}>
                    <img className="logo-nav" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                </a>
                <span className="app-name">Epicenter</span>
            </div>
            <div className="header-right">
                <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon 
                        className="icon" 
                        onClick={handleClick} 
                        sx={{ cursor: 'pointer', fontSize: { xs: '1.5rem', sm: '2rem' } }}
                    />
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
                            width: { xs: '90%', sm: 350 },
                            maxHeight: { xs: '60vh', sm: 400 },
                            p: { xs: 1, sm: 2 },
                            overflowY: 'auto',
                            borderRadius: 2,
                            boxShadow: 3,
                        },
                    }}
                >
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            mb: 2, 
                            fontWeight: 'bold', 
                            color: '#062536', 
                            fontSize: { xs: '1.2rem', sm: '1.5rem' }, 
                            textAlign: { xs: 'center', sm: 'left' }
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
                                    <Typography 
                                        sx={{ 
                                            fontSize: { xs: '0.9rem', sm: '1rem' },
                                            textAlign: 'center',
                                            width: '100%',
                                            color: '#777'
                                        }}
                                    >
                                        No new notifications
                                    </Typography>
                                </ListItem>
                            ) : (
                                notificationsList.map((notification, index) => (
                                    <Card
                                        key={index}
                                        sx={{
                                            mb: 1,
                                            p: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            borderRadius: '12px',
                                            borderColor: '#e0e0e0',
                                            '&:hover': {
                                                backgroundColor: '#f0f0f0',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                            },
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            gap: { xs: 1, sm: 2 },
                                        }}
                                        onClick={() => handleMarkAsRead(notification)}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: '#0D5369',
                                                width: { xs: 40, sm: 50 },
                                                height: { xs: 40, sm: 50 },
                                                mb: { xs: 1, sm: 0 },
                                                mr: { sm: 2 },
                                            }}
                                        >
                                            <NotificationsIcon sx={{ color: 'white', fontSize: { xs: 20, sm: 24 } }} />
                                        </Avatar>
                                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, width: '100%' }}>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ fontWeight: '500', color: '#333', fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                            >
                                                {notification.subject}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ color: '#777', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                            >
                                                {notification.message_body}
                                            </Typography>
                                        </Box>
                                    </Card>
                                ))
                            )}
                        </List>
                    )}
                </Popover>
            </div>
        </header>
    );
}

export default HeaderAdmin;
