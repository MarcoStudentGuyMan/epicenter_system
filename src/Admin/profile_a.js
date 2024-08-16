import React, { useState, useEffect } from 'react';
import { IonToggle, IonIcon, IonBreadcrumbs, IonBreadcrumb, IonButtons, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // useHistory for React Router v5
import { easel, home, notifications, personCircle, storefront, people, triangle, prism, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/profileA.css'; // Ensure you create this CSS file

function Sidebar() {
    console.log("Location: AdminProfile");
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
        handleResize(); // Check the initial window size

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

function ProfileA() {
    const history = useHistory(); // Correctly define `history` here

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

            <div className="page-title">
                Profile
            </div>

            <div className="page-container">
                <IonBreadcrumbs className="breadcrumbs-container">
                    <IonBreadcrumb onClick={() => history.push('/dashboard_admin')}>
                        <IonIcon icon={home} className="icon" />
                        Home
                    </IonBreadcrumb>
                    <IonBreadcrumb>
                        Profile
                    </IonBreadcrumb>
                </IonBreadcrumbs>

                <section className="profileA-align">
                    <div className="noButtons">
                        <li>
                            <label>First Name:</label>
                            <input className="for-input" placeholder="Enter First Name" value="Marco" size="30" />
                        </li>
                        <li>
                            <label>Last Name:</label>
                            <input className="for-input" placeholder="Enter Last Name" value="Medina" size="30" />
                        </li>
                        <li>
                            <label>Email:</label>
                            <input className="for-input" placeholder="Enter Email" value="marcofmedina@su.edu.ph" size="30" />
                        </li>
                        <li>
                            <label>Password:</label>
                            <input className="for-input" type="password" placeholder="Enter Password" size="30" />
                        </li>
                        <li>
                            <label>Contact #:</label>
                            <input className="for-input" placeholder="Enter Contact Number" value="09562905289" size="30" />
                        </li>
                    </div>
                    <div className="profile-image">
                        <img className="user-profile" src={`${process.env.PUBLIC_URL}/marco.jpg`} alt="UserProfile" />
                        <p>Manager ID: 0003</p>
                    </div>
                    <div className="buttons">
                        <IonButtons>
                            <IonButton className="save-btn">Save</IonButton>
                            <IonButton className="delete-btn">Delete</IonButton>
                            <IonButton className="cancel-btn">Cancel</IonButton>
                        </IonButtons>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ProfileA;
