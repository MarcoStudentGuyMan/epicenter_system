import React from 'react';
import '../styles/Footer.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  return (
    <div className="footer-container">
      <footer className="footer">
        <Link to="/">
          <div className="footer-logo" style={{ cursor: 'pointer' }}>
            <img src={logo} alt="Epicenter Logo" className="logo" />
          </div>
        </Link>

        <div className="footer-description">
          <p>
            Epicenter is a food park that is located in San Jose Extension, Dumaguete City. It has 11 food stalls with
            different varieties of delicacies and cuisines. We are happy to present and showcase the local food that the
            city of gentle people can make. Stop by at Epicenter to taste a bite of these foods that can only be found at
            the heart of Dumaguete City.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h4>EPICENTER</h4>
            <ul>
              <li><a className="footer-link" onClick={() => navigate('/')}>Home</a></li>
              <li><a className="footer-link" onClick={() => navigate('/location')}>Location</a></li>
              <li><a className="footer-link" onClick={() => navigate('/community')}>Community</a></li>
              <li><a className="footer-link" onClick={() => navigate('/join-us')}>Join Us</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>MINI SITES</h4>
            <ul>
              <li><a className="footer-link" onClick={() => navigate('/community')}>Epicenter Stalls</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>LEGAL</h4>
            <ul>
              <li><a className="footer-link" onClick={() => navigate('/privacy')}>Privacy</a></li>
              <li><a className="footer-link" onClick={() => navigate('/termsOfUse')}>Terms Of Use</a></li>
            </ul>
          </div>
        </div>
      </footer>

      <div className="footer-bottom">
        <p>Copyright © 2024 Epicenter</p>
      </div>
    </div>
  );
}

export default Footer;
