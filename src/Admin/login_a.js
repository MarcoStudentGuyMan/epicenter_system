import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import Button from '@mui/material/Button'; // Import Material UI Button
import '../styles/loginPageA.css';
import '../App.css';

function LoginA() {
    const navigate = useNavigate();
    console.log("Rendering LoginA Component");

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
                    <p>Username: <input type="text" /></p>
                    <p>Password: <input type="password" /></p>
                </div>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => navigate('/dashboard_admin')}
                    sx={{ 
                        textTransform: 'none', // Optional: Prevents all uppercase text
                        fontWeight: 'bold',    // Optional: Makes the text bold
                    }}
                >
                    Login
                </Button>
            </div>
        </div>
    );
}

export default LoginA;
