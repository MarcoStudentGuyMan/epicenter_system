import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginHere.css';
import { IonIcon } from '@ionic/react';
import { arrowBack} from 'ionicons/icons';


function LoginHere() {
    const navigate = useNavigate();
    return (
 
        <>
        <div className="login-container">
            <header className="login-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    <IonIcon icon={arrowBack} /> Back to Epicenter Website
                </button>
            </header>
        
                
            <div className="container">
                <p className='SelectP'>SELECT USER LOGIN TO EPICENTER</p>
                <div className="square-container">
                    <div className="square" onClick={() => navigate('/login_admin')}>ADMIN</div>
                    <div className="square" onClick={() => navigate('/login_tenant')}>TENANT</div>
                </div>
            </div>
            </div>
        </>
    );
}

export default LoginHere;