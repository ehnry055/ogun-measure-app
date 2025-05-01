import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import UnAuthorized from '../pages/UnAuthorized';


const PrivateRoute = ({Component}) => {
    const { isAuthenticated, error, isLoading } = useAuth0();
    console.log("Privaterouting");
    if (isLoading) {
      console.log("loading...");
      return null;
    }
    if (!isAuthenticated && !isLoading) {
      
      return <UnAuthorized />;
    }
    return (
        <Component />
    );
  }

  export default PrivateRoute;