import React from 'react';
import '../styles/Footer.css';
import logo from '../assets/logo.png';

function Footer() {
  return (
    <div className="footer-container">
      <footer className="footer">
        <div className="footer-logo">
          <img src={logo} alt="Epicenter Logo" className="logo" />
        </div>
        <div className="footer-description">
          <p>
            Epicenter is a food park that is located in San Jose Extension, Dumaguete City. That has 11 food stalls with
            different varieties of delicacies and cuisines. We are happy to present and showcase the local food that the
            city of gentle people can make. Stop by at Epicenter to taste a bite of these food that can only be found at
            the heart of the Dumaguete City.
          </p>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h4>EPICENTER</h4>
            <ul>
              <li>Home</li>
              <li>Location</li>
              <li>Community</li>
              <li>Join Us</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>MINI SITES</h4>
            <ul>
              <li>Epicenter Stalls</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            Copyright © 2024 Epicenter | Privacy | Terms Of Use
          </p>
        </div>
       
      </footer>
    </div>
  );
}

export default Footer;
