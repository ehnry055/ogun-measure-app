import React from "react";
import "../styles/HomePage.css";
import heroImage from "../assets/encouraging.png";
import { Link } from "react-router-dom";

const HomePage = () => {
  const measures = [
    "Anti-American Indian and/or Alaskan Native Measures",
    "Multifaceted Life Course Measure of Anti-Black Structural Racism (Ogun)",
    "Anti-Latine Measures",
  ];

  return (
    <div className="home-page">

      {/* IMAGE WITH OVERLAY TEXT */}
      <div className="home-hero">
        <img src={heroImage} alt="Encouraging" />

        <div className="hero-overlay">
          <h1 className="hero-main-title">Measures of Structural Racism</h1>
          <p className="hero-subtitle">
            To change the future, we must reckon with the past.
            To heal people, we must change the circumstances that produce disease.
            These measures of structural racism are as artifacts of stories that affect the present. 
            Use them to transform trauma and pain into health.
          </p>
        </div>
      </div>

      {/* MEASURES */}
      <div className="home-container">
        <div className="measures-box">
          <h2 className="about-title">Measures</h2>

          <div className="measure-grid">
            {measures.map((title) => (
              <div className="measure-card" key={title}>
                <h3 className="measure-title">{title}</h3>
                <Link to="/gateway" className="homebtn">
                  <span>See Measure</span>
                </Link>
              </div>
            ))}
          </div>
          
          <p className="about-content">Select a measure to continue.</p>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
