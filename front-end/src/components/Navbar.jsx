import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import columbiaLogo from "../assets/columbia-logo.svg";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* LEFT: Columbia logo */}
        <div className="navbar-left">
          <img
            src={columbiaLogo}
            alt="Columbia University"
            className="navbar-logo"
          />
        </div>

        {/* CENTER: navigation buttons */}
        <nav className="navbar-center">
          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/measure">Measure</Link></li>
            <li><Link to="/data">Data</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav>

        {/* RIGHT: Login */}
        <div className="navbar-right">
          <Link to="/login" className="login-button">
            Login
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
