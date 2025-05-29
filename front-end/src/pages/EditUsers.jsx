import React, { useState, useEffect } from 'react';
import '../styles/DownloadDatabasePage.css'; 
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const EditUsers = () => {
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState([]);

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
        const token = await getAccessTokenSilently();
        const response = await axios.get('/api/admin/get-users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.data
        const dataArray = Object.values(data);
        setUserData(dataArray);
        console.log("API Response:", {
          type: typeof response.data,
          data: response.data,
          isArray: Array.isArray(response.data)
      });
        console.log("User Data:", dataArray);
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
            <th>Last Login</th>
            <th>Email Verified</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.user_id || index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>user.name</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>{user.email || 'No email'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>{user.last_login}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.email_verified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {user.email_verified ? 'Verified' : 'Unverified'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditUsers;