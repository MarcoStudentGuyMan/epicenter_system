import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseConnect'; // Import Supabase connection

const PrivateRoute = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the current session using the latest Supabase method
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);  // Stop loading once session is fetched
        };
        fetchSession();
    }, []);

    if (loading) {
        // Render a loading state or spinner while session is being fetched
        return <div>Loading...</div>;
    }

    return session ? children : <Navigate to="/loginHere" />;
};

export default PrivateRoute;
