import React from 'react';
import '../styles/EditDatabasePage.css'; 
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import Token from "../components/token"

const EditUsers = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const navigate = useNavigate();
  if (!isAuthenticated) {
    navigate("/unauthorized");
  }

  return (
    <div className="edit-database-container">
      <div className="saved-section">
        <h2 className="section-title">Registered Users</h2>
          <ul className="saved-users">
              <li>Jason Chae: jascha25@bergen.org</li>
              <li>Henry Choi: hencho25@bergen.org</li>
              <li>Stephen Yoon: steyoo25@bergen.org</li>
              <li>Brendon Wan: brewan25@bergen.org</li>
          </ul>
      </div>
      <div>
          <h>this is where user editing will occur</h>
          <h1>
            place a ^token /^ here later
          </h1>
      </div>
    </div>
  );
};
  
export default EditUsers;
  