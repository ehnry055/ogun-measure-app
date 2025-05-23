import React from 'react';
import '../styles/HomePage.css'; 
import { useAuth0 } from "@auth0/auth0-react";

function UnAuthorized() {
    const { isLoading, error, user, loginWithRedirect, logout, isAuthenticated } = useAuth0();
    return (
        <div>
            {isAuthenticated && <p>You do not have permission to view this page!</p>}
            {!isAuthenticated && !isLoading && <p>You are not logged in!</p>}
        </div>
    );
};

export default UnAuthorized;