import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/logo.png'; 

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Epicenter Logo" ></img>
        <span>EPICENTER</span>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/location">Location</Link>
        <Link to="/community">Community</Link>
        <Link to="/join-us">Join Us</Link>
      </div>
    </nav>
  );
}

export default Navbar;
