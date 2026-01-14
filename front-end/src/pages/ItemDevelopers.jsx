import React from "react";
import "../styles/HomePage.css";
import { Link } from "react-router-dom";

function ItemDevelopers() {
  return (
    <div className="home-page">
      <div className="home-container">
        <div className="story-box">
          <h2 className="about-title">Item Developers</h2>

          <div className="about-content">
            <p>
              Item developers included: Justina Avila-Rieger, Tanisha Hill-Jarrett, Ariana Gobaud, Boeun
              Kim, Muriel Taks Calle, Victoria Joseph, Longyuan Gao, Woomy Michel, Dillon Sparks, Ellesse
              Akre, Ganesh Babulal, Tahlia Bragg, Leia Belt, Safiyyah M. Okoye, Tiffany N. Ford, Jennifer J.
              Manly, Rachel Hardeman, Kene Orakwue, Katherine Keyes, Dominika Seblova, Meies-Amor
              Matz, Kendra Sims, Mudia Uzzi, Deidra C. Crews, Arindam Bagga, Melissa D. Hladek, Lisa L.
              Barnes, Sydney Isabella Leung, Gina Wang, and Yixuan Ding.
            </p>

            <p>
              Scientific and technical support came from: Muriel Taks Calle, Victoria Joseph, Christina A.
              Mehranbod, Gabriella Solomon, Gilbert Gee, Roland J. Thorpe, Jr., Laura Samuel, Karen
              Bandeen-Roche, Sarah Szanton, Zeyu Dong, Cailyn E. Clemons, Jaren L. Wyaco, Richard
              George, Lorraine Benn, Yao Zeng, Sydney Isabella Leung, Gina Wang, and Yixuan Ding.
            </p>

            <div className="home-actions">
              <Link to="/gateway" className="homebtn">
                <span>See Measure</span>
              </Link>
              <Link to="/" className="homebtn">
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDevelopers;
