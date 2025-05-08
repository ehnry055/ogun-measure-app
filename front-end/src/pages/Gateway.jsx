import React from 'react';
import '../styles/HomePage.css'; 
import '../styles/Gateway.css'; 
import { Dropdown } from 'react-bootstrap'; // Add this import
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS bundle
import OGUN from '../assets/OGUN.jpg';

const Gateway = () => {
  return (
    <div className="home-container">
      <h2 className="about-title">Ogun Measure</h2>
      {/* <div className="about-content"> */}
      <div className="center-text-container">
        <img src={OGUN} alt="OGUN" className="ogunimg" />
        <div className="text-content">
        <p>
            During the Trans-Atlantic Slave Trade, some people racialized as Black and
            enslaved for it called on the strength of Ogun to protect and empower them.
        </p>
        <p>
            This measure captures 10 facets, 2 pathways, and 3 historical periods
            representing the 400+ years of Anti-Black Structural Racism in the United
            States.
        </p>
        </div>
        </div>
        {/* <div class="container"> */}
        {/* <a href="/rsg" className="homebtn"><span> See Facets </span></a>
        <a href="" className="homebtn"><span> See Pathways </span></a>
        <a className="homebtn"><span> See Periods </span></a>
        <a href="/viewdata" className="homebtn"><span> Generate Data </span></a> */}

        <div class="gateway-dropdown-container"> 
        <Dropdown className="gateway-dropdown">
            <Dropdown.Toggle className="gateway-dropdown-toggle">
                See Facets
            </Dropdown.Toggle>
            <Dropdown.Menu className="gateway-dropdown-menu">
                <Dropdown.Item href="/rsg" className="gateway-dropdown-item">Residential Segregation and Gentrification</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item">Property Ownership</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item">Government Representation</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item">Policing and Incarceration</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item">Income and Poverty</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item">Occupational Segregation and Unemployment</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item">Healthcare Access</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item">Healthy Food Access</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item">Environmental Pollution</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item">Media and Marketing</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="gateway-dropdown">
            <Dropdown.Toggle className="gateway-dropdown-toggle">
                See Pathways
            </Dropdown.Toggle>
            <Dropdown.Menu className="gateway-dropdown-menu">
                <Dropdown.Item href="/rsg" className="gateway-dropdown-item">Structural Violence</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item">Limited and Restricted Access</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="gateway-dropdown">
            <Dropdown.Toggle className="gateway-dropdown-toggle">
                See Periods
            </Dropdown.Toggle>
            <Dropdown.Menu className="gateway-dropdown-menu">
                <Dropdown.Item href="/rsg" className="gateway-dropdown-item">Historical Period 1 Pre-Civil Rights 1619-1968</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item">Historical Period 2 Desegregation 1969-1999</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item">Historical Period 3 Modern Times 2000-Present</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

        {/* <a href="/viewdata" className="homebtn" id="gendata"><span> Generate Data </span></a> */}
        </div>
        {/* </div> */}
        <div class="return">
            <a href="/viewdata" className="homebtn" id="gendata"><span> Generate Data </span></a>
        </div>
      {/* </div> */}
    </div>
  );
};

export default Gateway;
