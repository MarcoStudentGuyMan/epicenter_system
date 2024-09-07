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

function LoginA() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0); // Track login attempts
    const [isLocked, setIsLocked] = useState(false); // Track if the UI is locked
    const [openModal, setOpenModal] = useState(false); // Control modal state

    // Check localStorage for lockout state on page load
    useEffect(() => {
        const lockoutExpiration = localStorage.getItem('lockoutExpiration');
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
            const { data, error } = await supabase.auth.signInWithPassword({
                email: username,
                password: password,
            });

            if (error) {
                setLoginAttempts(prev => prev + 1); // Increment login attempts on failure

                // Lock the UI if 5 failed attempts are made
                if (loginAttempts + 1 >= 5) {
                    const lockoutTime = new Date().getTime() + 60000; // 1 minute from now
                    setIsLocked(true);
                    setOpenModal(true);
                    localStorage.setItem('lockoutExpiration', lockoutTime); // Store lockout time in localStorage

                    setTimeout(() => {
                        setIsLocked(false); // Unlock UI after 1 minute
                        setLoginAttempts(0); // Reset attempts
                        localStorage.removeItem('lockoutExpiration'); // Clear lockout state after expiration
                    }, 60000); // 1 minute lockout
                }

                setErrors({ general: 'Invalid login credentials' });
            } else {
                const userRole = data.user.app_metadata?.role;

                if (userRole === 'admin') {
                    setSuccess(true); 
                    setTimeout(() => {
                        navigate('/dashboard_admin'); // Navigate to admin dashboard
                    }, 2000);
                } else {
                    setErrors({ general: 'You are not authorized to access the admin dashboard.' });
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

    return (
        <div className={styles.loginContainer}>
            <div className={styles.backButton}>
                <button onClick={() => navigate('/loginHere')}>
                    <IonIcon icon={arrowBack} /> Back
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

                {success && (
                    <CustomAlert onClose={handleClose} severity="success" className={styles.customAlert}>
                        Successfully logged in as Admin! Redirecting...
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

export default LoginA;
