import React, { useState, useEffect } from 'react';
import { IonToggle, IonIcon, IonBreadcrumbs, IonBreadcrumb, IonButtons, IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { easel,notifications, personCircle,pencil,cube, trash, storefront, people, triangle, prism,home, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/stallA.css'; 
import '../styles/Stall.css'; 
import { supabase } from '../supabaseConnect';
import MiniDrawer from './drawer_admin'; // Ensure this file is correctly imported

function StallA() {
    const navigate = useNavigate();
    const [selectedStalls, setSelectedStalls] = useState([]);
    const [data, setData] = useState([]);
    
    const [drawerOpen, setDrawerOpen] = useState(true);
    const handleDrawerToggle = (isOpen) => {
        setDrawerOpen(isOpen);
    };
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

    const handleDelete = async (stallId) => {
        const { error } = await supabase
            .from('STALL')
            .delete()
            .eq('stall_id', stallId);

        if (error) {
            console.error('Error deleting stall:', error);
        } else {
            setData(data.filter((item) => item.stall_id !== stallId));
        }
    };

    const handleStallChange = (selectedOptions) => {
        setSelectedStalls(selectedOptions);
    };


    const stallOptions = [
        { value: '1A', label: <span className="black-text">1A</span> },
        { value: '1B', label: <span className="black-text">1B</span> },
        { value: '1C', label: <span className="black-text">1C</span> },
        { value: '1D', label: <span className="black-text">1D</span> },
        { value: '1E', label: <span className="black-text">1E</span> },
        // Add more options as needed
    ];

  

    return (
        <div className="app-container">
            <MiniDrawer onDrawerToggle={handleDrawerToggle} />
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

                <section className="profile-Align">
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
                                        <button className="edit">
                                            <IonIcon icon={pencil} className="edit" />
                                            <a onClick={() => navigate('/editstall_admin')}>Edit</a>
                                        </button>
                                        <button className="delete" onClick={() => handleDelete(item.stall_id)}>
                                            <IonIcon icon={trash} className="delete" />Delete
                                        </button>
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