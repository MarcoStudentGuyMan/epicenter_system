import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase, supabaseAdmin } from '../supabaseConnect';
import { Container, Box, TextField, Button, Typography, Alert, IconButton, InputAdornment } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

function PasswordRecovery() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false); // Show/hide new password
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Show/hide confirm password

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
            const { data: tenant, error: tenantQueryError } = await supabase
                .from('TENANT')
                .select('ten_UID')
                .eq('ten_Email', email)
                .single();

            if (tenantQueryError || !tenant) {
                setPasswordError('No account associated with this email.');
                return;
            }

            const userId = tenant.ten_UID;  

            const { error: tenantError } = await supabase
                .from('TENANT')
                .update({ ten_password: newPassword })  
                .eq('ten_Email', email);

            if (tenantError) {
                setPasswordError('Failed to reset password in Tenant table.');
                return;
            }

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

    // Toggle password visibility for new password
    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    // Toggle password visibility for confirm password
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '50px' }}>
            <Box sx={{ boxShadow: 3, p: 3, borderRadius: 2 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Reset Your Password
                </Typography>

                {/* Error message */}
                {passwordError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {passwordError}
                    </Alert>
                )}

                {/* Success message */}
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                {/* New password field with visibility toggle */}
                <TextField
                    fullWidth
                    variant="outlined"
                    label="New password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={toggleNewPasswordVisibility}>
                                    {showNewPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Confirm password field with visibility toggle */}
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Confirm password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={toggleConfirmPasswordVisibility}>
                                    {showConfirmPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Reset password button */}
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handlePasswordReset}
                >
                    Reset Password
                </Button>
            </Box>
        </Container>
    );
}

export default PasswordRecovery;
