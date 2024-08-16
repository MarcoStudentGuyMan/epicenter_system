import React from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/LoginHere.css';

function LoginHere() {
    const history = useHistory(); // useHistory hook to navigate
    return (
        <>
            <div className="container">
                <p className='SelectP'>SELECT USER LOGIN TO EPICENTER</p>
                <div className="square-container">
                    {/* Using history.push for navigation on click */}
                    <div className="square" onClick={() => history.push('/login_admin')}>ADMIN</div>
                    <div className="square" onClick={() => history.push('/login_tenant')}>TENANT</div>
                </div>
            </div>
        </>
    );
}

export default LoginHere;
