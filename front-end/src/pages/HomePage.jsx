import React from "react";
import "../styles/HomePage.css";
import ogunImage from "../assets/OGUN.jpg";

const HomePage = () => {
  return (
    <div className="home-container">
      {/* HERO / HEADER */}
      <header className="home-hero">
        <div className="home-hero-left">
          <img
            src={ogunImage}
            alt="Ogun Measure"
            className="home-hero-image"
          />
        </div>

        <div className="home-hero-right">
          <h1>The Story</h1>
          <p>
            In 2023, after developing and testing previous models of anti-Black
            structural racism, Dr. Paris B. Adkins-Jackson developed the
            Multifaceted Life Course Measure of Anti-Black Structural Racism,
            also referred to as the Ogun Measure. In close collaboration with
            Drs. Justina F. Avila-Rieger and Tanisha G. Hill-Jarrett, the Ogun
            measure was refined over the course of one year and presented to
            collaborators that would become item developers.
          </p>

          <p>
            In 2024, under the management of Ms. Muriel Taks Calle, the Ogun
            measure underwent a rigorous data quality assurance process. In
            2025, the measure was psychometrically validated and provided to the
            scientific community at-large.
          </p>

          <div className="home-button-row">
            <a href="/measure" className="home-button primary">
              See Measure
            </a>
            <a href="/item-developers" className="home-button secondary">
              See Item Developers
            </a>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HomePage;
