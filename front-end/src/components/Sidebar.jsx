import React from 'react';
import '../styles/Sidebar.css'; 

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        <a href="#" className="sidebar-link">User Type</a>
        <a href="#" className="sidebar-link">Profile</a>
        <a href="#" className="sidebar-link">Settings</a>
        <a href="/edit-database" className="sidebar-link">Edit Database</a>
        <a href="#" className="sidebar-link">Edit Users</a>
        <a href="#" className="sidebar-link">Log Out</a>
      </nav>
    </div>
  );
};

export default Sidebar;
