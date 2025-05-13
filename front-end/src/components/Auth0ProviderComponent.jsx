import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { use } from 'react';

const Auth0ProviderComponent = ({ children }) => {
    const domain = process.env.REACT_APP_AUTH0_domain;
    const clientId = process.env.REACT_APP_AUTH0_clientId;
    
    const navigate = useNavigate();
    
    const callback = (appState) => {
        navigate(appState?.returnTo || '/');
    };
    
    return (
        <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={
          {
            audience: "https://ogun-measure-app-4fceb75a4928.herokuapp.com/api",
            //"racism-data-system.com/api",
            redirect_uri: window.location.origin
            //"https://ogun-measure-app-4fceb75a4928.herokuapp.com/"
            
          }
        }
        audience= "https://ogun-measure-app-4fceb75a4928.herokuapp.com/api"
        //"racism-data-system.com/api"
        scope="openid profile email adminView"
        onRedirectCallback={callback}
        >
        {children}
        </Auth0Provider>
    );
    }
    
    export default Auth0ProviderComponent;