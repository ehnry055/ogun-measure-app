import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import UnAuthorized from '../pages/UnAuthorized';
import { useNavigate } from 'react-router-dom';


const AdminRoute = ({Component}) => {
    console.log("helllooo!!!");
    const { isAuthenticated, getAccessTokenSilently, error, isLoading } = useAuth0();
    navigate = useNavigate();
    const adminPerms = false;

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
                navigate ("/unauthorized");
                
                }
            } catch (error) {
                console.error('Error checking permissions:', error);
                navigate ("/unauthorized");
            }
        };
    
        checkPermissions();
    }, [isAuthenticated, getAccessTokenSilently]);
      
    if (isLoading) {
        console.log("loading...");
        return null;
    }
    if (!isAuthenticated && !isLoading) {
        return <UnAuthorized />;
    }

    return (
        <Component />
    );
}

export default AdminRoute;