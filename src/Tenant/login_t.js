import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { supabase } from '../supabaseConnect';
import styles from '../styles/loginPageT.module.css';  // Import the CSS module
import CustomAlert from '../Component/Alerts'; 
import CustomButton from '../Component/Buttons';
import { Modal, Box, Button } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';

function LoginT() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0); // Track login attempts
    const [isLocked, setIsLocked] = useState(false); // Track if the UI is locked
    const [openModal, setOpenModal] = useState(false); // Control modal state
    const [isLoading, setIsLoading] = useState(false);

    // Check localStorage for lockout state on page load
    useEffect(() => {
        const lockoutExpiration = localStorage.getItem('tenantLockoutExpiration');
        if (lockoutExpiration && new Date().getTime() < parseInt(lockoutExpiration)) {
            setIsLocked(true);
            setOpenModal(true);
        }
    }, []);

    const handleCloseModal = () => setOpenModal(false);

    const handleLogin = async () => {
        // If locked, show modal and prevent further actions
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
            // Sign in the user with email and password using Supabase Auth
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: username,
                password: password
            });

            if (signInError) {
                setLoginAttempts(prev => prev + 1); // Increment login attempts on failure

                // Lock the UI if 5 failed attempts are made
                if (loginAttempts + 1 >= 5) {
                    const lockoutTime = new Date().getTime() + 60000; // 1 minute from now
                    setIsLocked(true);
                    setOpenModal(true);
                    localStorage.setItem('tenantLockoutExpiration', lockoutTime); // Store lockout time in localStorage

                    setTimeout(() => {
                        setIsLocked(false); // Unlock UI after 1 minute
                        setLoginAttempts(0); // Reset attempts
                        localStorage.removeItem('tenantLockoutExpiration'); // Clear lockout state after expiration
                    }, 60000); // 1 minute lockout
                }

                setErrors({ general: 'Login failed. Please check your credentials.' });
                return;
            }

            const { user } = signInData;

            // Check if the user's role is tenant
            if (user?.user_metadata?.role !== 'tenant') {
                setErrors({ general: 'Unauthorized. You must be a tenant to access this page.' });
                await supabase.auth.signOut(); // Sign out if not a tenant
                return;
            }

            // If successful and user has tenant role, show success and navigate to the tenant dashboard
            setSuccess(true);
            setIsLoading(true);
            setTimeout(() => {
                navigate('/dashboard_tenant');
            }, 2000); // Redirect after 2 seconds

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
                <p className={styles.description}>Welcome Tenant, please log in to start</p>

                {errors.general && (
                    <CustomAlert onClose={handleClose} severity="error" className={styles.customAlert}>
                        {errors.general}
                    </CustomAlert>
                )}

                {success && (
                    <CustomAlert onClose={handleClose} severity="success" className={styles.customAlert}>
                        Successfully logged in! Redirecting...
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
                    >
                        Login
                    </CustomButton>
                </form>

                {isLoading && (
                    <div className={styles.loadingContainer}>
                        <LinearProgress color="primary" /> {/* Linear progress bar */}
                       
                    </div>
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
                    <h2>Error: Multiple Attempts Detected</h2>
                    <p>Please try again after 1 minute.</p>
                    <Button variant="contained" onClick={handleCloseModal}>
                        OK
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default LoginT;
