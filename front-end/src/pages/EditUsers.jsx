import React, { useState, useEffect } from 'react';
import '../styles/EditDatabasePage.css'; 
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const EditUsers = () => {
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const [isAuthorized, setisAuthorized] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const navigate = useNavigate();

  // 1. Permission check
  useEffect(() => {
    const checkPermissionsAndLoadAdmins = async () => {
      try {
        const token = await getAccessTokenSilently();
        const decoded = jwtDecode(token);
        const hasPermission = decoded.permissions && decoded.permissions.includes("adminView");

        if (!hasPermission) {
          navigate("/unauthorized");
          return;
        }

        setisAuthorized(true);

        const mgmtToken = await getAccessTokenSilently({
          audience: "https://dev-mqfq6kte0qw3b36u.us.auth0.com/api/v2/",
          scope: "read:users read:roles"
        });

        const roleRes = await fetch("https://dev-mqfq6kte0qw3b36u.us.auth0.com/api/v2/roles?name_filter=admin", {
          headers: { Authorization: `Bearer ${mgmtToken}` }
        });

        const roleData = await roleRes.json();
        console.log("ROLE DATA:", roleData);

        const usersRes = await fetch(`https://dev-mqfq6kte0qw3b36u.us.auth0.com/api/v2/roles/${adminRole.id}/users`, {
          headers: { Authorization: `Bearer ${mgmtToken}` }
        });
        const users = await usersRes.json();

        setAdmins(users.map(u => ({ email: u.email, user_id: u.user_id })));
      } catch (error) {
        console.error("Permission check or load failed:", error);
        navigate("/unauthorized");
      }
    };

    if (isAuthenticated && !isLoading) {
      checkPermissionsAndLoadAdmins();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently, navigate]);

  const getMgmtToken = () =>
    getAccessTokenSilently({
      audience: "https://dev-mqfq6kte0qw3b36u.us.auth0.com/api/v2/",
      scope: "update:users read:roles read:users"
    });

  // 2. Add admin by email
  const addAdmin = async () => {
    try {
      const token = await getMgmtToken();

      const userRes = await fetch(
        `https://dev-mqfq6kte0qw3b36u.us.auth0.com/api/v2/users-by-email?email=${emailInput}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const [user] = await userRes.json();
      if (!user) throw new Error("User not found");

      const roleRes = await fetch("https://dev-mqfq6kte0qw3b36u.us.auth0.com/api/v2/roles?name_filter=admin", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const [adminRole] = await roleRes.json();

      await fetch(`https://dev-mqfq6kte0qw3b36u.us.auth0.com/api/v2/users/${user.user_id}/roles`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ roles: [adminRole.id] })
      });

      setAdmins(a => [...a, { email: user.email, user_id: user.user_id }]);
      setEmailInput("");
    } catch (err) {
      alert("Failed to add admin: " + err.message);
    }
  };

  // 3. Remove admin
  const removeAdmin = async (user_id) => {
    try {
      const token = await getMgmtToken();

      const roleRes = await fetch("https://dev-mqfq6kte0qw3b36u.us.auth0.com/api/v2/roles?name_filter=admin", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const [adminRole] = await roleRes.json();

      await fetch(`https://dev-mqfq6kte0qw3b36u.us.auth0.com/api/v2/users/${user_id}/roles`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ roles: [adminRole.id] })
      });

      setAdmins(admins.filter(u => u.user_id !== user_id));
    } catch (err) {
      alert("Failed to remove admin: " + err.message);
    }
  };

  if (!isAuthenticated || isLoading || !isAuthorized) {
    return null;
  }

  return (
    <div className="edit-database-container">
      <div className="saved-section">
        <h2 className="section-title">Registered Admin Users</h2>
        <ul className="saved-users">
          {admins.map(user => (
            <li key={user.user_id}>
              {user.email}
              <button onClick={() => removeAdmin(user.user_id)}>Remove</button>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: "1em" }}>
          <input
            type="email"
            placeholder="Enter user email"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
          />
          <button onClick={addAdmin} disabled={!emailInput}>Add Admin</button>
        </div>
      </div>
    </div>
  );
};

export default EditUsers;