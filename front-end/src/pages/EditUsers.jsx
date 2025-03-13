import React from 'react';
import '../styles/EditDatabasePage.css'; 
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import Token from "../components/token"
import { useState, useEffect } from 'react';

const EditUsers = () => {

  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log("Access token:", token); // Log the token for debugging
        const decodedToken = jwtDecode(token);
        //console.log("Decoded token:", decodedToken);

        const hasPermission = decodedToken.permissions && decodedToken.permissions.includes("adminView");
        //console.log("Has permission:", hasPermission);

        if (!hasPermission) {
          navigate("/unauthorized");
         // console.log("User does not have the required permission");
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        navigate("/unauthorized");
      }
    };

    checkPermissions();
  }, [isAuthenticated, getAccessTokenSilently, navigate]);

//  const token = getAccessTokenSilently();
//  console.log(token);
//  const decodedToken = jwtDecode(token);
//  console.log(decodedToken);

//  const hasPermission = decodedToken.permissions && decodedToken.permissions.includes('adminView');

//  if (!hasPermission) {
//    navigate("/unauthorized");
//  }


console.log("printing the edit users page");
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
        <h>This is where user editing will occur</h>
      </div>
    </div>
  );
};

export default EditUsers;