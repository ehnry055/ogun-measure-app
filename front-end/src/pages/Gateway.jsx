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
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0); 
    }
  }, [location]);

  return (
    <div className="gateway-page">
      
      <div id="anti-indigenous" className="gateway-split">
        <div className="gateway-left">
          <div style={{ width: '100%', height: '100%', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
             Placeholder Image
          </div>
        </div>
        <div className="gateway-right">
          <h2 className="about-title gateway-title">Anti-American Indian / Alaskan Native Measures</h2>
          <div className="text-content">
            <p>
              We now plan to import a new Excel file containing three different
              sets of variables, each representing a different facet of anti-Latinx
              structural racism, two of them measured on a county level and the other
              on a state level. The first set, under the tab name “Education” displays
              each US county dissimilarity index capturing the extent to which the racial
              composition of each district deviates from the overall county-level
              distribution. Years from 1987 to 2018 are included. Data from the 
              National Center for Education Statistics on student enrollment by 
              school districts, race/ethnicity was used. The second set, under 
              the tab name “Media” displays polarity indexes based on sentiment 
              analyses of media pieces on a state level. The data was extracted 
              from Media Cloud using Python packages. BERT and Vader sentiment 
              polarity measures were calculated to build the final indexes. 
              The third set, under the tab name “Land ownership” displays the 
              proportion of Hispanic landowners/White non-Hispanic land owners 
              based on IPUMS data from 1900 to 2023, on a county level. 
              A final variable, “racism_num” assigns a value of 1 to a 
              county-year where Hispanic landownership remained markedly 
              low relative to non-Hispanic White landownership (below the 0.06 threshold), 
              while a value of 0 indicates a county-year where this ratio met or exceeded 0.06. 
              The last tab of the document displays IPUMS codes for States and Counties. 
              Me and my team will not propose export of any materials below census region/division.
              The data sources used for this dataset can be found below:

              https://nces.ed.gov/ccd/ccddata.asp
              https://www.mediacloud.org/
              https://usa.ipums.org/usa/
            </p>
          </div>
        </div>
      </div>


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


      <div id="anti-latine" className="gateway-split">
        <div className="gateway-left">
          <div style={{ width: '100%', height: '100%', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
             Placeholder Image
          </div>
        </div>
        <div className="gateway-right">
          <h2 className="about-title gateway-title">Anti-Latine Measures</h2>
          <div className="text-content">
            <p>
              Historical Land Cessions (Royce) Polygons of Native American land cessions 
              from 1784–1894, digitized from Charles C. Royce's Indian Land Cessions in 
              the United States (1896–97) by the U.S. Forest Service Office of 
              Tribal Relations, accessed via the same ArcGIS viewer: 
              usg.maps.arcgis.com/apps/webappviewer/index.html?id=eb6ca76e008543a89349ff2517db47e6
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Gateway;