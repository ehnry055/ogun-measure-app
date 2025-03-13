import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import UnAuthorized from '../pages/UnAuthorized';


const AdminRoute = async ({Component}) => {
    console.log("helllooo!!!");
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    
    const checkPermissions = async () => {
        try {
        const token = await getAccessTokenSilently();
        console.log("Access token:", token); // Log the token for debugging
        const decodedToken = jwtDecode(token);
        //console.log("Decoded token:", decodedToken);

        const hasPermission = decodedToken.permissions && decodedToken.permissions.includes("adminView");
        console.log("Has permission:", hasPermission);

        if (hasPermission) {
            return true;
        }
        } catch (error) {
        console.error('Error checking permissions:', error);
        return (false);
        }
    };
    const param = await checkPermissions();
    if(param == true) {
        console.log("itstrue!");
        return (<Component />);
    }
    else {
        console.log("itsfalse!");
        return <UnAuthorized />;
    }
}

export default AdminRoute;