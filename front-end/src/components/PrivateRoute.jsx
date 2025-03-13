import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import UnAuthorized from '../pages/UnAuthorized';


const PrivateRoute = ({Component}) => {
    const { isAuthenticated } = useAuth0();
    if (!isAuthenticated) {
      return <UnAuthorized />;
    }
    return (
        <Component />
    );
  }

  export default PrivateRoute;