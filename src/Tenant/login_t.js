import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { supabase } from '../supabaseConnect';
import styles from '../styles/loginPageT.module.css';  // Import the CSS module
import CustomAlert from '../Component/Alerts'; 
import CustomButton from '../Component/Buttons';

function LoginT() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false); // State for showing success alert

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
            const { data, error } = await supabase
                .from('TENANT')
                .select('ten_Email, ten_password')
                .eq('ten_Email', username)
                .single();

            if (error) {
                setErrors({ general: 'Login failed. Please check your credentials.' });
            } else if (data.ten_password !== password) {
                setErrors({ general: 'Invalid password. Please try again.' });
            } else {
                setSuccess(true); // Show success alert
                setTimeout(() => {
                    navigate('/dashboard_tenant');
                }, 2000); // Redirect after 2 seconds
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
                <h2 className={styles.heading}>Login</h2>
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
            </div>
        </div>
    );
}

export default LoginT;
