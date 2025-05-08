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