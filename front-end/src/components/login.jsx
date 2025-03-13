import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import '../styles/LoginLogout.css'; 


const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    !isAuthenticated && (
      <button className="btn btn-primary" onClick={() => loginWithRedirect()}>Log In</button>
    )
  )
};

export default LoginButton;