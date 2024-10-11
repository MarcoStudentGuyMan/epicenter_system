import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Community.module.css'; // Use CSS module
import useFetch from '../Hooks/useFetch'; // Custom hook to fetch data from Strapi
import { supabase } from '../supabaseConnect'; // Import supabase instance

function Community() {
  const navigate = useNavigate();
  const [stalls, setStalls] = useState([]);
  
  // Use environment variable for the base URL
  const baseUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:3001';

  // Fetch Image6 from Strapi for background image
  const { loading, error, data } = useFetch(`${baseUrl}/api/homes?populate=Image6`);

  useEffect(() => {
    // Fetch published stalls from MINISITES table using Supabase
    const fetchPublishedStalls = async () => {
      const { data, error } = await supabase
        .from('MINISITES')
        .select('*')
        .eq('Publish', true);

      if (error) {
        console.error('Error fetching published stalls:', error);
      } else {
        setStalls(data);
      }
    };

    fetchPublishedStalls();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no, there was an error fetching the image...</p>;

  // Extract Image6 URL from the API response
  const homeData = data?.data && data?.data.length > 0 ? data?.data[0]?.attributes : null;
  const image6 = homeData?.Image6?.data?.[0]?.attributes?.url
    ? `${baseUrl}${homeData.Image6.data[0].attributes.url}`
    : null;

  return (
    <div className={styles.communityContainer} style={{
      backgroundImage: image6 ? `url(${image6})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
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