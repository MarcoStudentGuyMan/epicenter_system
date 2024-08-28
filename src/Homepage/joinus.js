import React from 'react';
import '../styles/JoinUs.css';
import managerImage from '../assets/manager.PNG'; 
import { IonIcon } from '@ionic/react';
import { mail, call } from 'ionicons/icons';

function JoinUs() {
    const email = "marcofmedina@su.edu.ph";
    const subject = "EPICENTER TENANT APPLICATION";
    const body = "Hello Mr. Marco Medina,\n\nI would like to know more about joining the EPICENTER family.\n\nBest regards,\n[Your Name]";

    return (
        <div className="join-us-container">
            <h1>Want to be part of the EPICENTER family?</h1>
            <p className="contact-header">For more information, email and contact Marco Medina</p>
            <div className="contact-info">
                <img src={managerImage} alt="Marco Medina" />
                <ul>
                    <li>
                        <IonIcon icon={mail} style={{ fontSize: '24px', marginRight: '5px', marginTop: '5px' }} />
                        <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>
                            Email: marcofmedina@su.edu.ph
                        </a>
                    </li>
                    <br />
                    <li>
                        <IonIcon icon={call} style={{ fontSize: '24px', marginRight: '5px', marginTop: '5px' }} />
                        Contact number: 09562905289
                    </li>
                </ul>
            </div>
            <p className="member">Already a member? <a href="/loginHere">LOGIN HERE.</a></p>
        </div>
    );
}

export default JoinUs;
