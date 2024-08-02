import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import LoginA from './Admin/login_a'; // Make sure the path is correct
import LoginT from './Tenant/login_t'; // Make sure the path is correct

function NavigationComponent() {
    const navigate = useNavigate();

    return (
        <>
            <p>SELECT USER LOGIN TO EPICENTER</p>
            <div className="container">
                <div className="square" onClick={() => navigate('/login_admin')}>ADMIN</div>
                <div className="square" onClick={() => navigate('/login_tenant')}>TENANT</div>
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<NavigationComponent />} />
                    <Route path="/login_admin" element={<LoginA />} />
                    <Route path="/login_tenant" element={<LoginT />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
