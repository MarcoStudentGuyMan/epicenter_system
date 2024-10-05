import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase, supabaseAdmin } from '../supabaseConnect'; // Make sure supabaseAdmin is imported
import { Container, Box, TextField, Button, Typography, Alert, IconButton, InputAdornment } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

function PasswordRecovery() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token'); // Get the token from the URL

    useEffect(() => {
        const validateToken = async () => {
            const { data: tenant, error } = await supabase
                .from('TENANT')
                .select('ten_UID, reset_token_expires')
                .eq('reset_token', token)
                .single();

            // Redirect if token does not exist
            if (error || !tenant) {
                navigate('/expired-token');
                return;
            }

               // Check if the token is expired
             const currentTime = new Date().toISOString();
             if (tenant.reset_token_expires < currentTime) {
            navigate('/expired-token');
            return;
        }
        };

        validateToken();
    }, [token, navigate]);

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        try {
            // Fetch tenant information using the token
            const { data: tenant, error: tenantQueryError } = await supabase
                .from('TENANT')
                .select('ten_UID, ten_Email')
                .eq('reset_token', token)
                .single();

            if (tenantQueryError || !tenant) {
                setPasswordError('Invalid or expired token.');
                return;
            }

            const userId = tenant.ten_UID;
            

            // Update password in the TENANT table
            const { error: tenantError } = await supabase
                .from('TENANT')
                .update({
                    ten_password: newPassword,
                    reset_token: null,
                    reset_token_expires: null // Clear the token and expiration after use
                })
                .eq('ten_UID', userId);

            if (tenantError) {
                setPasswordError('Failed to reset password in Tenant table.');
                return;
            }

            // Update password in Supabase Auth using the admin client
            const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword });

            if (authError) {
                setPasswordError('Failed to reset password in Supabase Auth.');
                return;
            }

            setSuccessMessage('Password has been successfully reset!');
            setTimeout(() => navigate('/login_tenant'), 3000); // Redirect to login page after success
        } catch (error) {
            setPasswordError('An unexpected error occurred. Please try again.');
        }
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
                                <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
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
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

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
