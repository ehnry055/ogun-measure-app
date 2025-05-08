import React, { useState, useEffect } from 'react';
import '../styles/EditDatabasePage.css'; 
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const EditUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  // Permission check
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
          loadAdmins(); // Load admins after authorization
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        navigate("/unauthorized");
      }
    };

    if (isAuthenticated) checkPermissions();
  }, [isAuthenticated, getAccessTokenSilently, navigate]);

  // Load admins
  const loadAdmins = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get('/api/admins', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(response.data);
    } catch (error) {
      console.error('Failed to load admins:', error);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.match(/^\S+@\S+\.\S+$/)) {
      alert('Please enter a valid email');
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      await axios.post('/api/admins', { email: newAdminEmail }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins([...admins, newAdminEmail]);
      setNewAdminEmail('');
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Failed to add admin');
    }
  };

  const handleRemoveAdmin = async (email) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`/api/admins/${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(admins.filter(e => e !== email));
    } catch (error) {
      console.error('Error removing admin:', error);
      alert('Failed to remove admin');
    }
  };

  if (!isAuthenticated || isLoading || !isAuthorized) {
    return null;
  }

  return (
    <div className="edit-database-container">
      <div className="admin-management">
        <h2 className="section-title">Admin Management</h2>
        <div className="admin-controls">
          <input
            type="email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="Enter admin email"
            className="email-input"
          />
          <button 
            className="admin-button"
            onClick={handleAddAdmin}
          >
            Add Admin
          </button>
        </div>
        <div className="admin-list">
          {admins.map(email => (
            <div key={email} className="admin-item">
              {email}w
              <button 
                className="remove-button"
                onClick={() => handleRemoveAdmin(email)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="user-management">
        <h2 className="section-title">Registered Users</h2>
      </div>
    </div>
  );
};

export default EditUsers;