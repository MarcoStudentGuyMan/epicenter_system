import React, { useState, useEffect } from 'react';
import { IonToggle, IonIcon, IonApp, IonContent, IonItem } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { easel, notifications, personCircle, storefront, people, triangle, prism, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/dashboardA.css';
import '../styles/IonStyle.css';

function Sidebar() {
    const history = useHistory(); // useHistory for navigation
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <IonItem className="clear-item">
                    <IonToggle checked={isOpen} onIonChange={toggleSidebar} />
                </IonItem>
            </div>
            <div className="sidebar-content">
                <nav>
                    <ul>
                        <li><span>Hello (user)</span></li>
                        <li className="title"><span>Home</span></li>
                        <li><IonIcon icon={easel} /><span><a onClick={() => history.push('/dashboard_admin')}>Dashboard</a></span></li>

                        <li className="title"><span>Account</span></li>
                        <li><IonIcon icon={personCircle} /><span><a onClick={() => history.push('/profile_admin')}>Profile</a></span></li>

                        <li className="title"><span>Environment</span></li>
                        <li><IonIcon icon={storefront} /><span><a onClick={() => history.push('/stall_admin')}>Stalls</a></span></li>
                        <li><IonIcon icon={people} /><span><a onClick={() => history.push('/tenant_admin')}>Tenants</a></span></li>

                        <li className="title"><span>Website Customization</span></li>
                        <li><IonIcon icon={triangle} /><span><a onClick={() => history.push('/epicentersite_admin')}>Epicenter Site</a></span></li>
                        <li><IonIcon icon={prism} /><span><a onClick={() => history.push('/minisite_admin')}>Mini Sites</a></span></li>

                        <li className="title"><span>Communication</span></li>
                        <li><IonIcon icon={mail} /><span><a onClick={() => history.push('/email_admin')}>Email</a></span></li>
                        <li><IonIcon icon={chatbubble} /><span><a onClick={() => history.push('/message_admin')}>Message</a></span></li>

                        <li className="title"><span>Rent Information</span></li>
                        <li><IonIcon icon={newspaper} /><span><a onClick={() => history.push('/rentbalance_admin')}>Rent Balance</a></span></li>
                        <li><IonIcon icon={calculator} /><span><a onClick={() => history.push('/rentautomation_admin')}>Rent Automation</a></span></li>
                        <li><IonIcon icon={exit} /><span><a onClick={() => history.push('/')}>Logout</a></span></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

function DashboardA() {
    const history = useHistory();
    return (
        <IonApp>
            <IonContent>
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
                        <div className="dashboard-content">
                            This is Dashboard
                        </div>
                    </main>
                </div>
            </IonContent>
        </IonApp>
    );
}

export default DashboardA;
