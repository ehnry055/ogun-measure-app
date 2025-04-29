import React from 'react';
import '../styles/HomePage.css'; 
import '../styles/Gateway.css'; 
import { Dropdown } from 'react-bootstrap'; // Add this import
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS bundle


const Gateway = () => {
  return (
    <div className="home-container">
      <h2 className="about-title">The Story</h2>
      <div className="about-content">
        <div class="container">
        <a href="/ogun" className="homebtn"><span> See Measure </span></a>
        <a href="/itemdevelopers" className="homebtn"><span> See Item Developers </span></a>
        <Dropdown alignRight>
            <Dropdown.Menu className="custom-dropdown-menu">
                <Dropdown.Item href="/profile" className="custom-dropdown-item">Profile</Dropdown.Item>
                <Dropdown.Item href="/requests" className="custom-dropdown-item">Requests</Dropdown.Item>
                <Dropdown.Item href="/settings" className="custom-dropdown-item">Settings</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Gateway;
