import React from 'react';
import styles from '../styles/Home.module.css';
import useFetch from '../Hooks/useFetch';

function Home() {
  const { loading, error, data } = useFetch('http://localhost:3001/api/homes?populate=Image1');

  if (loading) return <p>Loaders boss...</p>;
  if (error) return <p>Oh Naur, there was an error...</p>;

  // Extract the home data
  const homeData = data?.data && data?.data.length > 0 ? data?.data[0]?.attributes : null;
  const description = homeData?.Description || "Description not available";

  // Construct full URL for Image1
  const image1 = homeData?.Image1?.data?.[0]?.attributes?.url
    ? `http://localhost:3001${homeData.Image1.data[0].attributes.url}`
    : null;

  return (
    <div
    className={styles.homeContainer}
    style={{
      backgroundImage: image1 ? `url(${image1})` : 'none',
    }}
  >
    <div className={styles.heroSection}>
      <div className={styles.leftSection}>
        <h1>Experience a variety of flavors at EPICENTER, the heart of the city</h1>
      </div>
      <div className={styles.rightSection}>
        <h2>About Us</h2>
        <p>{description}</p>
      </div>
    </div>
  </div>
  );
}

export default Home;
