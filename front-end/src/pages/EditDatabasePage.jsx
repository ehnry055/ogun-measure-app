import React, { useState } from 'react';
import '../styles/EditDatabasePage.css';
import NotesList from '../components/NotesList';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const EditDatabasePage = () => {
  const { isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [entryLimit, setEntryLimit] = useState(10); // default: 10 entries

  if (!isAuthenticated) {
    navigate("/unauthorized");
  }

  const handleEntryLimitChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setEntryLimit(value >= 1 ? value : 1); // value must be at least 1
    }
  };

  return (
    <div className="edit-database-container">
      <div className="entry-limit-container">
        <label>Entries to display:</label>
        <input
          type="number"
          min="1"
          value={entryLimit}
          onChange={handleEntryLimitChange}
          className="limit-input"
        />
      </div>

      <div className="data-section">
        <h2 className="section-title">Your Data</h2>
        <div className="data-item">
          <h3>Aggregated Data</h3>
          <NotesList limit={entryLimit} />
          <div className="action-buttons">
            <button className="delete-button">Delete</button>
            <button className="edit-button">Edit</button>
          </div>
        </div>
      </div>

      <div className="saved-section">
        <h2 className="section-title">Saved Graphs</h2>
        {[1].map((item, index) => (
          <div className="saved-graph" key={index}>
            <div className="pie-chart"></div>
            <h3>Pie Chart: AZ vs NJ</h3>
            <p>Saved on 1/2/23</p>
            <div className="action-buttons">
              <button className="delete-button">Download</button>
              <button className="edit-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditDatabasePage;