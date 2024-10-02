import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { supabase } from '../supabaseConnect';
import styles from '../styles/loginPageT.module.css';  
import CustomAlert from '../Component/Alerts'; 
import CustomButton from '../Component/Buttons';
import { Modal, Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';  
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

function LoginA() {
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
            // Clear any existing session (especially tenant session)
            await supabase.auth.signOut(); // Ensures no tenant session remains
    
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
                    localStorage.setItem('adminLockoutExpiration', lockoutTime); // Ensure admin-specific lockout
                    setTimeLeft(60); 
                }
                setErrors({ general: 'Invalid login credentials' });
            } else {
                const user = data.user;
    
                // Check if the user is indeed an admin
                if (user?.user_metadata?.role === 'admin') {
                    // Store the admin session in localStorage
                    localStorage.setItem('adminSession', JSON.stringify(data));
    
                    setSuccess(true);
                    setIsLoading(true); 
                    
                    // Redirect to admin dashboard after a brief delay
                    setTimeout(() => {
                        navigate('/dashboard_admin'); 
                    }, 2000);
                } else {
                    // Handle non-admin logins
                    setErrors({ general: 'Unauthorized. You must be an admin to access this page.' });
                    await supabase.auth.signOut(); // Ensure no session remains if not admin
                    return;
                }
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

    return (
        <div className={styles.loginContainer}>
            <div className={styles.backButton}>
                <button onClick={() => navigate('/loginHere')}>
                    <IonIcon icon={arrowBack} /> Back to Portal 
                </button>
            </div>
            <div className={styles.loginCard}>
                <img className={styles.logo} src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                <h2 className={styles.heading}>Admin Login</h2>

                {errors.general && (
                    <CustomAlert onClose={handleClose} severity="error" className={styles.customAlert}>
                        {errors.general}
                    </CustomAlert>
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
        </div>
    );
}

export default LoginA;
