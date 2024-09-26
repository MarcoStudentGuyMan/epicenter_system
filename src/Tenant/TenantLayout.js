import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home, personCircle,prism,triangle, storefront, mail, chatbubble, newspaper, calculator, exit, pencil, people } from 'ionicons/icons';
import { supabase } from '../supabaseConnect';
import '../styles/dashboardT.css';  
import '../styles/dashboardA.css';


import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Admin/header_admin';
import '../styles/HeaderAdmin.css';
import { useDrawer } from '../Admin/drawerContext'; // Use the drawer context





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
