import React from 'react';
import '../styles/HomePage.css'; 

const HomePage = () => {
  return (
    <div className="home-container">
      <h2 className="about-title">The Story</h2>
      <div className="about-content">
        <p>
        In 2023, after developing and testing previous models of anti-Black structural racism,
Dr. Paris B. Adkins-Jackson developed the Multifaceted Life Course Measure of Anti-
Black Structural Racism, also referred to as the Ogun Measure. In close collaboration
with Drs. Justina F. Avila-Rieger and Tanisha G. Hill-Jarrett, the Ogun measure was
refined over the course of one year and presented to collaborators that would
become item developers (see below). In 2024, under the management of Ms. Muriel
Taks Calle, the Ogun measure underwent a rigorous data quality assurance process.
In 2025, the measure was psychometrically validated and provided to the scientific
community at-large. For more information on this measure, please read the manual
and the seminal article. 
        </p>
        <div class="container">
        <a href="/rsg" className="homebtn"><span> See Measure </span></a>
        <a href="/itemdevelopers" className="homebtn"><span> See Item Developers </span></a>
        </div>
      {/* </div>
      <div className="about-grid">
        <div className="text-box">
          <p>
          10 facets:
            <ol>
              <li>Residential Segregation and Gentrification (RSG)</li>
              <li>Property Ownership (PO)</li>
              <li>Government Representation (GR)</li>
              <li>Policing and Incarceration (PI)</li>
              <li>Income and Poverty (IP)</li>
              <li>Occupational Segregation and Unemployment (OSU)</li>
              <li>Healthcare Access (HCA)</li>
              <li>Healthy Food Access (HFA)</li>
              <li>Environmental Pollution (EP)</li>
              <li>Media and Marketing (MM)</li>
            </ol> 
          </p>
        </div> 
        {/* <div className="placeholder-box"></div> 
      </div>
      <div className="about-grid">
        <div className="placeholder-box"></div>
        <div className="text-box">
          <p>
          2 pathways:
          <li>Structural Violence (SV)</li>
          <li>Limited or Restricted Access (LRA)</li>
          <br />
          3 historical periods:
          <li>Before the Civil Rights Act of 1968 that included the Fair Housing Act legally ending residential segregation (Time Period 1)</li>
          <li>During Desegregation or Integration (1969-1999) (Time Period 2)</li>
          <li>Modern Times (2000-present) (Time Period 3)</li>

          </p>
        </div> */}
      </div>
    </div>
  );
};

export default HomePage;
