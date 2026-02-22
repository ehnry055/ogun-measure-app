import React from 'react';
import { Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import ChangeDatabasePage from "./pages/ChangeDatabasePage";
import VisualizeDataPage from "./pages/VisualizeDataPage";
import ProfilePage from "./pages/ProfilePage";
import EditUsers from "./pages/EditUsers";
import UnAuthorized from './pages/UnAuthorized';
import MapPage from './pages/MapPage';
import RequestsPage from './pages/RequestsPage';
import ViewDatabasePage from './pages/ViewDatabasePage';
import ItemDevelopers from './pages/ItemDevelopers';
import OgunMeasure from './pages/OgunMeasure';
import Gateway from './pages/Gateway';
import AdminRequestsPage from './pages/AdminRequestsPage';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

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

import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <div className="main-layout">
        <div className="content">
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/gateway" element={<Gateway />} />
            <Route path="/unauthorized" element={<UnAuthorized />} />
            <Route path="/itemdevelopers" element={<ItemDevelopers />} />
            <Route path="/map" element={<MapPage />} />

            {/* Protected */}
            <Route
              path="/viewdata"
              element={
                <PrivateRoute
                  Component={ViewDatabasePage}
                  requiredPermissions={["registeredView", "adminView"]}
                />
              }
            />
            <Route path="/changedata" element={<PrivateRoute Component={ChangeDatabasePage} />} />
            <Route path="/graphs" element={<PrivateRoute Component={VisualizeDataPage} />} />
            <Route path="/profile" element={<PrivateRoute Component={ProfilePage} />} />
            <Route path="/requests" element={<PrivateRoute Component={RequestsPage} />} />
            <Route path="/ogun" element={<PrivateRoute Component={OgunMeasure} />} />

            {/* Admin */}
            <Route path="/users" element={<AdminRoute Component={EditUsers} />} />
            <Route path="/admin/requests" element={<AdminRoute Component={AdminRequestsPage} />} />

            {/* Facets */}
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
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
