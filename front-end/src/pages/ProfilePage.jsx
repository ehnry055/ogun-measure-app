import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Profile from '../components/profile';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function ProfilePage() {
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
             // console.log("User does not have the required permission");
            }
          } catch (error) {
            console.error('Error checking permissions:', error);
            navigate("/unauthorized");
          }
        };
    
        checkPermissions();
      }, [isAuthenticated, getAccessTokenSilently, navigate]);

    return (
        <div>
            <div>User profile picture should show up, not working on firefox :/</div>
            <Profile />
        </div>
    );
}

export default ProfilePage;