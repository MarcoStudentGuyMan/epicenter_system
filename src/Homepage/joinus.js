import React from 'react';
import '../styles/JoinUs.css';
import managerImage from '../assets/manager.PNG'; 

function JoinUs() {
    return (
        <div className="join-us-container">
            <h1>Want to be part of the EPICENTER family?</h1>
            <p class="contact-header">For more information, contact Marco Medina</p>
            <div className="contact-info">
                <img src={managerImage} alt="Marco Medina" />
                <ul>
                    <li>📧 Email: marcofmedina@su.edu.ph</li>
                    <li>📞 Contact number: 09562905289</li>
                </ul>
            </div>
            <p class="member">Already a member? <a href="/loginHere">LOGIN HERE.</a></p>
        </div>
    );
}

export default JoinUs;
