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
        console.log("API Response: userData", {
          type: typeof response.data,
          data: response.data,
          isArray: Array.isArray(response.data)
        });
        console.log("User Data:", dataArray);


        const users = dataArray[0];

        console.log("Users:", users);
        console.log("API Response: Users", {
          type: typeof users,
          data: users,
          isArray: Array.isArray(users)
        });

        // Extract specific fields from large objects
        
        const results = [];
        for (const user of users) {
          const roles = await axios.get('/api/admin/get-user-roles', {
            params: {
              userId: user.userId
            },
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          results.push({
            name: user?.name,
            email: user?.email || 'No email',
            lastLogged: user?.last_login,
            verified: user.email_verified !== undefined ? user.email_verified : null,
            roles: roles
          })
        }
        
        for (const user of results) {

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
    <>
      {/* Bootstrap CDN */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      
      {/* Custom Dark Theme Styles */}
      <style>{`
        :root {
          --bs-primary: #8C68CD;
          --bs-primary-rgb: 140, 104, 205;
        }
        
        body {
          background-color: #0a0a0a !important;
          color: #ffffff !important;
        }
        
        .bg-dark-custom {
          background-color: #1a1a1a !important;
        }
        
        .bg-dark-secondary {
          background-color: #252525 !important;
        }
        
        .border-purple {
          border-color: #8C68CD !important;
        }
        
        .text-purple {
          color: #8C68CD !important;
        }
        
        .bg-purple-light {
          background-color: rgba(140, 104, 205, 0.15) !important;
        }
        
        .bg-purple-transparent {
          background-color: #8C68CD26 !important;
        }
        
        .table-dark-custom {
          --bs-table-bg: #1a1a1a;
          --bs-table-striped-bg: #252525;
          --bs-table-hover-bg: rgba(140, 104, 205, 0.15);
          --bs-table-border-color: #333;
        }
        
        .table-dark-custom thead th {
          background-color: rgba(140, 104, 205, 0.15) !important;
          border-bottom: 2px solid #8C68CD !important;
          color: #ffffff !important;
        }
        
        .table-dark-custom tbody tr:hover {
          transform: translateX(4px);
          transition: all 0.2s ease;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          background-color: #8C68CD;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 500;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
        }
        
        .status-active {
          background-color: #8C68CD;
        }
        
        .status-inactive {
          background-color: #666;
        }
        
        .card-dark {
          background-color: #1a1a1a !important;
          border-color: rgba(140, 104, 205, 0.15) !important;
          box-shadow: 0 4px 6px rgba(140, 104, 205, 0.1) !important;
        }
        
        .card-dark .card-body {
          color: #ffffff;
        }
        
        .badge-verified {
          background-color: rgba(140, 104, 205, 0.15) !important;
          color: #8C68CD !important;
          border: 1px solid #8C68CD !important;
        }
        
        .badge-unverified {
          background-color: rgba(220, 53, 69, 0.15) !important;
          color: #dc3545 !important;
          border: 1px solid #dc3545 !important;
        }
        
        .text-muted-custom {
          color: #9ca3af !important;
        }
        
        .shadow-purple {
          box-shadow: 0 0.5rem 1rem rgba(140, 104, 205, 0.15) !important;
        }
      `}</style>

      <div className="container-fluid py-4" style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
        <div className="container">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="display-4 fw-bold text-white mb-2">User Management</h1>
              <p className="text-muted-custom">Parsed from large object arrays - showing only essential data</p>
            </div>
          </div>

          {/* Main Table */}
          <div className="row">
            <div className="col-12">
              <div className="card card-dark shadow-purple">
                <div className="card-header bg-purple-transparent border-purple">
                  <h5 className="card-title mb-0 text-white">User Directory</h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-striped table-hover table-dark-custom mb-0">
                      <thead>
                        <tr>
                          <th scope="col" className="px-4 py-3">Name</th>
                          <th scope="col" className="px-4 py-3">Email</th>
                          <th scope="col" className="px-4 py-3">Last Active</th>
                          <th scope="col" className="px-4 py-3">Verified</th>
                        </tr>
                      </thead>
                      <tbody>
                        {processedData.map((user, rowIndex) => (
                          <tr key={rowIndex}>
                            {/* Name Column */}
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center">
                                <div className="user-avatar me-3">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="fw-medium text-white">{user.name}</div>
                                </div>
                              </div>
                            </td>

                            {/* Email Column */}
                            <td className="px-4 py-3">
                              <span className="text-light">{user.email}</span>
                            </td>

                            {/* Last Active Column */}
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center">
                                <span 
                                  className={`status-dot ${
                                    user.lastLogged && (new Date() - user.lastLogged) < 86400000 
                                      ? 'status-active' 
                                      : 'status-inactive'
                                  }`}
                                ></span>
                                <span className="text-light">{user.lastLogged}</span>
                              </div>
                            </td>

                            {/* Verified Column */}
                            <td className="px-4 py-3">
                              {user.verified !== null ? (
                                <span 
                                  className={`badge ${
                                    user.verified ? 'badge-verified' : 'badge-unverified'
                                  }`}
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {user.verified ? 'Verified' : 'Unverified'}
                                </span>
                              ) : (
                                <span className="text-muted-custom small">Unknown</span>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUsers;