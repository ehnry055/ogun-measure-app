import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useState } from 'react';
import '../styles/LoginLogout.css'; 


const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    !isAuthenticated && (
      <button 
      className="btn btn-primary" 
      onClick={() => loginWithRedirect({ appState: { returnTo: window.location.pathname + window.location.search } })}>
        Log In</button>
    )
  )
};

export default LoginButton;