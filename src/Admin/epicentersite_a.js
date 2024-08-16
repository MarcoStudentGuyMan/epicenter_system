import React, { useState, useEffect } from 'react';
import { IonToggle, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
    easel, notifications, personCircle, storefront, people,
    triangle, prism, mail, chatbubble, newspaper, calculator, exit
} from 'ionicons/icons';
import '../styles/epicenterA.css'; // Ensure this CSS file exists and is properly styled

function Sidebar() {
    console.log("Location: Epicenter Site");
    const history = useHistory();
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
        handleResize(); // Initial check for window size

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const navigateTo = (path) => {
        history.push(path);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <IonToggle checked={isOpen} onIonChange={toggleSidebar} />
            </div>
            <div className="sidebar-content">
                <nav>
                    <ul>
                        <li><span>Hello (user)</span></li>
                        <li className="title"><span>Home</span></li>
                        <li onClick={() => navigateTo('/dashboard_admin')}>
                            <IonIcon icon={easel} /><span>Dashboard</span>
                        </li>
                        <li className="title"><span>Account</span></li>
                        <li onClick={() => navigateTo('/profile_admin')}>
                            <IonIcon icon={personCircle} /><span>Profile</span>
                        </li>
                        <li className="title"><span>Environment</span></li>
                        <li onClick={() => navigateTo('/stall_admin')}>
                            <IonIcon icon={storefront} /><span>Stalls</span>
                        </li>
                        <li onClick={() => navigateTo('/tenant_admin')}>
                            <IonIcon icon={people} /><span>Tenants</span>
                        </li>
                        <li className="title"><span>Website Customization</span></li>
                        <li onClick={() => navigateTo('/epicentersite_admin')}>
                            <IonIcon icon={triangle} /><span>Epicenter Site</span>
                        </li>
                        <li onClick={() => navigateTo('/minisite_admin')}>
                            <IonIcon icon={prism} /><span>Mini Sites</span>
                        </li>
                        <li className="title"><span>Communication</span></li>
                        <li onClick={() => navigateTo('/email_admin')}>
                            <IonIcon icon={mail} /><span>Email</span>
                        </li>
                        <li onClick={() => navigateTo('/message_admin')}>
                            <IonIcon icon={chatbubble} /><span>Message</span>
                        </li>
                        <li className="title"><span>Rent Information</span></li>
                        <li onClick={() => navigateTo('/rentbalance_admin')}>
                            <IonIcon icon={newspaper} /><span>Rent Balance</span>
                        </li>
                        <li onClick={() => navigateTo('/rentautomation_admin')}>
                            <IonIcon icon={calculator} /><span>Rent Automation</span>
                        </li>
                        <li onClick={() => navigateTo('/loginHere')}>
                            <IonIcon icon={exit} /><span>Logout</span>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

function EpicenterA() {
    const history = useHistory();

    return (
        <div className="app-container">
            <Sidebar />
            <header className="app-header">
                <div className="header-left">
                    <a onClick={() => history.push('/dashboard_admin')}>
                        <img className="logo-nav" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                    </a>
                    <span className="app-name">Epicenter</span>
                </div>
                <div className="header-right">
                    <a onClick={() => history.push('/email_admin')}>
                        <IonIcon icon={mail} className="icon" />
                    </a>
                    <IonIcon icon={notifications} className="icon" />
                </div>
            </header>
            <main className="main-content">
                {/* Your main content goes here */}
                This is Epicenter Site
            </main>
        </div>
    );
}

export default EpicenterA;
