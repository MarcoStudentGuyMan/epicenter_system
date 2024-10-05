import React from 'react';
function ExpiredToken() {
   
   

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center',
            background: 'white',
            color:'#062536',
            fontSize:'18px'
        }}>
            <div style={{
                padding: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', // Darker shadow with more blur
                borderRadius: '30px',
                maxWidth: '500px',
                width: '100%',
            }}>
                <h2>Password Token Expired or Used</h2>
                <p>The password reset token is either expired or has already been used. Please request a new password reset link.</p>
                
            </div>
        </div>
    );
}

export default ExpiredToken;
