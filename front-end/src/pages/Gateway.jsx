import React from 'react';
import '../styles/HomePage.css'; 
import '../styles/Gateway.css'; 
import { Dropdown } from 'react-bootstrap'; // Add this import
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS bundle


const Gateway = () => {
  return (
    <div className="home-container">
      <h2 className="about-title">Ogun Measure</h2>
      <div className="about-content">
        <div class="container">
        <a href="/rsg" className="homebtn"><span> See Facets </span></a>
        <a href="" className="homebtn"><span> See Pathways </span></a>
        <a className="homebtn"><span> See Periods </span></a>
        <a href="/viewdata" className="homebtn"><span> Generate Data </span></a>


        <div>
        <Dropdown>
            <Dropdown.Toggle className="custom-dropdown-toggle" id="dropdown-basic">
                See Facets
            </Dropdown.Toggle>
            <Dropdown.Menu className="custom-dropdown-menu">
                <Dropdown.Item href="/rsg" className="custom-dropdown-item">Residential Segregation and Gentrification</Dropdown.Item>
                <Dropdown.Item className="custom-dropdown-item">Property Ownership</Dropdown.Item>
                <Dropdown.Item className="custom-dropdown-item">Government Representation</Dropdown.Item>
                <Dropdown.Item className="custom-dropdown-item">Policing and Incarceration</Dropdown.Item>
                <Dropdown.Item className="custom-dropdown-item">Income and Poverty</Dropdown.Item>
                <Dropdown.Item className="custom-dropdown-item">Occupational Segregation and Unemployment</Dropdown.Item>
                <Dropdown.Item className="custom-dropdown-item">Healthcare Access</Dropdown.Item>
                <Dropdown.Item className="custom-dropdown-item">Healthy Food Access</Dropdown.Item>
                <Dropdown.Item className="custom-dropdown-item">Environmental Pollution</Dropdown.Item>
                <Dropdown.Item className="custom-dropdown-item">Media and Marketing</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Gateway;
