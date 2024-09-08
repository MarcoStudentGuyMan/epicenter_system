import React from 'react';
import styles from '../styles/Community.module.css'; // Use CSS module
import useFetch from '../Hooks/useFetch'; // Custom hook to fetch data from Strapi

function Community() {
    const stalls = [
        { id: 1, name: "CHB", description: "Greek restaurant specializing in Greek delicacies" },
        { id: 2, name: "Catty Cafe", description: "Cat and Mouse themed cafe that also sells milk and cheese" },
        { id: 3, name: "Espresso", description: "Sells strong coffee and other imported ingredients for drinks" }
    ];

    // Fetch Image6 from Strapi
    const { loading, error, data } = useFetch('http://localhost:3001/api/homes?populate=Image6');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Oh no, there was an error fetching the image...</p>;

    // Extract Image6 URL from the API response
    const homeData = data?.data && data?.data.length > 0 ? data?.data[0]?.attributes : null;
    const image6 = homeData?.Image6?.data?.[0]?.attributes?.url
      ? `http://localhost:3001${homeData.Image6.data[0].attributes.url}`
      : null;

    return (
        <div className={styles.communityContainer} style={{
            backgroundImage: image6 ? `url(${image6})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <h1>Community</h1>
            <div className={styles.stallsList}>
                {stalls.map(stall => (
                    <div key={stall.id} className={styles.stall}>
                        <h2>{stall.name}</h2>
                        <p>{stall.description}</p>
                        <button>View</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Community;
