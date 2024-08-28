//login_a.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { supabase } from '../supabaseConnect';
import '../styles/loginPageA.css';
import '../App.css';
import '../Theme/colorPalette';

import CustomAlert from '../Component/Alerts'; 
import CustomButton from '../Component/Buttons';

function LoginA() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const buttonStyles = {
        textTransform: 'none',
        fontWeight: 'bold',
        marginTop: '1%'
    };

    const handleLogin = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: username,  // assuming you're using email as the username
                password: password,
            });

            if (error) {
                setError(error.message);
            } else {
                navigate('/dashboard_admin');
            }
        } catch (error) {
            setError('Login failed. Please try again.');
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000); // 5 seconds

            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleClose = () => {
        setError(null);
    };


    return (
        <div className="login-container">
            <header className="login-header">
                <button className="back-button" onClick={() => history.push('/loginHere')}>
                    <IonIcon icon={arrowBack} /> Back
                </button>
            </header>
            <div className="login-content">
                <p>WELCOME ADMIN!</p>
                <img className="logo" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                
                
                <div>
                    <p>Username: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /></p>
                    <p>Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></p>
                </div>

        
                
                <CustomButton 
                    variant="contained" 
                    color="primary" 
                    onClick={handleLogin}
                >
                    Login
                </CustomButton>

                {error && (
                    <CustomAlert onClose={handleClose} severity="error">
                        {error}
                    </CustomAlert>
                    
                )}
                    
            </div>
        </div>
    );
}

export default LoginA;
