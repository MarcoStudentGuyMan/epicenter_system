import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { supabase } from '../supabaseConnect';
import styles from '../styles/loginPageT.module.css';  
import CustomAlert from '../Component/Alerts'; 
import CustomButton from '../Component/Buttons';
import { Modal, Box, Button } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';  // Import LinearProgress

function LoginT() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0); // Track login attempts
    const [isLocked, setIsLocked] = useState(false); // Track if the UI is locked
    const [openModal, setOpenModal] = useState(false); // Control modal state
    const [isLoading, setIsLoading] = useState(false); // Loading state for progress bar
    const [timeLeft, setTimeLeft] = useState(60); // State for the timer, 60 seconds for 1 minute lockout
    const [showTimerOnPage, setShowTimerOnPage] = useState(false); // State to show the timer on the page

    // Check localStorage for lockout state on page load
    useEffect(() => {
        const lockoutExpiration = localStorage.getItem('tenantLockoutExpiration');
        if (lockoutExpiration && new Date().getTime() < parseInt(lockoutExpiration)) {
            setIsLocked(true);
            setOpenModal(true);

            // Calculate remaining time
            const remainingTime = Math.ceil((parseInt(lockoutExpiration) - new Date().getTime()) / 1000);
            setTimeLeft(remainingTime);
        }
    }, []);

    // Effect to handle countdown when UI is locked
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
            setShowTimerOnPage(false); // Hide the timer on the page once the time is up
        }
        return () => clearInterval(timer);
    }, [isLocked, timeLeft]);

    const handleCloseModal = () => {
        setOpenModal(false);
        setShowTimerOnPage(true); // Show the timer on the page when the modal is closed
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
                setLoginAttempts(prev => prev + 1); // Increment login attempts on failure

                if (loginAttempts + 1 >= 5) {
                    const lockoutTime = new Date().getTime() + 60000; // 1 minute from now
                    setIsLocked(true);
                    setOpenModal(true);
                    localStorage.setItem('tenantLockoutExpiration', lockoutTime); // Store lockout time in localStorage

                    setTimeLeft(60); // Reset the countdown
                }

                setErrors({ general: 'Invalid login credentials' });
            } else {
                // Reverting to user_metadata as you confirmed it's working
                const user = data.user;

                // Check if the user's role is tenant
                if (user?.user_metadata?.role !== 'tenant') {
                    setErrors({ general: 'Unauthorized. You must be a tenant to access this page.' });
                    await supabase.auth.signOut(); // Sign out if not a tenant
                    return;
                }

                // If successful and user has tenant role, show success and navigate to the tenant dashboard
                setSuccess(true);
                setIsLoading(true); // Show loading progress bar

                setTimeout(() => {
                    navigate('/dashboard_tenant'); // Navigate to tenant dashboard
                }, 2000); // Simulate loading time
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

    return (
        <div className={styles.loginContainer}>
            <div className={styles.backButton}>
                <button onClick={() => navigate('/loginHere')}>
                    <IonIcon icon={arrowBack} /> Back
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

                {success && (
                    <CustomAlert onClose={handleClose} severity="success" className={styles.customAlert}>
                        Successfully logged in as Tenant! Redirecting...
                    </CustomAlert>
                )}

                <form>
                    <div className={styles.inputField}>
                        <label>Email</label>
                        <input
                            type="text"
                            placeholder="Enter your Email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {errors.username && <span className={styles.errorText}>{errors.username}</span>}
                    </div>
                    <div className={styles.inputField}>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>
                    <CustomButton 
                        variant="contained" 
                        color="primary" 
                        className={styles.customButton}
                        onClick={handleLogin}
                        disabled={isLoading || isLocked} // Disable button when loading or locked
                    >
                        Login
                    </CustomButton>
                </form>

                {isLoading && (
                    <div className={styles.loadingContainer}>
                        <LinearProgress color="primary" /> {/* Linear progress bar */}
                    </div>
                )}

                {/* Show the timer below the login button if too many attempts */}
                {showTimerOnPage && (
                     <p className={styles.timerMessage}>
                      Too many attempts. Please try again after {timeLeft} seconds.
                    </p>
                )}
            </div>

            {/* Modal for too many attempts */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    style: {
                        backdropFilter: 'blur(5px)', // Blur effect
                        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Darkened background
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
                    <p>Please try again after {timeLeft} seconds.</p> {/* Display remaining time */}
                    <Button variant="contained" onClick={handleCloseModal}>
                        OK
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default LoginT;
