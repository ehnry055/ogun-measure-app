import React from 'react';
import '../styles/DownloadDatabasePage.css'; 
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import Token from "../components/token"
import { useState, useEffect } from 'react';

const EditUsers = () => {

  //fetch users from auth0
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('/api/admin/get-users');

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [getAccessTokenSilently]);


  //AdminRole check
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(() => {
    const initialState = false;
    return initialState;
  });
  const [users, setUsers] = useState([]);
  
  const navigate = useNavigate();

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
          navigate("/unauthorized");
        }
        else {
          console.log("changed isAdmin to true");
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        navigate("/unauthorized");
      }
    };
    
    checkPermissions();
  }, [isAuthenticated, getAccessTokenSilently, navigate]);

//  const token = getAccessTokenSilently();
//  console.log(token);
//  const decodedToken = jwtDecode(token);
//  console.log(decodedToken);

//  const hasPermission = decodedToken.permissions && decodedToken.permissions.includes('adminView');

//  if (!hasPermission) {
//    navigate("/unauthorized");
//  }

  if(!isAuthenticated || isLoading || !isAdmin) {
    console.log('isAuthenticated ', !isAuthenticated);
    console.log('isLoading ', isLoading);
    console.log('isAdmin ', !isAdmin);
    return null;
  }
  
  console.log("Authorized!");


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