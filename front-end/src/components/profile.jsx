import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from 'react';
import React from "react";

const profile = () => {
  console.log("test");
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [permissions, setPermissions] = useState([]);

  useEffect( () => { 
    const getPermissions = async () => {
        try {
            const token = await getAccessTokenSilently();
            const decoded = jwtDecode(token);
            const perms = decoded.permissions;
            setPermissions(perms);
        } catch {
            console.error(error);
        }
    }
    if(isAuthernticated) {
        getPermissions();
    }

  }, [isAuthenticated, getAccessTokenSilently]);

  
  return (
    isAuthenticated && (
      <article className="column">
        {user?.picture && <img src={user.picture} alt={user?.name} />}
        <h2>{user?.name}</h2>
        <h1>Access Level: </h1>
        <ul>
          {permissions.map((perm, index) => (
            <li key={index}>{perm}</li>
          ))}
        </ul>

      </article>
    )
    
  );
};

export default profile;