import React, { useEffect } from 'react';
import { updateUserRoleToAdmin } from '../supabaseConnect'; // Ensure the path is correct

function AssignAdminRole() {
    useEffect(() => {
        // Replace this userId with the actual one from Supabase Auth
        const userId = '3997321f-2b01-43dd-a00c-447074b8bb09';  // Example UID of the user

        updateUserRoleToAdmin(userId);
    }, []);

    return (
        <div>
            <h1>YOU ARE NOW AN ADMIN!!!!!! HUHUHUHUHUHUHUHU</h1>
        </div>
    );
}

export default AssignAdminRole;
