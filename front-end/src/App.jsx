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
import ChangeDatabasePage from "./pages/ChangeDatabasePage";
import VisualizeDataPage from "./pages/VisualizeDataPage";
import ProfilePage from "./pages/ProfilePage";
import EditUsers from "./pages/EditUsers";
import UnAuthorized from './pages/UnAuthorized';
import MapPage from './pages/MapPage';

import './styles/App.css';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import RequestsPage from './pages/RequestsPage';
import ViewDatabasePage from './pages/ViewDatabasePage';
import ItemDevelopers from './pages/ItemDevelopers';

import RSG from './facets/rsg';
import PO from './facets/po';
import GR from './facets/gr';
import PI from './facets/pi';
import IP from './facets/ip';
import OSU from './facets/osu';
import HA from './facets/ha';
import HFA from './facets/hfa';
import EP from './facets/ep';
import MM from './facets/mm';


import OgunMeasure from './pages/OgunMeasure';
import Gateway from './pages/Gateway';


function App() {

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-layout">
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/viewdata" element={<PrivateRoute Component = {ViewDatabasePage} />} />
            <Route path="/changedata" element={<PrivateRoute Component = {ChangeDatabasePage} />} />
            <Route path="/graphs" element={<PrivateRoute Component = {VisualizeDataPage} />} />
            <Route path="/users" element={<PrivateRoute Component= {EditUsers} />} />
            <Route path="/profile" element={<PrivateRoute Component = {ProfilePage} />} />
            <Route path="/requests" element={<PrivateRoute Component = {RequestsPage} />} />
            <Route path="/itemdevelopers" element={<ItemDevelopers />} />
            <Route path="/map" element={<MapPage />} />

            {/* Facet Routes */}
            <Route path="/ResidentialSegregationGentrification" element={<RSG />} />
            <Route path="/PropertyOrganization" element={<PO />} />
            <Route path="/GovernmentRepresentation" element={<GR />} />
            <Route path="/PolicingIncarceration" element={<PI />} />
            <Route path="/IncomePoverty" element={<IP />} />
            <Route path="/OccupationalSegregationUnemployment" element={<OSU />} />
            <Route path="/HealthcareAccess" element={<HA />} />
            <Route path="/HealthyFoodAccess" element={<HFA />} />
            <Route path="/EnvironmentalPollution" element={<EP />} />
            <Route path="/MediaMarketing" element={<MM />} />

            <Route path="/ogun" element={<PrivateRoute Component = {OgunMeasure} />} />
            <Route path="/gateway" element={<Gateway/>} />
            <Route path="/unauthorized" element={<UnAuthorized />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
