import React from 'react';
import '../styles/HomePage.css'; 

const HomePage = () => {
  return (
    <div className="home-container">
      <h2 className="about-title">About Us</h2>
      <div className="about-content">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna. 
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna.
        </p>
      </div>
      <div className="about-grid">
        <div className="text-box">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna.
          </p>
        </div>
        <div className="placeholder-box"></div>
      </div>
      <div className="about-grid reverse">
        <div className="placeholder-box"></div>
        <div className="text-box">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
