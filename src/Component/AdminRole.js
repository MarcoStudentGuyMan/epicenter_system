import React, { useEffect } from 'react';
import { updateUserRoleToAdmin } from '../supabaseConnect'; // Ensure the path is correct

function AssignAdminRole() {
    useEffect(() => {
        // Replace this userId with the actual one from Supabase Auth
        const userId = 'df5ab8d7-63eb-4304-8233-d1096f07ac67';  // Example UID of the user

        updateUserRoleToAdmin(userId);
    }, []);

    return (
        <div>
            <h1>YOU ARE NOW AN ADMIN!!!!!! HUHUHUHUHUHUHUHU</h1>
        </div>
    );
}

export default AssignAdminRole;
