import "../styles/Navbar.css";
import columbiaLogo from "../assets/columbia-logo.svg";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* LEFT */}
        <div className="navbar-left">
          <img
            src={columbiaLogo}
            alt="Columbia University"
            className="navbar-logo"
          />
        </div>

        {/* CENTER */}
        <div className="navbar-center">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/measure" className="nav-link">Measure</Link>
          <Link to="/data" className="nav-link">Data</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>

        {/* RIGHT */}
        <div className="navbar-right">
          <Link to="/login" className="nav-link login">Login</Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
