import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css';
import styles from '../styles/Location.module.css'; // Use CSS module
import useFetch from '../Hooks/useFetch'; 
import markerIconUrl from '../assets/marker.png'; 

const markerIcon = new L.Icon({
    iconUrl: markerIconUrl,
    iconSize: [50, 45], 
    iconAnchor: [12, 41], 
    popupAnchor: [1, -34] 
});

const Location = () => {
  const center = [9.308715708493441, 123.30354446030861];
  const zoom = 15;

  // Fetch data from Strapi (home content type with Image2, Image3, and Image4 populated)
  const { loading, error, data } = useFetch('http://localhost:3001/api/homes?populate=Image2,Image3,Image4');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no, there was an error fetching the images...</p>;

  // Extract Image2, Image3, and Image4 URLs from the API response
  const homeData = data?.data && data?.data.length > 0 ? data?.data[0]?.attributes : null;
  
  const image2 = homeData?.Image2?.data?.[0]?.attributes?.url
    ? `http://localhost:3001${homeData.Image2.data[0].attributes.url}`
    : null;

  const image3 = homeData?.Image3?.data?.[0]?.attributes?.url
    ? `http://localhost:3001${homeData.Image3.data[0].attributes.url}`
    : null;

  const image4 = homeData?.Image4?.data?.[0]?.attributes?.url
    ? `http://localhost:3001${homeData.Image4.data[0].attributes.url}`
    : null;

  // Log the image URLs for debugging
  console.log('Image2 URL:', image2);
  console.log('Image3 URL:', image3);
  console.log('Image4 URL:', image4);

  return (
    <div className={styles.content} style={{ 
        backgroundImage: image2 ? `url(${image2})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }}>
      <div className={styles.transparentOverlay}>
        <h1>Our Location</h1>

        {/* Container for Image3 and Image4 */}
        <div className={styles.imageContainer}>
          {image3 && <img src={image3} alt="Outdoor view of Epicenter" />}
          {image4 && <img src={image4} alt="Indoor view of Epicenter" />}
        </div>

        <p>EPICENTER IS LOCATED AT</p>
        <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={center} icon={markerIcon}>
            <Popup>EPICENTER STALLS</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Location;
