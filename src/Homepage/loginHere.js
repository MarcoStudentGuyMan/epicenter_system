import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginHere.css';

function LoginHere() {
    const navigate = useNavigate();
    return (
        <>
               
               
                
         
            <div className="container">
           
                <p className='SelectP'>SELECT USER LOGIN TO EPICENTER</p>
                <div className="square-container">
                    <div className="square" onClick={() => navigate('/login_admin')}>ADMIN</div>
                    <div className="square" onClick={() => navigate('/login_tenant')}>TENANT</div>
                </div>
            </div>
        </>
    );
}

export default LoginHere;
