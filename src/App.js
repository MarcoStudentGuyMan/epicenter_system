import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Homepage/navbar';
import Home from './Homepage/home';
import Location from './Homepage/location';
import Community from './Homepage/community';
import JoinUs from './Homepage/joinus';
import Footer from './Homepage/footer';
import LoginA from './Admin/login_a';
import LoginT from './Tenant/login_t';
import './App.css';
function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="Routes">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/location" element={<Location />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/join-us" element={<JoinUs />} />
                        <Route path="/login_admin" element={<LoginA />} />
                        <Route path="/login_tenant" element={<LoginT />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
