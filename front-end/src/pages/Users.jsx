import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Profile from '../components/profile';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Users() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdminRole = async () => {
            try {
                const token = await getAccessTokenSilently();
                setAccessToken(token);

                // Decode the token to check for the admin role
                const decodedToken = jwtDecode(token);
                if (decodedToken && decodedToken.roles && decodedToken.roles.includes('admin')) {
                    setIsAdmin(true);
                } else {
                    navigate("/unauthorized");
                }
            } catch (error) {
                console.error("Error fetching access token", error);
                navigate("/unauthorized");
            }
        };

        if (isAuthenticated) {
            checkAdminRole();
        } else {
            navigate("/unauthorized");
        }
    }, [isAuthenticated, getAccessTokenSilently, navigate]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/authorized', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log('Data:', response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (accessToken && isAdmin) {
            fetchData();
        }
    }, [accessToken, isAdmin]);

    return (
        <div>
            <div>User profile picture should show up, not working on firefox :/</div>
            <Profile />
        </div>
    );
}

export default Users;