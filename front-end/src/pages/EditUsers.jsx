import React, { useState, useEffect } from 'react';
import '../styles/DownloadDatabasePage.css'; 
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const EditUsers = () => {
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);

  // Admin role check
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const token = await getAccessTokenSilently();
        const decodedToken = jwtDecode(token);
        const hasPermission = decodedToken.permissions && 
                            decodedToken.permissions.includes("adminView");

        if (!hasPermission) {
          navigate("/unauthorized");
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        navigate("/unauthorized");
      }
    };

    if (isAuthenticated) {
      checkPermissions();
    }
  }, [isAuthenticated, getAccessTokenSilently, navigate]);

  // Fetch users from auth0
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/get-users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, getAccessTokenSilently]);

  if (!isAuthenticated || isLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="user-list-container">
      <h1>User Management</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>User ID</th>
            <th>Last Login</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.name || 'N/A'}</td>
              <td>{user.email}</td>
              <td className="user-id">{user.user_id}</td>
              <td>
                {user.last_login ? 
                  new Date(user.last_login).toLocaleString() : 
                  'Never logged in'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditUsers;