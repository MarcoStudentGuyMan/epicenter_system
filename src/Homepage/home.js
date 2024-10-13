import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { supabase } from '../supabaseConnect'; // Import Supabase

function Home() {
  const [caption, setCaption] = useState('');
  const [aboutUs, setAboutUs] = useState('');
  const [homeBg, setHomeBg] = useState(null);

  useEffect(() => {
    // Fetch initial data from EPICENTERSITE table
    const fetchData = async () => {
      const { data, error } = await supabase.from('EPICENTERSITE').select('*').single();
      if (error) {
        console.error('Error fetching initial data:', error);
      } else {
        setCaption(data.Caption_text || '');
        setAboutUs(data.About_Us || '');
        setHomeBg(data.Home_bg || null);
      }
    };

    fetchData();

    // Subscribe to changes in the EPICENTERSITE table
    const subscription = supabase
      .channel('public:EPICENTERSITE')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'EPICENTERSITE' }, (payload) => {
        console.log('Real-time change received:', payload);
        const newData = payload.new;
        setCaption(newData.Caption_text || '');
        setAboutUs(newData.About_Us || '');
        setHomeBg(newData.Home_bg || null);
      })
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div
      className={styles.homeContainer}
      style={{
        backgroundImage: homeBg ? `url(${homeBg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={styles.heroSection}>
        <div className={styles.leftSection}>
          <h1>{caption}</h1>
        </div>
        <div className={styles.rightSection}>
          <h2>About Us</h2>
          <p>{aboutUs}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
