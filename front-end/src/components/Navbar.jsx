import "../styles/Navbar.css";
import columbiaLogo from "../assets/columbia-logo.svg";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import LoginButton from "./login";
import LogoutButton from "./logout";

function Navbar() {
  const { isAuthenticated, isLoading } = useAuth0();

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

{/* CENTER: thin bar with navigation */}
<div className="navbar-center">
  <div className="nav-strip">
    <Link to="/" className="nav-link">Home</Link>
    <Link to="/ogun" className="nav-link">Measure</Link>
    <Link to="/viewdata" className="nav-link">Data</Link>
    <Link to="/itemdevelopers" className="nav-link">About</Link>
  </div>
</div>


        {/* RIGHT: Auth button (stable, no disappearing) */}
        <div className="navbar-right">
          {!isLoading && !isAuthenticated && <LoginButton />}
          {!isLoading && isAuthenticated && <LogoutButton />}

          {/* Optional: keeps space stable while loading */}
          {isLoading && <span style={{ visibility: "hidden" }}>Loading</span>}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
