import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { use } from 'react';
import Auth0ProviderComponent from './components/Auth0ProviderComponent';
import { BrowserRouter } from 'react-router-dom';



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Auth0ProviderComponent>
      <App />
    </Auth0ProviderComponent>
  </BrowserRouter>
);

reportWebVitals();
