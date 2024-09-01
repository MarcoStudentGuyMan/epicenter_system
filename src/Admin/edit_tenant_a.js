import React, { useState, useEffect } from 'react';
import { IonIcon, IonBreadcrumbs, IonBreadcrumb } from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { home, notifications, mail } from 'ionicons/icons';
import MiniDrawer from './drawer_admin';
import CustomButton from '../Component/Buttons';
import { supabase } from '../supabaseConnect';

function EditTenantA() {

    const navigate = useNavigate();
    const { ten_id } = useParams();
    const hardcodedTenId = 'TEN-24-001'; // Replace with an actual tenant ID from your database

    // Log the retrieved tenant ID
    useEffect(() => {
        console.log('Retrieved ten_id from URL:', ten_id || hardcodedTenId);
    }, [ten_id]);

    const [tenant, setTenant] = useState({
        ten_FirstName: '',
        ten_LastName: '',
        ten_ContactNum: '',
        ten_Email: '',
        ten_Password: '',
        ten_ProfilePic: '',
    });

    useEffect(() => {
        const fetchTenant = async () => {
            const idToFetch = ten_id || hardcodedTenId;
            if (!idToFetch) {
                console.error('ten_id is undefined');
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('TENANT')
                    .select('*')
                    .eq('ten_id', idToFetch)
                    .single();

                if (error) {
                    console.error('Error fetching tenant:', error);
                } else {
                    console.log('Fetched tenant data:', data);
                    setTenant(data);
                }
            } catch (err) {
                console.error('Error during tenant fetch:', err);
            }
        };

        fetchTenant();
    }, [ten_id, hardcodedTenId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTenant({
            ...tenant,
            [name]: value,
        });
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from('TENANT')
                .update({
                    ten_FirstName: tenant.ten_FirstName,
                    ten_LastName: tenant.ten_LastName,
                    ten_ContactNum: tenant.ten_ContactNum,
                    ten_Email: tenant.ten_Email,
                })
                .eq('ten_id', ten_id || hardcodedTenId);

            if (error) {
                console.error('Error updating tenant:', error);
            } else {
                console.log('Tenant updated successfully');
                navigate('/tenant_admin');
            }
        } catch (err) {
            console.error('Error during tenant update:', err);
        }
    };

    return (
        <div className="app-container">
            <MiniDrawer onDrawerToggle={() => {}} />
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
                Edit Tenant Profile
            </div>

            <div className="page-container">
                <IonBreadcrumbs className="breadcrumbs-container">
                    <IonBreadcrumb href="/dashboard_admin">
                        <IonIcon icon={home} className="icon" />
                        Home
                    </IonBreadcrumb>
                    <IonBreadcrumb href="/tenant_admin">
                        Tenants
                    </IonBreadcrumb>
                    <IonBreadcrumb>
                        Edit Tenant
                    </IonBreadcrumb>
                </IonBreadcrumbs>

                <section className="profileA-align">
                    <div className="noButtons">
                        <li>
                            <label>First Name:</label>
                            <input
                                className="for-input"
                                name="ten_FirstName"
                                placeholder="Enter First Name"
                                value={tenant.ten_FirstName}
                                size="30"
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Last Name:</label>
                            <input
                                className="for-input"
                                name="ten_LastName"
                                placeholder="Enter Last Name"
                                value={tenant.ten_LastName}
                                size="30"
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Contact #:</label>
                            <input
                                className="for-input"
                                name="ten_ContactNum"
                                placeholder="Enter Contact Number"
                                value={tenant.ten_ContactNum}
                                size="30"
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Email:</label>
                            <input
                                className="for-input"
                                name="ten_Email"
                                placeholder="Enter Email"
                                value={tenant.ten_Email}
                                size="30"
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Password:</label>
                            <input
                                className="for-input"
                                type="password"
                                name="ten_Password"
                                placeholder="Enter Password"
                                size="30"
                                onChange={handleInputChange}
                            />
                        </li>
                    </div>
                    <div className="profile-image">
                        <img className="user-profile" src={tenant.ten_ProfilePic} alt="UserProfile" />
                        <p>Tenant ID: {ten_id || hardcodedTenId}</p>
                    </div>
                    <div className="buttons">
                        <CustomButton color="primary" variant="contained" onClick={handleSave}>Save</CustomButton>
                        <CustomButton color="error" variant="contained" onClick={() => { /* Handle Delete */ }}>Delete</CustomButton>
                        <CustomButton color="warning" variant="contained" onClick={() => navigate('/tenant_admin')}>Cancel</CustomButton>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default EditTenantA;
