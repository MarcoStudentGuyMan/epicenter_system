import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import Button from '@mui/material/Button'; 
import { supabase } from '../supabaseConnect';
import '../styles/loginPageA.css';
import '../App.css';

function LoginA() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

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

    return (
        <div className="login-container">
            <header className="login-header">
                <button className="back-button" onClick={() => navigate('/loginHere')}>
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
                {error && <p className="error-message">{error}</p>}
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleLogin}
                    sx={{ 
                        textTransform: 'none', 
                        fontWeight: 'bold',    
                    }}
                >
                    Login
                </Button>
            </div>
        </div>
    );
}

export default LoginA;
