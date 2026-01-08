import "../styles/Navbar.css";
import columbiaLogo from "../assets/columbia-logo.svg";
import { Link } from "react-router-dom";
import LoginButton from "./login";

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

        {/* CENTER: original navigation behavior */}
        <div className="navbar-center">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/ogun" className="nav-link">Measure</Link>
          <Link to="/viewdata" className="nav-link">Data</Link>
          <Link to="/itemdevelopers" className="nav-link">About</Link>
        </div>

        {/* RIGHT: original Auth0 login */}
        <div className="navbar-right">
          <LoginButton />
        </div>

      </div>
    </header>
  );
}

export default Navbar;
