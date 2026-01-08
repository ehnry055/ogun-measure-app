import "../styles/Navbar.css";
import columbiaLogo from "../assets/columbia-logo.svg";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import LoginButton from "./login";
import LogoutButton from "./logout";

function Navbar() {
  const { isAuthenticated, isLoading } = useAuth0();

  return (
    <header className="navbar-wrapper">

      {/* TOP BAR */}
      <div className="navbar-top">
        <div className="navbar-top-inner">

          {/* LEFT: Columbia logo */}
          <div className="navbar-left">
            <img
              src={columbiaLogo}
              alt="Columbia University"
              className="navbar-logo"
            />
          </div>

          {/* RIGHT: Login / Logout */}
          <div className="navbar-right">
            {!isLoading && !isAuthenticated && <LoginButton />}
            {!isLoading && isAuthenticated && <LogoutButton />}
          </div>

        </div>
      </div>

      {/* BOTTOM THIN BAR */}
      <div className="navbar-bottom">
        <div className="navbar-bottom-inner">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/ogun" className="nav-link">Measure</Link>
          <Link to="/viewdata" className="nav-link">Data</Link>
          <Link to="/itemdevelopers" className="nav-link">About</Link>
        </div>
      </div>

    </header>
  );
}

export default Navbar;
