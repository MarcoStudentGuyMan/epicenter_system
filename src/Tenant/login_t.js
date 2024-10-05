import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { supabase, supabaseAdmin } from '../supabaseConnect';
import styles from '../styles/loginPageT.module.css';  
import CustomAlert from '../Component/Alerts'; 
import CustomButton from '../Component/Buttons';
import { Modal, Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';  
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { sendPasswordResetEmail } from '../Email/EmailPassword';
import { Alert } from '@mui/material';
import { v4 as uuidv4 } from 'uuid'; // For generating unique tokens 

function LoginT() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0); 
    const [isLocked, setIsLocked] = useState(false); 
    const [openModal, setOpenModal] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); 
    const [timeLeft, setTimeLeft] = useState(60); 
    const [showTimerOnPage, setShowTimerOnPage] = useState(false); 
    const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false); 
    const [forgotEmail, setForgotEmail] = useState(''); 
    const [forgotErrorMessage, setForgotErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');  // Success message state

    // Check localStorage for lockout state on page load
    useEffect(() => {
        const lockoutExpiration = localStorage.getItem('tenantLockoutExpiration');
        if (lockoutExpiration && new Date().getTime() < parseInt(lockoutExpiration)) {
            setIsLocked(true);
            setOpenModal(true);
            const remainingTime = Math.ceil((parseInt(lockoutExpiration) - new Date().getTime()) / 1000);
            setTimeLeft(remainingTime);
        }
    }, []);

    useEffect(() => {
        let timer;
        if (isLocked && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsLocked(false);
            setLoginAttempts(0);
            localStorage.removeItem('tenantLockoutExpiration');
            setShowTimerOnPage(false); 
        }
        return () => clearInterval(timer);
    }, [isLocked, timeLeft]);

    const handleCloseModal = () => {
        setOpenModal(false);
        setShowTimerOnPage(true); 
    };

    const handleLogin = async () => {
        if (isLocked) {
            setOpenModal(true);
            return;
        }
    
        const newErrors = {};
        if (!username) {
            newErrors.username = 'Email is required';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: username,
                password: password,
            });
    
            if (error) {
                setLoginAttempts(prev => prev + 1); 
                if (loginAttempts + 1 >= 5) {
                    const lockoutTime = new Date().getTime() + 60000; 
                    setIsLocked(true);
                    setOpenModal(true);
                    localStorage.setItem('tenantLockoutExpiration', lockoutTime); 
                    setTimeLeft(60); 
                }
                setErrors({ general: 'Invalid login credentials' });
            } else {
                const user = data.user;
    
                // Store the tenant session in localStorage
                localStorage.setItem('tenantSession', JSON.stringify(data));
    
                if (user?.user_metadata?.role !== 'tenant') {
                    setErrors({ general: 'Unauthorized. You must be a tenant to access this page.' });
                    await supabase.auth.signOut(); 
                    return;
                }
                setSuccess(true);
                setIsLoading(true); 
                setTimeout(() => {
                    navigate('/dashboard_tenant'); 
                }, 2000); 
            }
        } catch (error) {
            setErrors({ general: 'Login failed. Please try again.' });
        }
    };
    

    useEffect(() => {
        if (errors.general || success) {
            const timer = setTimeout(() => {
                setErrors({});
                setSuccess(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors, success]);

    const handleClose = () => {
        setErrors({});
        setSuccess(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); 
    };

    // Handle Forgot Password Email Validation
    const handleEmailValidation = async () => {
        if (!forgotEmail) {
            setErrors({ general: 'Email is required' });
            return;
        }
    
        try {
            const normalizedEmail = forgotEmail.trim().toLowerCase();
            const { data: tenant, error } = await supabaseAdmin
                .from('TENANT')
                .select('ten_UID')
                .eq('ten_Email', normalizedEmail);
    
            // Log the response from Supabase
            console.log('Tenant Data:', tenant);
            console.log('Supabase Error:', error);
    
            if (error || !tenant || tenant.length === 0) {
                setErrors({ general: 'No Account associated with this email' });
                return;
            }
    
            const userId = tenant[0].ten_UID;  // Access the first element of the array
            console.log('User ID:', userId); // Log user ID to verify
    
            const resetToken = uuidv4();  // Generate a unique token
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 5); 
    
            const expiresAtUTC = expiresAt.toISOString();
    
            // Store the token and expiration in the database
            const { error: tokenError } = await supabase
                .from('TENANT')
                .update({ reset_token: resetToken, reset_token_expires: expiresAtUTC })
                .eq('ten_UID', userId);
    
            // Log the result of the update operation
            console.log('Token Update Error:', tokenError);
    
            if (tokenError) {
                setErrors({ general: 'Error saving the reset token. Please try again.' });
                return;
            }
    
            const resetLink = `${window.location.origin}/password-recovery?token=${resetToken}`;
            console.log('Password Reset Link:', resetLink); // Log the reset link
    
            await sendPasswordResetEmail(normalizedEmail, resetLink);
    
            // Show success alert inside the modal
            setForgotErrorMessage('Password reset email has been sent successfully!');
    
            // Automatically close the modal after 3 seconds
            setTimeout(() => {
                setForgotPasswordModalOpen(false);
                setForgotErrorMessage(''); // Clear the message after closing the modal
            }, 3000);
    
        } catch (error) {
            console.error('Error fetching user by email:', error);
            setForgotErrorMessage('An error occurred. Please try again.');
        }
    };
    

    return (
        <div className={styles.loginContainer}>
            <div className={styles.backButton}>
                <button onClick={() => navigate('/loginHere')}>
                    <IonIcon icon={arrowBack} /> Back to Portal
                </button>
            </div>
            <div className={styles.loginCard}>
                <img className={styles.logo} src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                <h2 className={styles.heading}>Tenant Login</h2>

                {errors.general && (
                    <CustomAlert onClose={handleClose} severity="error" className={styles.customAlert}>
                        {errors.general}
                    </CustomAlert>
                )}

                {/* Display Success Alert */}
                {successMessage && (
                    <Alert severity="success" onClose={() => setSuccessMessage('')}>
                        {successMessage}
                    </Alert>
                )}

                <form>
                    <div className={styles.inputField}>
                        <label>Email</label>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Enter your Email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={Boolean(errors.username)}
                            helperText={errors.username}
                        />
                    </div>
                    <div className={styles.inputField}>
                        <label>Password</label>
                        <TextField
                            fullWidth
                            variant="outlined"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility}>
                                            {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    <p className={styles.forgotPassword} onClick={() => setForgotPasswordModalOpen(true)}>
                        Forgot your password?
                    </p>

                    <CustomButton 
                        variant="contained" 
                        color="primary" 
                        className={styles.customButton}
                        onClick={handleLogin}
                        disabled={isLoading || isLocked}
                    >
                        Login
                    </CustomButton>
                </form>

                {isLoading && (
                    <div className={styles.loadingContainer}>
                        <LinearProgress color="primary" /> 
                    </div>
                )}

                {showTimerOnPage && (
                     <p className={styles.timerMessage}>
                      Too many attempts. Please try again after {timeLeft} seconds.
                    </p>
                )}
            </div>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    style: {
                        backdropFilter: 'blur(5px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                }}
            >
                <Box 
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                        textAlign: 'center',
                    }}
                >
                    <h2>Multiple Attempts Detected</h2>
                    <p>Please try again after {timeLeft} seconds.</p>
                    <Button variant="contained" onClick={handleCloseModal}>
                        OK
                    </Button>
                </Box>
            </Modal>

            <Modal
    open={forgotPasswordModalOpen}
    onClose={() => setForgotPasswordModalOpen(false)}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
        timeout: 500,
        style: {
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
    }}
>
    <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '8px',
        textAlign: 'center',
    }}>
        <h2>Forgot Password</h2>
        <p>Please enter your email address:</p>

        {/* Display error message if any */}
        {errors.general && (
            <CustomAlert onClose={handleClose} severity="error" className={styles.customAlert}>
                {errors.general}
            </CustomAlert>
        )}

        {/* Display success alert if the email is sent */}
        {forgotErrorMessage && (
            <Alert onClose={() => setForgotErrorMessage('')} severity="success" style={{ marginBottom: '20px' }}>
                {forgotErrorMessage}
            </Alert>
        )}

        {/* Email input field */}
        <input
            type="email"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            disabled={!!forgotErrorMessage}  // Disable input when success alert is shown
        />

        {/* Send button */}
        <Button variant="contained" onClick={handleEmailValidation} disabled={!!forgotErrorMessage}>
            Send
        </Button>
    </Box>
</Modal>

        </div>
    );
}

export default LoginT;
