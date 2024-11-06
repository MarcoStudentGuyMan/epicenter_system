import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase, supabaseAdmin } from '../supabaseConnect';
import { Container, Box, TextField, Button, Typography, Alert, IconButton, InputAdornment } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

function AdminPasswordRecovery() {
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
            const { data: manager, error } = await supabase
                .from('MANAGER')
                .select('Manager_UID, reset_token_expires')
                .eq('reset_token', token)
                .single();

            if (error || !manager) {
                navigate('/expired-token');
                return;
            }

            const currentTime = new Date().toISOString();
            if (manager.reset_token_expires < currentTime) {
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
            // Fetch manager information using the token
            const { data: manager, error: managerQueryError } = await supabase
                .from('MANAGER')
                .select('Manager_UID, Manager_Email')
                .eq('reset_token', token)
                .single();

            if (managerQueryError || !manager) {
                setPasswordError('Invalid or expired token.');
                return;
            }

            const managerId = manager.Manager_UID;

            // Update password in the MANAGER table
            const { error: managerError } = await supabase
                .from('MANAGER')
                .update({
                    Manager_Password: newPassword,
                    reset_token: null,
                    reset_token_expires: null // Clear the token and expiration after use
                })
                .eq('Manager_UID', managerId);

            if (managerError) {
                setPasswordError('Failed to reset password in Manager table.');
                return;
            }

            // Update password in Supabase Auth using the admin client
            const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(managerId, { password: newPassword });

            if (authError) {
                setPasswordError('Failed to reset password in Supabase Auth.');
                return;
            }

            setSuccessMessage('Password has been successfully reset!');
            setTimeout(() => navigate('/login_admin'), 3000); // Redirect to login page after success
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

                {passwordError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {passwordError}
                    </Alert>
                )}

                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

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

export default AdminPasswordRecovery;
