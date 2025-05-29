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
  const [processedData, setProcessedData] = useState([]);

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

        const users = dataArray[0];

        /*
        console.log("Users:", users);
        console.log("API Response: Users", {
          type: typeof users,
          data: users,
          isArray: Array.isArray(users)
        });
        */

        // Extract specific fields from large objects
        
        const results = [];
        for (const user of users) {
          const roles = await axios.get('/api/admin/get-user-roles', {
            params: {
              userId: user.user_id
            },
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const rolesList = Object.values(roles.data);
          console.log(rolesList);
          var roleName = {};
          if(rolesList[0].length === 0) {
            roleName = { name: 'guest_role' };
          }
          else {
            roleName = rolesList[0][0];
          }
          results.push({
            name: user?.name,
            email: user?.email || 'No email',
            lastLogged: user?.last_login,
            verified: user.email_verified !== undefined ? user.email_verified : null,
            userId: user?.user_id,
            roles: roleName.name
          })
        }
        setProcessedData(results);
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
  if(processedData == null || userData == null) {
    return null;
  }
  return (
      <div>
        <div>
          <h1 style={{textAlign: 'center', padding: '10px'}}>User Management</h1>
        </div>
        {/* Main Table */}
        
          <div style={{ borderRadius: '8px' }}>
            <table>
              <thead>
                <tr style={{ backgroundColor: '#2B2534'}}>
                  <th 
                    style={{ borderBottom: '2px solid #8C68CD' }}
                  >
                    Name
                  </th>
                  <th 
                    style={{ borderBottom: '2px solid #8C68CD' }}
                  >
                    Email
                  </th>
                  <th 
                    style={{ borderBottom: '2px solid #8C68CD' }}
                  >
                    Last Active
                  </th>
                  <th 
                    style={{ borderBottom: '2px solid #8C68CD' }}
                  >
                    Roles
                  </th>
                  <th 
                    style={{ borderBottom: '2px solid #8C68CD' }}
                  >
                    Verified
                  </th>
                  <th 
                    style={{ borderBottom: '2px solid #8C68CD' }}
                  >
                    Admin Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {processedData.map((user, rowIndex) => (
                  <tr 
                    key={rowIndex}
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
                    <td>
                      <div>
                        <div>
                          <div>{user.name}</div>
                        </div>
                      </div>
                    </td>

                    {/* Email Column */}
                    <td>
                      <div>{user.email}</div>
                    </td>

                    {/* Last Active Column */}
                    <td>
                      <div>
                        <div 
                          style={{ 
                            backgroundColor: user.lastLogged && (new Date() - user.lastLogged) < 86400000 ? '#8C68CD' : '#666'
                          }}
                        />
                        <span>{user.lastLogged}</span>
                      </div>
                    </td>
                    
                    <td>
                      <div>{user.roles}</div>
                    </td>

                    {/* Verified Column */}
                    <td>
                      {user.verified !== null ? (
                        <span 
                          style={{ 
                            backgroundColor: user.verified ? '#8C68CD26' : '#ff444426',
                            color: user.verified ? '#8C68CD' : '#ff6b6b',
                            border: `1px solid ${user.verified ? '#8C68CD' : '#ff4444'}`
                          }}
                        >
                          {user.verified ? 'Verified' : 'Unverified'}
                        </span>
                      ) : (
                        <span>Unknown</span>
                      )}
                    </td>
                    <td>
                    {user.roles === 'admin_role' ? (
                      <button
                        onClick={async () => {
                          try {
                            const response = await axios.get('/api/admin/remove-admin', {
                              params: { userId: user.userId }
                            });
                            alert('Success: ');
                          } catch (err) {
                            alert('Error: ' + (err.response?.data || err.message));
                          }
                        }}
                        style={{
                          background: '#8C68CD',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 10px',
                          cursor: 'pointer',
                          marginRight: '8px'
                        }}
                      >
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          try {
                            const response = await axios.get('/api/admin/assign-admin', {
                              params: { userId: user.userId }
                            });
                            alert('Success: ');
                          } catch (err) {
                            alert('Error: ' + (err.response?.data || err.message));
                          }
                        }}
                        style={{
                          background: '#8C68CD',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 10px',
                          cursor: 'pointer',
                          marginRight: '8px'
                        }}
                      >
                        Assign Admin
                      </button>
                    )}
                      <button
                        onClick={async () => {
                          try {
                            console.log('Deleting user:', user.userId);
                            const response = await axios.get('/api/admin/delete-user', {
                              params: { userId: user.userId }
                            });
                            alert('Success');
                          } catch (err) {
                            alert('Error: ' + (err.response?.data || err.message));
                          }
                        }}
                        style={{
                          background: '#8C68CD',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 10px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
        </div>
  );
};

export default EditUsers;