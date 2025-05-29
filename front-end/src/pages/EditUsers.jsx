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
  const getAllKeys = (array) => {
    const keys = new Set();
    array.forEach(obj => {
      Object.keys(obj).forEach(key => keys.add(key));
    });
    return Array.from(keys);
  };

  // Format cell value for display
  const formatCellValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  // Capitalize first letter of header
  const formatHeader = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const headers = getAllKeys(users);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Object Array Parser</h1>
        
        {/* Table Container */}
        <div className="rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid #8C68CD' }}>
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#8C68CD26' }}>
                  {headers.map((header, index) => (
                    <th 
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider border-r border-gray-700 last:border-r-0"
                      style={{ 
                        backgroundColor: index % 2 === 0 ? '#8C68CD26' : 'rgba(140, 104, 205, 0.1)',
                        borderBottom: '2px solid #8C68CD'
                      }}
                    >
                      {formatHeader(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((item, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    className="transition-all duration-200 hover:shadow-lg"
                    style={{ 
                      backgroundColor: rowIndex % 2 === 0 ? '#1f1f1f' : '#252525',
                      borderBottom: '1px solid #333'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#8C68CD26';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = rowIndex % 2 === 0 ? '#1f1f1f' : '#252525';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {headers.map((header, cellIndex) => (
                      <td 
                        key={`${rowIndex}-${header}`}
                        className="px-6 py-4 text-sm text-gray-200 border-r border-gray-700 last:border-r-0"
                      >
                        <div className="flex items-center">
                          {header === 'status' && item[header] ? (
                            <div className="flex items-center">
                              <div 
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ 
                                  backgroundColor: item[header] === 'Active' ? '#8C68CD' : '#666' 
                                }}
                              />
                              <span>{formatCellValue(item[header])}</span>
                            </div>
                          ) : (
                            <span>{formatCellValue(item[header])}</span>
                          )}
                        </div>
                      </td>
                    ))}
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