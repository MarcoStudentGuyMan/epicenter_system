import { createClient } from '@supabase/supabase-js';

// Public URL
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

// Anonymous Key
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

// Client for general operations (anonymous key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for service-level operations (service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Utility function to update user's app_metadata with role
export const updateUserRoleToAdmin = async (userId) => {
    try {
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            app_metadata: {
                role: 'admin',  // Assigning the role as 'admin'
            },
        });

        if (error) {
            throw error;
        }

        console.log('User role updated successfully', data);
        alert('User role updated to admin successfully!');
    } catch (error) {
        console.error('Error updating user role:', error.message);
        alert('Failed to update user role. Please try again.');
    }
};
