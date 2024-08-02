import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import LoginA from './Admin/login_a'; // Reintroduce this component
import LoginT from './Tenant/login_t';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login_admin" element={<LoginA />} />
      <Route path="/login_tenant" element={<LoginT />} />
    </Routes>
  </Router>
);
