import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import HighchartsMap from 'highcharts/modules/map';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './components/login';
import LogoutButton from './components/logout';
import Profile from './components/profile';

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import EditDatabasePage from "./pages/EditDatabasePage";
import DataPage from "./pages/DataPage";
import ProfilePage from "./pages/ProfilePage";
import EditUsers from "./pages/EditUsers";
import UnAuthorized from './pages/UnAuthorized';

import './styles/App.css';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import RequestsPage from './pages/RequestsPage';
import ViewDatabasePage from './pages/ViewDatabasePage';
import ItemDevelopers from './pages/ItemDevelopers';
import RSG from './facets/rsg';
import PO from './facets/po'
import SV from './pages/sv';
import OgunMeasure from './pages/OgunMeasure'
import Gateway from './pages/Gateway';


function App() {

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-layout">
          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/viewdata" element={<PrivateRoute Component = {ViewDatabasePage} />} />
              <Route path="/editdata" element={<PrivateRoute Component = {EditDatabasePage} />} />
              <Route path="/graphs" element={<PrivateRoute Component = {DataPage} />} />
              <Route path="/users" element={<PrivateRoute Component= {EditUsers} />} />
              <Route path="/profile" element={<PrivateRoute Component = {ProfilePage} />} />
              <Route path="/requests" element={<PrivateRoute Component = {RequestsPage} />} />
              <Route path="/itemdevelopers" element={<ItemDevelopers />} />
              <Route path="/rsg" element={<RSG />} />
              <Route path="/po" element={<PO />} />
              <Route path="/sv" element={<SV />} />
              <Route path="/ogun" element={<PrivateRoute Component = {OgunMeasure} />} />
              <Route path="/gateway" element={<Gateway/>} />
              <Route path="/unauthorized" element={<UnAuthorized />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
