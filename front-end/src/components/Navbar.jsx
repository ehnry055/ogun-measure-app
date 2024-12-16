import React from 'react';
import '../styles/Navbar.css'; 
import columbiaLogo from '../assets/columbia-logo.png'; 
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './login';
import LogoutButton from './logout';

function Navbar() {
  return (
    <div className="top-navbar">
      <div className="navbar-left">
        <img
          src={columbiaLogo} 
          alt="Columbia Logo"
          className="logo"
        />
        <span className="title">Columbia</span>
        <span className="subtitle">Racism Data System</span>
      </div>
      <div className="navbar-center">
        <nav className="nav-links">
          <a href="/" className="nav-link">🏠 Home</a>
          <a href="/users" className="nav-link">👤 Users</a>
          <a href="/data" className="nav-link">📁 Data</a>
          <a href="/graphs" className="nav-link">📊 Graphs</a>
        </nav>
      </div>
      <div className="navbar-right">
        <input type="text" className="search-bar" placeholder="Search..." />
        <LoginButton />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Navbar;
