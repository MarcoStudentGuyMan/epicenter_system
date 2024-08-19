import React, { useState, useEffect } from 'react';
import { IonToggle, IonIcon, IonBreadcrumbs, IonBreadcrumb, IonButtons, IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { easel,notifications, personCircle,pencil, trash, storefront, people, triangle, prism,home, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/stallA.css'; 
import '../styles/Stall.css'; 
import Switch from '@mui/material/Switch';
import supabase from '../supabaseClient';

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
                        <li><span>Hello (user)</span> </li>
                        <li className="title"><span>Home</span></li>
                        <li><IonIcon icon={easel} /><span><a onClick={() => navigate('/dashboard_admin')}>Dashboard</a></span></li>

                        <li className="title"><span>Account</span></li>
                        <li><IonIcon icon={personCircle} /> <span><a onClick={() => navigate('/profile_admin')}>Profile</a></span></li>

                        <li className="title"><span>Environment</span></li>
                        <li><IonIcon icon={storefront} /> <span><a onClick={() => navigate('/stall_admin')}>Stalls</a></span></li>
                        <li><IonIcon icon={people} /> <span><a onClick={() => navigate('/tenant_admin')}>Tenants</a></span></li>

                        <li className="title"><span>Website Customization</span></li>
                        <li><IonIcon icon={triangle} /> <span><a onClick={() => navigate('/epicentersite_admin')}>Epicenter Site</a></span></li>
                        <li><IonIcon icon={prism} /> <span><a onClick={() => navigate('/minisite_admin')}>Mini Sites</a></span></li>

                        <li className="title"><span>Communication</span></li>
                        <li><IonIcon icon={mail} /> <span><a onClick={() => navigate('/email_admin')}>Email</a></span></li>
                        <li><IonIcon icon={chatbubble} /> <span><a onClick={() => navigate('/message_admin')}>Message</a></span></li>

                        <li className="title"><span>Rent Information</span></li>
                        <li><IonIcon icon={newspaper} /> <span><a onClick={() => navigate('/rentbalance_admin')}>Rent Balance</a></span></li>
                        <li><IonIcon icon={calculator} /> <span><a onClick={() => navigate('/rentautomation_admin')}>Rent Automation</a></span></li>
                        <li><IonIcon icon={exit} /> <span><a onClick={() => navigate('/loginHere')}>Logout</a></span></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

function StallA() {
    const navigate = useNavigate();
    const [selectedStalls, setSelectedStalls] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: tableData, error } = await supabase
                .from('STALL')
                .select('stall_id, s_bus_name, s_desc, s_type, s_logo, ten_id');
            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setData(tableData);
            }
        };

        fetchData();
    }, []);

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
                {/* Header content remains unchanged... */}
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
                    {/* Form content remains unchanged... */}

                    <table className="stalls-table">
                        <thead>
                            <tr>
                                <th>Stall ID</th>
                                <th>Stall Name</th>
                                <th>Stall Description</th>
                                <th>Stall Type</th>
                                <th>Business Logo</th>
                                <th>Tenant ID</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.stall_id}>
                                    <td>{item.stall_id}</td>
                                    <td>{item.s_bus_name}</td>
                                    <td>{item.s_desc}</td>
                                    <td>{item.s_type}</td>
                                    <td>
                                        <img src={item.s_logo} alt={item.s_bus_name} style={{ width: '50px', height: '50px' }} />
                                    </td>
                                    <td>{item.ten_id}</td>
                                    <td className="actions">
                                        <button className="edit"><IonIcon icon={pencil} className="edit" /><a onClick={() => navigate('/editstall_admin')}>Edit</a></button>
                                        <button className="delete"><IonIcon icon={trash} className="delete" />Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
}

export default StallA;