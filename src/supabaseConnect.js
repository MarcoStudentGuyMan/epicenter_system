import { createClient } from '@supabase/supabase-js';

// Public URL
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

// Anonymous Key
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

// Client for general operations (anonymous key)
export const supabase = createClient('https://vnwxutipllobsnupbouk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZud3h1dGlwbGxvYnNudXBib3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI3MDY4MjcsImV4cCI6MjAzODI4MjgyN30.VJRUreBVy5jZA7piH_6yhXm9VtWWlPMDFtTbB7_NXf8');

// Admin client for service-level operations (service role key)
export const supabaseAdmin = createClient('https://vnwxutipllobsnupbouk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZud3h1dGlwbGxvYnNudXBib3VrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjcwNjgyNywiZXhwIjoyMDM4MjgyODI3fQ.a2gck9JDEsHbx19CN9eye0NjWIKFacR7_IRdlWtOsYc');

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
