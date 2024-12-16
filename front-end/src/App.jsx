import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotesList from './components/NotesList';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import HighchartsMap from 'highcharts/modules/map';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './components/login';
import LogoutButton from './components/logout';
import Profile from './components/profile';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import EditDatabasePage from './pages/EditDatabasePage';
import DataPage from './pages/DataPage';

import './styles/App.css';

function App() {
  const { isLoading, error } = useAuth0();

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-layout">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/edit-database" element={<EditDatabasePage />} />
              <Route path="/data" element={<DataPage />} />
            </Routes>

            <div className="container">
              <NotesList />
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
