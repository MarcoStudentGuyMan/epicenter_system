import React from 'react';
import { IonIcon } from '@ionic/react';
import { notifications, idCardOutline } from 'ionicons/icons';
import { Badge, Popover, Typography } from '@mui/material';
import '../styles/HeaderAdmin.css'

function Header({ drawerOpen, handleDrawerToggle, handleClick, anchorEl, handleClose, navigate }) {
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <header className="adminSide-header" style={{ marginLeft: drawerOpen ? 240 : 60, transition: 'margin-left 0.3s' }}>
             <div className="header-left">
    <a onClick={() => navigate('/dashboard_admin')}>
      <img className="logo-nav" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
    </a>
    <span className="app-name">Epicenter</span>
  </div>
  
  {/* Notification Icon Section */}
  <div className='icon-wrapper'>    
                <Badge badgeContent={4} color="error">
                  <IonIcon icon={notifications} className="icon" onClick={handleClick} />
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
                >
                    <Typography sx={{ p: 2 }}>MESSAGE SENT</Typography>
                </Popover>
            </div>
        </header>
    );
}

export default Header;
