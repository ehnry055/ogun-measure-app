import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = process.env.REACT_APP_AUTH0_domain;
const clientId = process.env.REACT_APP_AUTH0_clientId;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={
      {
        audience: "https://ogun-measure-app-4fceb75a4928.herokuapp.com/",
        redirect_uri: window.location.origin
      }
    }
    audience="https://ogun-measure-app-4fceb75a4928.herokuapp.com/"
    scope="openid profile email adminView"
  >
    <App />
  </Auth0Provider>
  
);

reportWebVitals();
