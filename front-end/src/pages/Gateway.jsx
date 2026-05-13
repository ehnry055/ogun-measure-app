import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom"; 
import "../styles/HomePage.css";
import "../styles/Gateway.css";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import OGUN from "../assets/OGUN.jpg";
import LATINO from "../assets/LATINO.png";
import Alaska from "../assets/alaska.png";

const Gateway = () => {
  const location = useLocation();

  const [activeLatine, setActiveLatine] = useState(null);
  const [activeIndigenous, setActiveIndigenous] = useState(null);

  // --- UPDATED ANTI-INDIGENOUS FACETS ---
  const indigenousFacets = {
    nation: {
      name: "Nation",
      text: "Nation: The name of the tribe or tribes as it appeared in the original Royce Schedule (the historical name used in the treaty or legal document). This may differ from the present-day name. Example: 'Cherokee', 'Chippewa'.",
      table: "Anti_Indigenous_Measure"
    },
    nation_correct: {
      name: "Nation_Correct",
      text: "Nation_Correct: The present-day Indian tribe or tribes related to the historical name. This field was updated by the National NAGPRA Program to link historical names to federally recognized tribes as they exist today.",
      table: "Anti_Indigenous_Measure"
    },
    link: {
      name: "Link",
      text: "Link: A URL pointing to the Royce Schedule entry, treaty text, or relevant federal statute. This links to digitized primary source documents at sources like the HathiTrust Digital Library or the Library of Congress.",
      table: "Anti_Indigenous_Measure"
    },
    royce: {
      name: "Royce Area Number",
      text: "Royce: A unique identifier assigned by Royce to each cession, used to cross-reference the polygon on the map with the specific legal instrument. Essentially the primary key of the dataset.",
      table: "Anti_Indigenous_Measure" 
    },
    year: {
      name: "Year of Cession",
      text: "Year of Cession: The year the land was ceded, extracted from the date of the treaty, law, or executive order (Ranges from 1784 to 1894). Null values indicate the cession date was uncertain or not recorded.",
      table: "Anti_Indigenous_Measure"
    },
    ownership: {
      name: "Population / Land Ownership",
      text: "Ownership: County-level data (1900-2023) comparing AIAN vs. non-Hispanic White land ownership proportions. Includes 'racism_num' index based on a 0.06 threshold. Source: IPUMS.",
      table: "Anti_Indigenous_Measure"
    },
    ipums: {
      name: "IPUMS Codes",
      text: "IPUMS: Reference codes for States and Counties used in the documentation and data mapping.",
      table: "Anti_Indigenous_Measure"
    }
  };

  const latineFacets = {
    education: {
      name: "Education",
      text: "Displays each US county dissimilarity index capturing the extent to which the racial composition of each district deviates from the overall county-level distribution (1987-2018). Data from the National Center for Education Statistics on student enrollment by school districts, race/ethnicity was used.",
      table: "Anti_Latine_Measure_Education"
    },
    media: {
      name: "Media",
      text: "Displays polarity indexes based on sentiment analyses of media pieces on a state level. The data was extracted from Media Cloud using Python packages. BERT and Vader sentiment polarity measures were calculated to build the final indexes.",
      table: "Anti_Latine_Measure_Media"
    },
    land: {
      name: "Land Ownership",
      text: "Displays the proportion of Hispanic landowners/White non-Hispanic land owners based on IPUMS data from 1900 to 2023, on a county level.",
      table: "Anti_Latine_Measure_Land_Ownership"
    }
  };

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace("#", "");
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0); 
    }
  }, [location]);

  return (
    <div className="gateway-page">
      
      {/* --- ANTI-INDIGENOUS SECTION --- */}
      <div id="anti-indigenous" className="gateway-split">
        <div className="gateway-left">
          <img src={Alaska} alt="Alaska" className="ogunimg-full" />
        </div>
        <div className="gateway-right">
          <h2 className="about-title gateway-title">Anti-American Indian / Alaskan Native Racism Measures</h2>
          <div className="text-content">
            <p>Historical Land Cessions, Population data, and Land Ownership metrics representing Anti-Indigenous structural racism.</p>
            
            {activeIndigenous && (
              <div className="facet-description-box" style={{ backgroundColor: '#f0f4f8', padding: '15px', borderRadius: '8px', marginTop: '10px', borderLeft: '4px solid #0056b3', color: '#000' }}>
                <p style={{ color: '#000', margin: 0 }}><strong>{indigenousFacets[activeIndigenous].text}</strong></p>
              </div>
            )}
          </div>

          <div className="gateway-dropdown-container">
            <Dropdown className="gateway-dropdown">
              <Dropdown.Toggle className="gateway-dropdown-toggle">See Variables</Dropdown.Toggle>
              <Dropdown.Menu className="gateway-dropdown-menu" style={{ maxHeight: "300px", overflowY: "auto" }}>
                <Dropdown.Item className="gateway-dropdown-item" onClick={() => setActiveIndigenous('nation')}>Nation</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" onClick={() => setActiveIndigenous('nation_correct')}>Nation_Correct</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" onClick={() => setActiveIndigenous('link')}>Link</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" onClick={() => setActiveIndigenous('royce')}>Royce Area Number</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" onClick={() => setActiveIndigenous('year')}>Year of Cession</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" onClick={() => setActiveIndigenous('ownership')}>Population / Land Ownership</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" onClick={() => setActiveIndigenous('ipums')}>IPUMS Codes</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Link 
              to={activeIndigenous ? `/viewdata?table=${indigenousFacets[activeIndigenous].table}` : "/viewdata?table=Anti_Indigenous_Measure"} 
              className="homebtn"
            >
              <span> Generate {activeIndigenous ? indigenousFacets[activeIndigenous].name : "Indigenous"} Data </span>
            </Link>
          </div>
        </div>
      </div>

      {/* --- OGUN SECTION --- */}
      <div id="ogun" className="gateway-split">
        <div className="gateway-left">
          <img src={OGUN} alt="Ogun statue" className="ogunimg-full" />
        </div>
        <div className="gateway-right">
          <h2 className="about-title gateway-title">Ogun Measure</h2>
          <div className="text-content">
            <p>This measure captures 10 facets representing 400+ years of Anti-Black Structural Racism.</p>
          </div>
          <div className="gateway-dropdown-container">
            <Dropdown className="gateway-dropdown">
              <Dropdown.Toggle className="gateway-dropdown-toggle">See Facets</Dropdown.Toggle>
              <Dropdown.Menu className="gateway-dropdown-menu">
                <Dropdown.Item className="gateway-dropdown-item" href="/ResidentialSegregationGentrification">Residential Segregation and Gentrification</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" href="/PropertyOrganization">Property Ownership</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" href="/GovernmentRepresentation">Government Representation</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" href="/PolicingIncarceration">Policing and Incarceration</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" href="/IncomePoverty">Income and Poverty</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" href="/OccupationalSegregationUnemployment">Occupational Segregation and Unemployment</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" href="/HealthcareAccess">Healthcare Access</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" href="/HealthyFoodAccess">Healthy Food Access</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" href="/EnvironmentalPollution">Environmental Pollution</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" href="/MediaMarketing">Media and Marketing</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Link to="/viewdata" className="homebtn"><span> Generate Data </span></Link>
          </div>
        </div>
      </div>

      {/* --- ANTI-LATINE SECTION --- */}
      <div id="anti-latine" className="gateway-split">
        <div className="gateway-left">
          <img src={LATINO} alt="LATINO" className="ogunimg-full" />
        </div>
        <div className="gateway-right">
          <h2 className="about-title gateway-title">Anti-Latine Racism Measures</h2>
          <div className="text-content">
            <p>Importing variables representing facets of anti-Latinx structural racism across education, media, and land ownership.</p>
            
            {activeLatine && (
              <div className="facet-description-box" style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginTop: '10px', borderLeft: '4px solid #8C68CD', color: '#000' }}>
                <p style={{ color: '#000', margin: 0 }}><strong>{latineFacets[activeLatine].text}</strong></p>
              </div>
            )}
          </div>

          <div className="gateway-dropdown-container">
            <Dropdown className="gateway-dropdown">
              <Dropdown.Toggle className="gateway-dropdown-toggle">See Facets</Dropdown.Toggle>
              <Dropdown.Menu className="gateway-dropdown-menu">
                <Dropdown.Item className="gateway-dropdown-item" onClick={() => setActiveLatine('education')}>Education</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" onClick={() => setActiveLatine('media')}>Media</Dropdown.Item>
                <Dropdown.Item className="gateway-dropdown-item" onClick={() => setActiveLatine('land')}>Land Ownership</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Link 
              to={activeLatine ? `/viewdata?table=${latineFacets[activeLatine].table}` : "/viewdata"} 
              className="homebtn"
            >
              <span> Generate {activeLatine ? latineFacets[activeLatine].name : "Latine"} Data </span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Gateway;