import React from 'react';
import '../styles/Footer.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
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
              <li><a onClick={() => navigate('/')}>Home</a></li>
              <li><a onClick={() => navigate('/location')}>Location</a></li>
              <li><a onClick={() => navigate('/community')}>Community</a></li>
              <li><a onClick={() => navigate('/join-us')}>Join Us</a></li>
    
            </ul>
          </div>
          <div className="footer-section">
            <h4>MINI SITES</h4>
            <ul>
              <li><a onClick={() => navigate('/community')}>Epicenter Stalls</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-links">
        <div className="footer-section">
        <div className="footer-bottom">
          <p className="footer-section">
            Copyright © 2024 Epicenter
            <p><a onClick={() => navigate('/privacy')}>| Privacy |
              </a></p><p><a onClick={() => navigate('/termsOfUse')}>| Terms Of Use |</a></p>
          </p>
        </div>
       </div>
       </div>
      </footer>
    </div>
  );
}

export default Footer;
