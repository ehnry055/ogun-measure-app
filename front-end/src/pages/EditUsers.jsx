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
        console.log("API Response: userData", {
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
  
  const users = userData[0];

  console.log("Users:", users);
  console.log("API Response: Users", {
    type: typeof users,
    data: users,
    isArray: Array.isArray(users)
  });


  // Extract specific fields from large objects
  const extractUserData = (users) => {
    return users.map(user => ({
      name: user.name,
      email: user.email || 'No email',
      lastLogged: user.last_login,
      verified: user.email_verified !== undefined ? user.email_verified : null
    }));
  };

  const processedData = extractUserData(users);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Parsed from large object arrays - showing only essential data</p>
        </div>
        
        {/* Main Table */}
        <div className="rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid #8C68CD' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#8C68CD26' }}>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider"
                    style={{ borderBottom: '2px solid #8C68CD' }}
                  >
                    Name
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider border-l border-gray-700"
                    style={{ borderBottom: '2px solid #8C68CD' }}
                  >
                    Email
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider border-l border-gray-700"
                    style={{ borderBottom: '2px solid #8C68CD' }}
                  >
                    Last Active
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider border-l border-gray-700"
                    style={{ borderBottom: '2px solid #8C68CD' }}
                  >
                    Verified
                  </th>
                </tr>
              </thead>
              <tbody>
                {processedData.map((user, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    className="transition-all duration-200"
                    style={{ 
                      backgroundColor: rowIndex % 2 === 0 ? '#1f1f1f' : '#252525',
                      borderBottom: '1px solid #333'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#8C68CD26';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = rowIndex % 2 === 0 ? '#1f1f1f' : '#252525';
                      e.currentTarget.style.transform = 'translateX(0px)';
                    }}
                  >
                    {/* Name Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3"
                          style={{ backgroundColor: '#8C68CD', color: 'white' }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{user.name}</div>
                        </div>
                      </div>
                    </td>

                    {/* Email Column */}
                    <td className="px-6 py-4 border-l border-gray-700">
                      <div className="text-sm text-gray-200">{user.email}</div>
                    </td>

                    {/* Last Active Column */}
                    <td className="px-6 py-4 border-l border-gray-700">
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ 
                            backgroundColor: user.lastLogged && (new Date() - user.lastLogged) < 86400000 ? '#8C68CD' : '#666'
                          }}
                        />
                        <span className="text-sm text-gray-200">{user.lastLogged}</span>
                      </div>
                    </td>

                    {/* Verified Column */}
                    <td className="px-6 py-4 border-l border-gray-700">
                      {user.verified !== null ? (
                        <span 
                          className="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                          style={{ 
                            backgroundColor: user.verified ? '#8C68CD26' : '#ff444426',
                            color: user.verified ? '#8C68CD' : '#ff6b6b',
                            border: `1px solid ${user.verified ? '#8C68CD' : '#ff4444'}`
                          }}
                        >
                          {user.verified ? 'Verified' : 'Unverified'}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">Unknown</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUsers;