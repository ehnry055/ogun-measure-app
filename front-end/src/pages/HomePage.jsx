import React from "react";
import "../styles/HomePage.css";
import heroImage from "../assets/Columbia-hero.png";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page">

      {/* INTRO TEXT ABOVE IMAGE */}
      <div className="home-intro">
        <h1 className="home-intro-title">Ogun Measure Database</h1>
        <p className="home-intro-subtitle">
          A comprehensive framework for measuring anti-Black structural racism
          across the life course in the United States.
        </p>
      </div>

      {/* IMAGE UNDER INTRO */}
      <div className="home-hero">
        <img src={heroImage} alt="Columbia University Campus" />
      </div>

      {/* STORY BOX */}
      <div className="home-container">
        <div className="story-box">
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

            <div className="home-actions">
              <Link to="/gateway" className="homebtn">
                <span>See Measure</span>
              </Link>

              <Link to="/itemdevelopers" className="homebtn">
                <span>See Item Developers</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
