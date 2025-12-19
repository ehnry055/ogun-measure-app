import React from 'react';
import '../styles/HomePage.css'; 

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="objective-band">
        <div className="objective-card">
          <h2 className="objective-title">Our objective</h2>

          <div className="objective-row">
            <div className="objective-text">
              <p>
                In 2023, after developing and testing previous models of anti-Black structural racism,
                Dr. Paris B. Adkins-Jackson developed the Multifaceted Life Course Measure of Anti-
                Black Structural Racism (the Ogun Measure). Our objective is to provide a
                validated, well-documented measurement tool that researchers and communities
                can use to study and address structural racism across contexts.
              </p>
            </div>

            <div className="objective-image">
              <img src="/placeholder-objective.jpg" alt="Objective illustration" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
