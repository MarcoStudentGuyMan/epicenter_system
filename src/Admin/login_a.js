import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { supabase } from '../supabaseConnect';
import styles from '../styles/loginPageT.module.css';  // Reuse the same CSS module as Tenant Login
import CustomAlert from '../Component/Alerts'; 
import CustomButton from '../Component/Buttons';

function LoginA() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleLogin = async () => {
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
                email: username,  // assuming you're using email as the username
                password: password,
            });

            if (error) {
                setErrors({ general: error.message });
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
        </div>
    );
}

export default LoginA;
