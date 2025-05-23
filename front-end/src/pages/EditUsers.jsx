import React from 'react';
import '../styles/DownloadDatabasePage.css'; 
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import Token from "../components/token"
import { useState, useEffect } from 'react';

const EditUsers = () => {

  //AdminRole check
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const [isAuthorized, setIsAuthorized] = useState(() => {
    const initialState = false;
    return initialState;
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log("Access token:", token); // Log the token for debugging
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);

        const hasPermission = decodedToken.permissions && decodedToken.permissions.includes("adminView");
        console.log("Has permission:", hasPermission);

        if (!hasPermission) {
          console.log("User does not have the required permission");
          navigate("/unauthorized");
        }
        else {
          console.log("changed isAuthorized to true");
          setIsAuthorized(true);
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

  if(!isAuthenticated || isLoading || !isAuthorized) {
    console.log('isAuthenticated ', !isAuthenticated);
    console.log('isLoading ', isLoading);
    console.log('isAuthorized ', !isAuthorized);
    return null;
  }
  
  console.log("Authorized!");
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