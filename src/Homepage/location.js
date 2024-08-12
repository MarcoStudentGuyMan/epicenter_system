import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css';
import '../styles/Location.css';
import image1 from '../assets/indoor.PNG';
import image2 from '../assets/outdoor.PNG';
import markerIconUrl from '../assets/marker.png'; 

const markerIcon = new L.Icon({
    iconUrl: markerIconUrl,
    iconSize: [50, 45], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34] // Point from which the popup should open relative to the iconAnchor
});

const Location = () => {
  const center = [9.308715708493441, 123.30354446030861];
  const zoom = 15; // zoom

  return (
    <div className="location-container">
      <h1>Our Location</h1>
      <div className="image-container">
        <img src={image1} alt="Outdoor view of Epicenter" />
        <img src={image2} alt="Indoor view of Epicenter" />
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
  );
};

export default Location;
