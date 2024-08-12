import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import '../Admin/Admin.css';
import '../App.css';

function LoginA() {
    const navigate = useNavigate();
    console.log("Rendering LoginA Component");
    return (
        <div>
            <header className="header">
                <a className="back-button" onClick={() => navigate('/')}>
                    <IonIcon icon={arrowBack} />  Back
                </a>
            </header>
            <div>
                <p>WELCOME ADMIN!</p>
                <img className="logo" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                <div>
                    <p>Username: <input type="text" /></p>
                    <p>Password: <input type="password" /></p>
                </div>
                <IonButton className="custom" onClick={() => navigate('/dashboard_admin')}>Login</IonButton>
            </div>
        </div>
    );
}



export default LoginA;
