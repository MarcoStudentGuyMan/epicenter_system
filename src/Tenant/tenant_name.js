import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseConnect';

const DrawerContext = createContext();

export function useDrawer() {
    return useContext(DrawerContext);
}

export function DrawerProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [tenantName, setTenantName] = useState('');

    // Fetch tenant data from Supabase when the component mounts
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
                    setTenantName(data.ten_FirstName); // Set tenant's first name
                }
            } catch (error) {
                console.error('Error fetching tenant data:', error.message);
            }
        };

        fetchTenantData();
    }, []);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <DrawerContext.Provider value={{ isOpen, toggleDrawer, tenantName }}>
            {children}
        </DrawerContext.Provider>
    );
}
