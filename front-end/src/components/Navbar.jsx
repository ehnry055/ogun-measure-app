import "../styles/Navbar.css";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";

import LoginButton from "./login";
import LogoutButton from "./logout";
import logo from "../assets/mosr.png";

function Navbar() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);
  const [canManageData, setCanManageData] = useState(false);

  useEffect(() => {
    const setPermissionState = async () => {
      if (!isAuthenticated) {
        setIsAdmin(false);
        setCanManageData(false);
        return;
      }

      try {
        const token = await getAccessTokenSilently();
        const decodedToken = jwtDecode(token);
        const permissions = decodedToken.permissions || [];
        
        const hasAdminPermission = permissions.includes("adminView");
        // Matches the permissions from ChangeDatabasePage
        const hasManagePermission = hasAdminPermission || permissions.includes("registeredView");

        setIsAdmin(hasAdminPermission);
        setCanManageData(hasManagePermission);
      } catch (error) {
        console.error("Unable to read admin permissions", error);
        setIsAdmin(false);
        setCanManageData(false);
      }
    };

    if (!isLoading) {
      setPermissionState();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  return (
    <header className="navbar-wrapper">
      {/* TOP BAR */}
      <div className="navbar-top">
        <div className="navbar-top-inner">
          {/* LEFT: Logo */}
          <div className="navbar-left">
             <NavLink to="/">
                <img 
                  src={logo} 
                  alt="Logo" 
                  style={{ height: "50px", width: "auto" }} 
                />
             </NavLink>
          </div>

          {/* RIGHT: Buttons + Login / Logout */}
          <div className="navbar-right">
            {!isLoading && !isAdmin && (
              <NavLink
                to="/requests"
                className="btn btn-primary"
                style={{ textDecoration: "none" }}
              >
                Request Data
              </NavLink>
            )}

            {/* NEW BUTTON: Manage Database */}
            {!isLoading && canManageData && (
              <NavLink
                to="/changedatabase" /* Double check this matches your App.js route! */
                className="btn btn-outline-primary"
                style={{ textDecoration: "none", marginLeft: "10px" }}
              >
                Manage Database
              </NavLink>
            )}

            {/* Review Requests */}
            {!isLoading && isAdmin && (
              <NavLink
                to="/admin/requests"
                className="btn btn-outline-primary"
                style={{ textDecoration: "none", marginLeft: "10px" }}
              >
                Review Requests
              </NavLink>
            )}

            {!isLoading && !isAuthenticated && <LoginButton />}
            {!isLoading && isAuthenticated && <LogoutButton />}
          </div>
        </div>
      </div>

      {/* BOTTOM NAV BAR */}
      <div className="navbar-bottom">
        <div className="navbar-bottom-inner">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>

          <NavLink to="/gateway" className="nav-link">
            Measure
          </NavLink>

          <NavLink to="/viewdata" className="nav-link">
            Data
          </NavLink>

          <NavLink to="/map" className="nav-link">
            Map
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Navbar;