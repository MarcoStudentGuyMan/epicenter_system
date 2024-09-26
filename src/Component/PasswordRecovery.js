import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase, supabaseAdmin } from '../supabaseConnect';

function PasswordRecovery() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email'); // Get the email from the URL

    // Handle Password Reset
    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        try {
            // Step 1: Retrieve the user's UUID from the TENANT table using the email
            const { data: tenant, error: tenantQueryError } = await supabase
                .from('TENANT')
                .select('ten_UID')
                .eq('ten_Email', email)
                .single();

            if (tenantQueryError || !tenant) {
                setPasswordError('No account associated with this email.');
                return;
            }

            const userId = tenant.ten_UID;  // Get the UUID from the TENANT table

            // Step 2: Update the password in the TENANT table
            const { error: tenantError } = await supabase
                .from('TENANT')
                .update({ ten_password: newPassword })  // Update the password in the TENANT table
                .eq('ten_Email', email);

            if (tenantError) {
                setPasswordError('Failed to reset password in Tenant table.');
                return;
            }

            // Step 3: Use supabaseAdmin to update the user's password in Supabase Auth using UUID (ten_UID)
            const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword });

            if (authError) {
                setPasswordError('Failed to reset password in Auth table.');
                return;
            }

            setSuccessMessage('Password has been successfully reset!');
        } catch (error) {
            setPasswordError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h2>Reset Your Password</h2>
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handlePasswordReset}>Reset Password</button>
        </div>
    );
}

export default PasswordRecovery;