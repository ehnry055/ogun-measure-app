import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import "../styles/HomePage.css";
import "../styles/Gateway.css";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import OGUN from "../assets/OGUN.jpg";

const Gateway = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace("#", "");
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          // Changed block: "start" to align perfectly with the navbar
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0); 
    }
  }, [location]);

  return (
    <div className="gateway-page">
      
      {/* --- SECTION 1: Anti-Indigenous Measures --- */}
      <div id="anti-indigenous" className="gateway-split">
        <div className="gateway-left">
          <div style={{ width: '100%', height: '100%', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
             Placeholder Image
          </div>
        </div>
        <div className="gateway-right">
          <h2 className="about-title gateway-title">Anti-American Indian / Alaskan Native Measures</h2>
          <div className="text-content">
            <p>Description goes here...</p>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: Ogun Measure --- */}
      <div id="ogun" className="gateway-split">
        <div className="gateway-left">
          <img src={OGUN} alt="Ogun statue" className="ogunimg-full" />
        </div>

        <div className="gateway-right">
          <h2 className="about-title gateway-title">Ogun Measure</h2>

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

          <div className="gateway-dropdown-container">
            <Dropdown className="gateway-dropdown">
              <Dropdown.Toggle className="gateway-dropdown-toggle">
                See Facets
              </Dropdown.Toggle>

              <Dropdown.Menu className="gateway-dropdown-menu">
                <Dropdown.Item href="/ResidentialSegregationGentrification" className="gateway-dropdown-item">Residential Segregation and Gentrification</Dropdown.Item>
                <Dropdown.Item href="/PropertyOrganization" className="gateway-dropdown-item">Property Ownership</Dropdown.Item>
                <Dropdown.Item href="/GovernmentRepresentation" className="gateway-dropdown-item">Government Representation</Dropdown.Item>
                <Dropdown.Item href="/PolicingIncarceration" className="gateway-dropdown-item">Policing and Incarceration</Dropdown.Item>
                <Dropdown.Item href="/IncomePoverty" className="gateway-dropdown-item">Income and Poverty</Dropdown.Item>
                <Dropdown.Item href="/OccupationalSegregationUnemployment" className="gateway-dropdown-item">Occupational Segregation and Unemployment</Dropdown.Item>
                <Dropdown.Item href="/HealthcareAccess" className="gateway-dropdown-item">Healthcare Access</Dropdown.Item>
                <Dropdown.Item href="/HealthyFoodAccess" className="gateway-dropdown-item">Healthy Food Access</Dropdown.Item>
                <Dropdown.Item href="/EnvironmentalPollution" className="gateway-dropdown-item">Environmental Pollution</Dropdown.Item>
                <Dropdown.Item href="/MediaMarketing" className="gateway-dropdown-item">Media and Marketing</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <a href="/viewdata" className="homebtn" id="gendata">
              <span> Generate Data </span>
            </a>
          </div>
        </div>
      </div>

      {/* --- SECTION 3: Anti-Latine Measures --- */}
      <div id="anti-latine" className="gateway-split">
        <div className="gateway-left">
          <div style={{ width: '100%', height: '100%', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
             Placeholder Image
          </div>
        </div>
        <div className="gateway-right">
          <h2 className="about-title gateway-title">Anti-Latine Measures</h2>
          <div className="text-content">
            <p>Description goes here...</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Gateway;