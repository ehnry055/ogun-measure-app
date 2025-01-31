"use client";

import 'bootstrap/dist/css/bootstrap.css';

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import '../styles/global.css';

function index() {

  return (
      <div className="appContainer">
        <Navbar />
        <div className="mainLayout">
          <Sidebar />
        </div>
      </div>
  );
};

export default index;
