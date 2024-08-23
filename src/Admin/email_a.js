import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react'; 
import { useNavigate } from 'react-router-dom';

import { easel, notifications, personCircle, cube, storefront, people, triangle, prism, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/dashboardA.css';  

import Switch from '@mui/material/Switch';

function Sidebar() {
    console.log("Location: Dashboard");
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleResize = () => {
        if (window.innerWidth < 768) { // Adjust the width threshold as needed
            setIsOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Check the initial window size

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
               
                <Switch 
                    checked={isOpen} 
                    onChange={toggleSidebar} 
                    inputProps={{ 'aria-label': 'Switch sidebar' }} 
                />
            </div>
            <div className="sidebar-content">
                <nav>
                    <ul>
                        <li><span style={{ fontSize: '18px', marginRight: '5px' }}>Hello (user)</span> </li>
                        <li className="title"><span>Home</span></li>
                        <li><IonIcon icon={easel} style={{ fontSize: '18px', marginRight: '5px' }} /><span><a onClick={() => navigate('/dashboard_admin')}>Dashboard</a></span></li>

                        <li className="title"><span>Account</span></li>
                        <li><IonIcon icon={personCircle}style={{ fontSize: '18px', marginRight: '5px' }} /> <span><a onClick={() => navigate('/profile_admin')}>Profile</a></span></li>

                        <li className="title"><span>Environment</span></li>
                        <li><IonIcon icon={cube} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/unit_stall_admin')}>Stall Units</a></span></li>
                        <li><IonIcon icon={storefront} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/stall_admin')}>Stalls</a></span></li>
                        <li><IonIcon icon={people} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/tenant_admin')}>Tenants</a></span></li>
                        
                        <li className="title"><span>Website Customization</span></li>
                        <li><IonIcon icon={triangle} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/epicentersite_admin')}>Epicenter Site</a></span></li>
                        <li><IonIcon icon={prism} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/minisite_admin')}>Mini Sites</a></span></li>

                        <li className="title"><span>Communication</span></li>
                        <li><IonIcon icon={mail} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/email_admin')}>Email</a></span></li>
                        <li><IonIcon icon={chatbubble} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/message_admin')}>Message</a></span></li>

                        <li className="title"><span>Rent Information</span></li>
                        <li><IonIcon icon={newspaper} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/rentbalance_admin')}>Rent Balance</a></span></li>
                        <li><IonIcon icon={calculator} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/rentautomation_admin')}>Rent Automation</a></span></li>
                        <li><IonIcon icon={exit} style={{ fontSize: '18px', marginRight: '5px' }}/> <span><a onClick={() => navigate('/loginHere')}>Logout</a></span></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

function DashboardA() {
    const navigate = useNavigate();
    return (
        <IonApp>
            <div className="app-container">
                <Sidebar />
                <header className="app-header">
                    <div className="header-left">
                        <a onClick={() => navigate('/dashboard_admin')}>
                            <img className="logo-nav" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                        </a>
                        <span className="app-name">Epicenter</span>
                    </div>
                    <div className="header-right">
                        <a onClick={() => navigate('/email_admin')}>
                            <IonIcon icon={mail} className="icon" />
                        </a>
                        <IonIcon icon={notifications} className="icon" />
                    </div>
                </header>
                <main className="main-content">
                    <div className="dashboard-content">
                        This is EMAIL
                    </div>
                </main>
            </div>
        </IonApp>
    );
}

export default DashboardA;
