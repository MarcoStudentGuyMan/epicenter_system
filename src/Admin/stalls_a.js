import React, { useState, useEffect } from 'react';
import { IonToggle, IonIcon, IonBreadcrumbs, IonBreadcrumb, IonButtons, IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { easel,notifications, personCircle,pencil,cube, trash, storefront, people, triangle, prism,home, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/stallA.css'; 
import '../styles/Stall.css'; 
import Switch from '@mui/material/Switch';

function Sidebar() {
    console.log("Location: Stall");
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

function StallA() {
    const navigate = useNavigate();
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
            <div className="page-title">Stalls</div>
            <div className="page-container">
                <IonBreadcrumbs className="breadcrumbs-container">
                    <IonBreadcrumb href="/dashboard_admin">
                        <IonIcon icon={home} className="icon" /> Home
                    </IonBreadcrumb>
                    <IonBreadcrumb>Stalls</IonBreadcrumb>
                </IonBreadcrumbs>

                <section className="profile-Align">
                    <div className="stall-form">
                        <div className="form-group">
                            <label>Business Name:</label>
                            <input placeholder="Enter Business Name" />
                        </div>
                        <div className="form-group">
                            <label>Business Description:</label>
                            <input placeholder="Enter Business Description" />
                        </div>
                        
                        <div className="form-group">
                            <label>Tenant ID:</label>
                            <select>
                                <option value="" disabled selected>Select Tenant ID</option>
                                <option>Sample Tenant ID</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Stall Type:</label>
                            <select>
                                <option value="" disabled selected>Select Stall Type</option>
                                <option>Cafe and Pastry</option>
                                <option>Restaurant and Bar</option>
                                <option>Sweets and Desserts</option>
                                <option>Groceries</option>
                                <option>Others</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Stall Unit/s:</label>
                            <Select 
                                isMulti
                                options={stallOptions}
                                onChange={handleStallChange}
                                value={selectedStalls}
                                classNamePrefix="react-select"
                            />
                        </div>
                        <div className="form-group">
                            <label>Business Logo:</label>
                            <div className="business-logo-field">
                                <input type="file" />
                                <button>Add</button>
                            </div>
                        </div>
                    </div>

                    <table className="stalls-table">
                        <thead>
                            <tr>
                                <th>Stall ID</th>
                                <th>Stall Unit/s</th>
                                <th>Stall Type</th>
                                <th>Tenant ID</th>
                                <th>Tenant Name</th>
                                <th>Business Logo</th>
                                <th>Business Name</th>
                                <th>Business Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>0011</td>
                                <td>1A, 1B, 1C</td>
                                <td>Sweets</td>
                                <td>1000</td>
                                <td>Bobby Lee</td>
                                <td>FriendsLogo.png</td>
                                <td>Friends</td>
                                <td>Selling delicious Fruit Candy</td>
                                <td className="actions">
                                    <button className="edit"><IonIcon icon={pencil} className="edit" /><a onClick={() => navigate('/editstall_admin')}>Edit</a></button>
                                    <button className="delete"><IonIcon icon={trash} className="delete" />Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
}

export default StallA;