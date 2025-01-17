import React from 'react';
import '../styles/HomePage.css'; 
import Profile from '../components/profile'
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

function Users() {
    const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
    const navigate = useNavigate();
    if (!isAuthenticated) {
    navigate("/unauthorized");
    }
    return (
        <div>
            <div>User profile picture should show up, not working on firefox :/</div>
            <Profile />
        </div>
    );
};

export default Users;