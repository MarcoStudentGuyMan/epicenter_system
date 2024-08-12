import React, { useState, useEffect } from 'react';
import { IonToggle, IonIcon, IonBreadcrumbs, IonBreadcrumb, IonButtons, IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { easel, home, notifications, personCircle, storefront, people, triangle, prism, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../Admin/Admin.css'; // Ensure you create this CSS file

function Sidebar() {
    console.log("Location: AdminProfile");
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
                <IonToggle checked={isOpen} onIonChange={toggleSidebar} />
            </div>
            <div className="sidebar-content">
                <nav>
                    <ul>
                        <li><span>Hello (user)</span></li>
                        <li className="title"><span>Home</span></li>
                        <li><IonIcon icon={easel} /><span><a onClick={() => navigate('/dashboard_admin')}>Dashboard</a></span></li>

                        <li className="title"><span>Account</span></li>
                        <li><IonIcon icon={personCircle} /><span><a onClick={() => navigate('/profile_admin')}>Profile</a></span></li>

                        <li className="title"><span>Environment</span></li>
                        <li><IonIcon icon={storefront} /><span><a onClick={() => navigate('/stall_admin')}>Stalls</a></span></li>
                        <li><IonIcon icon={people} /><span><a onClick={() => navigate('/tenant_admin')}>Tenants</a></span></li>

                        <li className="title"><span>Website Customization</span></li>
                        <li><IonIcon icon={triangle} /><span><a onClick={() => navigate('/epicentersite_admin')}>Epicenter Site</a></span></li>
                        <li><IonIcon icon={prism} /><span><a onClick={() => navigate('/minisite_admin')}>Mini Sites</a></span></li>

                        <li className="title"><span>Communication</span></li>
                        <li><IonIcon icon={mail} /><span><a onClick={() => navigate('/email_admin')}>Email</a></span></li>
                        <li><IonIcon icon={chatbubble} /><span><a onClick={() => navigate('/message_admin')}>Message</a></span></li>

                        <li className="title"><span>Rent Information</span></li>
                        <li><IonIcon icon={newspaper} /><span><a onClick={() => navigate('/rentbalance_admin')}>Rent Balance</a></span></li>
                        <li><IonIcon icon={calculator} /><span><a onClick={() => navigate('/rentautomation_admin')}>Rent Automation</a></span></li>
                        <li><IonIcon icon={exit} /><span><a onClick={() => navigate('/')}>Logout</a></span></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

function EditStallA() {
    const navigate = useNavigate(); // Correctly define `navigate` here

    const [selectedStalls, setSelectedStalls] = useState([]);

    const stallOptions = [
        { value: '1A', label: <span className="black-text">1A</span> },
        { value: '1B', label: <span className="black-text">1B</span> },
        { value: '1C', label: <span className="black-text">1C</span> },
        { value: '1D', label: <span className="black-text">1D</span> },
        { value: '1E', label: <span className="black-text">1E</span> },
        // Add more options as needed
    ];

    const handleStallChange = (selectedOptions) => {
        setSelectedStalls(selectedOptions);
    };

    return (
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

            <div className="page-title">
                Edit Stall Information
            </div>

            <div className="page-container">
                <IonBreadcrumbs className="breadcrumbs-container">
                    <IonBreadcrumb href="/dashboard_admin">
                        <IonIcon icon={home} className="icon" />
                        Home
                    </IonBreadcrumb>
                    <IonBreadcrumb href="/stall_admin">
                        Stalls
                    </IonBreadcrumb>
                    <IonBreadcrumb>
                        Edit Stall
                    </IonBreadcrumb>
                </IonBreadcrumbs>

                <section className="profileA-align">
                    <div className="noButtons">
                        <li>
                            <label>Stall Type: </label>
                            <select className='for-input'>
                                <option value="" disabled selected>Select Stall Type</option>
                                <option>Cafe and Pastry</option>
                                <option>Restaurant and Bar</option>
                                <option>Sweets and Desserts</option>
                                <option>Groceries</option>
                                <option>Others</option>
                            </select>
                        </li>
                        <li>
                            <label>Stall Unit/s:</label>
                            <div className="for-input">
            
                            <Select 
                                isMulti
                                options={stallOptions}
                                onChange={handleStallChange}
                                value={selectedStalls}
                                classNamePrefix="react-select"
                            />
                        </div>
                        </li>
                        <li>
                            <label>Business Name:</label>
                            <input className="for-input" placeholder="Enter Business Name" value="Hogwarts" size="30" />
                        </li>
                        <li>
                            <label>Business Description: </label>
                            <input className="for-input" placeholder="Enter Business Description" value="Medina" size="30" />
                        </li>
                       
                        <li>
                            <label>Tenant ID:</label>
                            <select className='for-input'>
                                <option value="" disabled selected>Select Tenant ID</option>
                                <option>sample tenant name</option>
                            </select>
                        </li>
                    
                    </div>
                    <div className="profile-image">
                        <img className="user-profile" src={`${process.env.PUBLIC_URL}/hogwarts.jpg`} alt="UserProfile" />
                        <p>Stall ID: 0012</p>
                    </div>
                    <div className="buttons">
                        <IonButtons>
                            <IonButton className="save-btn">Save</IonButton>
                            <IonButton className="delete-btn">Delete</IonButton>
                            <IonButton className="cancel-btn"> <a onClick={() => navigate('/stall_admin')}>Cancel</a></IonButton>
                        </IonButtons>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default EditStallA;
