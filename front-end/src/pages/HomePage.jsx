import React from 'react';
import '../styles/HomePage.css'; 

const HomePage = () => {
  return (
    <div className="home-container">
      <h2 className="about-title">The Story</h2>
      <div className="about-content">
        <p>
        dean was here 
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
