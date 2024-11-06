import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { supabase } from '../supabaseConnect';
import styles from '../styles/loginPageT.module.css';  
import CustomAlert from '../Component/Alerts'; 
import CustomButton from '../Component/Buttons';
import { Modal, Box, Button, IconButton, InputAdornment, TextField, Alert } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';  
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { sendAdminPasswordResetEmail } from '../Email/EmailAdminPass';
import { v4 as uuidv4 } from 'uuid';

function LoginA() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const lockoutExpiration = localStorage.getItem('lockoutExpiration');
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
            localStorage.removeItem('lockoutExpiration');
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
            await supabase.auth.signOut();
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
                    localStorage.setItem('lockoutExpiration', lockoutTime);
                    setTimeLeft(60);
                }
                setErrors({ general: 'Invalid login credentials' });
            } else {
                const user = data.user;
                if (user?.user_metadata?.role === 'admin') {
                    localStorage.setItem('adminSession', JSON.stringify(data));
                    setSuccess(true);
                    setIsLoading(true);
                    setTimeout(() => {
                        navigate('/dashboard_admin');
                    }, 2000);
                } else {
                    setErrors({ general: 'Unauthorized. You must be an admin to access this page.' });
                    await supabase.auth.signOut();
                    return;
                }
            }
        } catch (error) {
            setErrors({ general: 'Login failed. Please try again.' });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); 
    };

    const handleForgotPassword = async () => {
        if (!forgotEmail) {
            setForgotErrorMessage('Email is required');
            setTimeout(() => setForgotErrorMessage(''), 5000);  // Timer to clear error message
            return;
        }
    
        try {
            const normalizedEmail = forgotEmail.trim().toLowerCase();
            const { data: manager, error } = await supabase
                .from('MANAGER')
                .select('Manager_id')
                .eq('Manager_Email', normalizedEmail)
                .single();
    
            if (error || !manager) {
                setForgotErrorMessage('No account associated with this email');
                setTimeout(() => setForgotErrorMessage(''), 5000);  // Timer to clear error message
                return;
            }
    
            const resetToken = uuidv4();
            const resetLink = `${window.location.origin}/admin-password-recovery?token=${resetToken}`;
    
            await sendAdminPasswordResetEmail(normalizedEmail, resetLink);
            setSuccessMessage('Password reset email sent successfully!');
    
            setTimeout(() => {
                setSuccessMessage('');
                setForgotPasswordModalOpen(false);
            }, 5000);
    
        } catch (error) {
            setForgotErrorMessage('An error occurred. Please try again.');
            setTimeout(() => setForgotErrorMessage(''), 5000);  // Timer to clear error message
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

    return (
        <div className={styles.loginContainer}>
            <div className={styles.backButton}>
                <button onClick={() => navigate('/')}>
                    <IonIcon icon={arrowBack} /> Back to Epicenter Website
                </button>
            </div>
            <div className={styles.loginCard}>
                <img className={styles.logo} src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                <h2 className={styles.heading}>Admin Login</h2>

                {errors.general && (
                    <CustomAlert onClose={() => setErrors({})} severity="error" className={styles.customAlert}>
                        {errors.general}
                    </CustomAlert>
                )}

                <form onKeyDown={(e) => e.key === 'Enter' && handleLogin()}>
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
                    <h2>Forgot Password</h2>
                    <p>Please enter your email address:</p>

                    {forgotErrorMessage && (
                        <Alert severity="error" style={{ marginBottom: '20px' }}>
                            {forgotErrorMessage}
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert severity="success" style={{ marginBottom: '20px' }}>
                            {successMessage}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter your email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                    />

                    <Button variant="contained" onClick={handleForgotPassword} sx={{ marginTop: '10px' }}>
                        Send
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default LoginA;
