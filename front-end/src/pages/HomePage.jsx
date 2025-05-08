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
        <a href="/gateway" className="homebtn"><span> See Measure </span></a>
        <a href="/itemdevelopers" className="homebtn"><span> See Item Developers </span></a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
