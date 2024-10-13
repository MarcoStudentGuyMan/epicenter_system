import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Community.module.css'; // Use CSS module
import { supabase } from '../supabaseConnect'; // Import Supabase

function Community() {
  const navigate = useNavigate();
  const [communityBg, setCommunityBg] = useState(null);
  const [stalls, setStalls] = useState([]);

  useEffect(() => {
    // Fetch initial data from EPICENTERSITE table and MINISITES table
    const fetchData = async () => {
      const { data, error } = await supabase.from('EPICENTERSITE').select('*').single();
      if (error) {
        console.error('Error fetching initial data:', error);
      } else {
        setCommunityBg(data.Community_bg || null);
      }

      const { data: stallsData, error: stallsError } = await supabase
        .from('MINISITES')
        .select('*')
        .eq('Publish', true);

      if (stallsError) {
        console.error('Error fetching published stalls:', stallsError);
      } else {
        setStalls(stallsData);
      }
    };

    fetchData();

    // Subscribe to changes in the EPICENTERSITE table
    const subscription = supabase
      .channel('public:EPICENTERSITE')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'EPICENTERSITE' }, (payload) => {
        console.log('Real-time change received:', payload);
        const newData = payload.new;
        setCommunityBg(newData.Community_bg || null);
      })
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className={styles.communityContainer} style={{
      backgroundImage: communityBg ? `url(${communityBg})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <h1>EPICENTER STALLS</h1>
      <div className={styles.stallsList}>
        {stalls.map(stall => (
          <div key={stall.id} className={styles.stall}>
            <div className={styles.stallImageContainer}>
              <img src={stall.stall_pic} alt={stall.stall_name} className={styles.stallImage} />
            </div>
            <div className={styles.stallDetails}>
              <h2>{stall.stall_name}</h2>
              <div className={styles.buttonContainer}>
                <button onClick={() => navigate(`/minisites/${stall.id}`)}>View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;
