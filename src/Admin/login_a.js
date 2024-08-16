import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import '../styles/loginPageA.css';
import '../App.css';

function LoginA() {
    const history = useHistory();
    console.log("Rendering LoginA Component");

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
                    <p>Username: <input type="text" /></p>
                    <p>Password: <input type="password" /></p>
                </div>
                <IonButton className="custom" onClick={() => history.push('/dashboard_admin')}>Login</IonButton>
            </div>
        </div>
    );
}

export default LoginA;
