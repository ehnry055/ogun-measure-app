import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import '../styles/EditDatabasePage.css';

const EditUsers = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, getAccessTokenSilently, isLoading, user } = useAuth0();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_domain;
  const MANAGEMENT_API_CLIENT_ID = process.env.REACT_APP_AUTH0_clientId;
  const MANAGEMENT_API_CLIENT_SECRET = process.env.REACT_APP_AUTH0_SECRET;

  // Get management API token
  const getManagementApiToken = async () => {
    try {
      const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
        client_id: MANAGEMENT_API_CLIENT_ID,
        client_secret: MANAGEMENT_API_CLIENT_SECRET,
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
        grant_type: 'client_credentials'
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting management token:', error);
      throw error;
    }
  };

  // Fetch admins from Auth0
  const fetchAdmins = async () => {
    try {
      const token = await getManagementApiToken();
      const response = await axios.get(`https://${AUTH0_DOMAIN}/api/v2/roles/ROLE_ID/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError('Failed to load admins');
    }
  };

  // Add admin role
  const addAdmin = async (email) => {
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError('Invalid email format');
      return;
    }

    try {
      const token = await getManagementApiToken();
      
      // First get user ID from email
      const usersResponse = await axios.get(`https://${AUTH0_DOMAIN}/api/v2/users-by-email?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (usersResponse.data.length === 0) {
        setError('User not found');
        return;
      }

      const userId = usersResponse.data[0].user_id;

      // Assign admin role
      await axios.post(`https://${AUTH0_DOMAIN}/api/v2/users/${userId}/roles`, {
        roles: ['ROLE_ID'] // Replace with your actual admin role ID
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchAdmins(); // Refresh admin list
      setEmailInput('');
      setError('');
    } catch (error) {
      console.error('Error adding admin:', error);
      setError('Failed to add admin');
    }
  };

  // Remove admin role
  const removeAdmin = async (email) => {
    if (!window.confirm(`Are you sure you want to remove admin privileges from ${email}?`)) return;

    try {
      const token = await getManagementApiToken();
      
      // Get user ID from email
      const usersResponse = await axios.get(`https://${AUTH0_DOMAIN}/api/v2/users-by-email?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (usersResponse.data.length === 0) {
        setError('User not found');
        return;
      }

      const userId = usersResponse.data[0].user_id;

      // Remove admin role
      await axios.delete(`https://${AUTH0_DOMAIN}/api/v2/users/${userId}/roles`, {
        data: { roles: ['ROLE_ID'] }, // Replace with your actual admin role ID
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchAdmins(); // Refresh admin list
      setError('');
    } catch (error) {
      console.error('Error removing admin:', error);
      setError('Failed to remove admin');
    }
  };

  // Permission check and initial load
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const token = await getAccessTokenSilently();
        const decodedToken = jwtDecode(token);
        const hasPermission = decodedToken.permissions?.includes("adminView");

        if (!hasPermission) {
          navigate("/unauthorized");
        } else {
          setIsAuthorized(true);
          await fetchAdmins();
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        navigate("/unauthorized");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) checkPermissions();
  }, [isAuthenticated, getAccessTokenSilently, navigate]);

  if (!isAuthenticated || isLoading || !isAuthorized || loading) {
    return null;
  }

  return (
    <div className="edit-database-container">
      <div className="admin-management">
        <h2 className="section-title">Admin Management</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="admin-controls">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter admin email"
            className="email-input"
          />
          <button 
            className="admin-button"
            onClick={() => addAdmin(emailInput)}
          >
            Add Admin
          </button>
        </div>

        <div className="admin-list">
          {admins.map(admin => (
            <div key={admin.user_id} className="admin-item">
              {admin.email}
              <button 
                className="remove-button"
                onClick={() => removeAdmin(admin.email)}
              >
                Remove Admin
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="user-management">
        <h2 className="section-title">Registered Users</h2>
        {/* Add regular user management here if needed */}
      </div>
    </div>
  );
};

export default EditUsers;