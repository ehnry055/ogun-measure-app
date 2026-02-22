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
  const [hasDataAccess, setHasDataAccess] = useState(false);

  useEffect(() => {
    const setPermissionState = async () => {
      if (!isAuthenticated) {
        setIsAdmin(false);
        setHasDataAccess(false);
        return;
      }

      try {
        const token = await getAccessTokenSilently();
        const decodedToken = jwtDecode(token);
        const permissions = decodedToken.permissions || [];
        const hasAdminPermission =
          permissions.includes("adminView");
        const hasRegisteredPermission =
          permissions.includes("registeredView");

        setIsAdmin(Boolean(hasAdminPermission));
        setHasDataAccess(Boolean(hasAdminPermission || hasRegisteredPermission));
      } catch (error) {
        console.error("Unable to read admin permissions", error);
        setIsAdmin(false);
        setHasDataAccess(false);
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
          {/* LEFT: intentionally empty */}
          <div className="navbar-left">
             <NavLink to="/">
                <img 
                  src={logo} 
                  alt="Logo" 
                  style={{ height: "50px", width: "auto" }} // Adjust height as needed
                />
             </NavLink>
          </div>

          {/* RIGHT: Request Data + Login / Logout */}
          <div className="navbar-right">
            {!isLoading && (
              <NavLink
                to="/requests"
                className="btn btn-primary"
                style={{ textDecoration: "none" }}
              >
                Request Data
              </NavLink>
            )}
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

          {!isLoading && isAuthenticated && hasDataAccess && (
            <NavLink to="/viewdata" className="nav-link">
              Data
            </NavLink>
          )}

          <NavLink to="/map" className="nav-link">
            Map
          </NavLink>

        </div>
      </div>
    </header>
  );
}

export default Navbar;
