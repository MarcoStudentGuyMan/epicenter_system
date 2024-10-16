import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/' },
    { text: 'Location', icon: <LocationOnIcon />, link: '/location' },
    { text: 'Community', icon: <PeopleIcon />, link: '/community' },
    { text: 'Join Us', icon: <GroupAddIcon />, link: '/join-us' },
  ];

  return (
  
    <div>
      {/* AppBar for Header */}
      <AppBar position="static" sx={{ backgroundColor: '#062536' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <div className="logo">
            <img src={logo} alt="Epicenter Logo" className="logo-img" style={{ width: '40px', height: '40px' }} onClick={() => navigate('/')}/> 
            <Typography variant="h6" sx={{ marginLeft: '10px', fontWeight: 'bold' }}>
              EPICENTER
            </Typography>
          </div>

          {/* Mobile menu button */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop nav links */}
          <div className="nav-links" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {menuItems.map((item) => (
              <Link to={item.link} key={item.text} className="nav-link">
                {item.text}
              </Link>
            ))}
          </div>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': { width: 240 },
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={item.text} component={Link} to={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}

export default Navbar;
