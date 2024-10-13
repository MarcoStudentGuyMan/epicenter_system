import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css';
import styles from '../styles/Location.module.css'; // Use CSS module
import { supabase } from '../supabaseConnect'; // Import Supabase
import markerIconUrl from '../assets/marker.png'; 

const markerIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconSize: [50, 45], 
  iconAnchor: [12, 41], 
  popupAnchor: [1, -34] 
});

const Location = () => {
  const [locationBg, setLocationBg] = useState(null);
  const [image1stLocation, setImage1stLocation] = useState(null);
  const [image2ndLocation, setImage2ndLocation] = useState(null);

  const center = [9.308715708493441, 123.30354446030861]; 
  const zoom = 15;

  useEffect(() => {
    // Fetch initial data from EPICENTERSITE table
    const fetchData = async () => {
      const { data, error } = await supabase.from('EPICENTERSITE').select('*').single();
      if (error) {
        console.error('Error fetching initial data:', error);
      } else {
        setLocationBg(data.Location_bg || null);
        setImage1stLocation(data['1st_Location'] || null);
        setImage2ndLocation(data['2nd_Location'] || null);
      }
    };

    fetchData();

    // Subscribe to changes in the EPICENTERSITE table
    const subscription = supabase
      .channel('public:EPICENTERSITE')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'EPICENTERSITE' }, (payload) => {
        console.log('Real-time change received:', payload);
        const newData = payload.new;
        setLocationBg(newData.Location_bg || null);
        setImage1stLocation(newData['1st_Location'] || null);
        setImage2ndLocation(newData['2nd_Location'] || null);
      })
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className={styles.content} style={{ 
        backgroundImage: locationBg ? `url(${locationBg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    }}>
      <div className={styles.transparentOverlay}>
        <h1>Our Location</h1>
        <div className={styles.imageContainer}>
          {image1stLocation && <img src={image1stLocation} alt="Outdoor view of Epicenter" />}
          {image2ndLocation && <img src={image2ndLocation} alt="Indoor view of Epicenter" />}
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
