import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home, personCircle, storefront, mail, chatbubble, newspaper, calculator, exit, pencil, people } from 'ionicons/icons';
import { supabase } from '../supabaseConnect';
import '../styles/dashboardT.css';  
import '../styles/dashboardA.css';



function SidebarT({ tenantName }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error.message);
            } else {
                navigate('/login_tenant');
            }
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };

    return (
        <div className="tenantSide-sidebar">
            <div className="user-greeting">
                Hello, {tenantName}!
            </div>
            <div className="sidebar-content">
                <ul>
                    <li className="title">Home</li>
                    <li onClick={() => navigate('/dashboard_tenant')}>
                        <IonIcon icon={home} />
                        <span>Dashboard</span>
                    </li>

                    <li className="title">Account</li>
                    <li onClick={() => navigate('/profile_tenant')}>
                        <IonIcon icon={personCircle} />
                        <span>Profile</span>
                    </li>

                    <li className="title">Website Customization</li>
                    <li onClick={() => navigate('/minisites_tenant')}>
                        <IonIcon icon={pencil} />
                        <span>Mini Sites</span>
                    </li>

                    <li className="title">Communication</li>
                    <li onClick={() => navigate('/email_tenant')}>
                        <IonIcon icon={mail} />
                        <span>Email</span>
                    </li>
                    <li onClick={() => navigate('/forum_tenant')}>
                        <IonIcon icon={chatbubble} />
                        <span>Forum</span>
                    </li>

                    <li className="title">Rent Information</li>
                    <li onClick={() => navigate('/rentbalance_tenant')}>
                        <IonIcon icon={newspaper} />
                        <span>Rent Balance</span>
                    </li>

                    <li onClick={handleLogout}>
                        <IonIcon icon={exit} />
                        <span>Logout</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

function TenantLayout({ children }) {
    const navigate = useNavigate();
    const [tenantName, setTenantName] = useState('');

    useEffect(() => {
        const fetchTenantData = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                const userEmail = session?.user?.email;
                if (userEmail) {
                    const { data, error } = await supabase
                        .from('TENANT')
                        .select('ten_FirstName')
                        .eq('ten_Email', userEmail)
                        .single();

                    if (error) throw error;
                    setTenantName(data.ten_FirstName);
                }
            } catch (error) {
                console.error('Error fetching tenant data:', error.message);
            }
        };

        fetchTenantData();
    }, []);

    return (
        <IonApp>
            <div className="app-container">
                <SidebarT tenantName={tenantName} />
                <header className="tenantSide-header">
                    <div className="header-left">
                        <a onClick={() => navigate('/dashboard_tenant')}>
                            <img className="tenant-logo-nav" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                        </a>
                        <span className="tenant-app-name">Epicenter</span>
                    </div>
                    <div className="header-right">
                        <a onClick={() => navigate('/email_tenant')}>
                            <IonIcon icon={mail} className="icon" />
                        </a>
                        <IonIcon icon={people} className="icon" />
                    </div>
                </header>
                <main className="tenantSide-main-content">
                    {children} {/* Render page-specific content */}
                </main>
            </div>
        </IonApp>
    );
}

export default TenantLayout;
