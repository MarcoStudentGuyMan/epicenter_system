import React, { useEffect, useState } from 'react';
import styles from '../styles/JoinUs.module.css'; // Use CSS module
import managerImage from '../assets/manager.PNG';
import { IonIcon } from '@ionic/react';
import { mail, call } from 'ionicons/icons';
import { supabase } from '../supabaseConnect'; // Import Supabase

function JoinUs() {
  const email = "marcofmedina@su.edu.ph";
  const subject = "EPICENTER TENANT APPLICATION";
  const body = "Hello Mr. Marco Medina,\n\nI would like to know more about joining the EPICENTER family.\n\nBest regards,\n[Your Name]";

  const [joinUsBg, setJoinUsBg] = useState(null);

  useEffect(() => {
    // Fetch initial data from EPICENTERSITE table
    const fetchData = async () => {
      const { data, error } = await supabase.from('EPICENTERSITE').select('JoinUs_bg').single();
      if (error) {
        console.error('Error fetching initial data:', error);
      } else {
        setJoinUsBg(data.JoinUs_bg || null);
      }
    };

    fetchData();

    // Subscribe to changes in the EPICENTERSITE table
    const subscription = supabase
      .channel('public:EPICENTERSITE')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'EPICENTERSITE' }, (payload) => {
        console.log('Real-time change received:', payload);
        const newData = payload.new;
        setJoinUsBg(newData.JoinUs_bg || null);
      })
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div
      className={styles.joinUsContainer}
      style={{
        backgroundImage: joinUsBg ? `url(${joinUsBg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
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
        
      </div>
    </div>
  );
}

export default JoinUs;
