import React from 'react';
import styles from '../styles/Home.module.css';
import useFetch from '../Hooks/useFetch';

function Home() {
  // Use environment variable for the base URL
  const baseUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:3001';
  console.log("Base URL: ", baseUrl);  // Log the baseUrl

  const { loading, error, data } = useFetch(`${baseUrl}/api/homes?populate=[Image1]`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Extract the home data
  const homeData = data?.data && data?.data.length > 0 ? data?.data[0]?.attributes : null;
  const description = homeData?.Description || "Description not available";

  // Construct full URL for Image1
  const image1 = homeData?.Image1?.data?.attributes?.url
    ? `${baseUrl}${homeData.Image1.data.attributes.url}`
    : null;

  console.log("Fetched Data: ", data);  // Log the fetched data

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
