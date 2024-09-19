import React from 'react';
import styles from '../styles/JoinUs.module.css'; // Use CSS module
import managerImage from '../assets/manager.PNG'; 
import { IonIcon } from '@ionic/react';
import { mail, call } from 'ionicons/icons';
import useFetch from '../Hooks/useFetch'; // Custom hook to fetch data from Strapi

function JoinUs() {
    const email = "marcofmedina@su.edu.ph";
    const subject = "EPICENTER TENANT APPLICATION";
    const body = "Hello Mr. Marco Medina,\n\nI would like to know more about joining the EPICENTER family.\n\nBest regards,\n[Your Name]";

    // Use environment variable for the base URL
    const baseUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:3001';
    
    // Fetch Image5 from Strapi
    const { loading, error, data } = useFetch(`${baseUrl}/api/homes?populate=Image5`);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Oh no, there was an error fetching the image...</p>;

    // Extract Image5 URL from the API response
    const homeData = data?.data && data?.data.length > 0 ? data?.data[0]?.attributes : null;
    const image5 = homeData?.Image5?.data?.[0]?.attributes?.url
      ? `${baseUrl}${homeData.Image5.data[0].attributes.url}`
      : null;

    return (
        <div className={styles.joinUsContainer} style={{
            backgroundImage: image5 ? `url(${image5})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className={styles.transparentBox}>
                <h1>Want to be part of the EPICENTER family?</h1>
                <p className={styles.contactHeader}>For more information, email and contact Marco Medina</p>
                <div className={styles.contactInfo}>
                    <img src={managerImage} alt="Marco Medina" />
                    <ul>
                        <li>
                            <IonIcon icon={mail} style={{ fontSize: '24px', marginRight: '5px', marginTop: '5px' }} />
                            <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>
                                Email: {email}
                            </a>
                        </li>
                        <br />
                        <li>
                            <IonIcon icon={call} style={{ fontSize: '24px', marginRight: '5px', marginTop: '5px' }} />
                            Contact number: 09562905289
                        </li>
                    </ul>
                </div>
                <p className={styles.member}>Already a member? <a href="/loginHere">LOGIN HERE.</a></p>
            </div>
        </div>
    );
}

export default JoinUs;