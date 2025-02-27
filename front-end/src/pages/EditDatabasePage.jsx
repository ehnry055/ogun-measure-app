import React, { useState } from 'react';
import '../styles/EditDatabasePage.css';
import NotesList from '../components/NotesList';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const EditDatabasePage = () => {
  const { isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [entryLimit, setEntryLimit] = useState(10); // default: 10 entries
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isAuthenticated) {
    navigate("/unauthorized");
  }

  const handleEntryLimitChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setEntryLimit(value >= 1 ? value : 1); // value must be at least 1
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('No file chosen');
      return;
    }
  
    const formData = new FormData();
    formData.append('csv', selectedFile);
  
    try {
      const token = await getAccessTokenSilently(); // checks if the session is valid
      await axios.post('http://localhost:4000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // can take any type of form
          Authorization: `Bearer ${token}` // passes the access token (added security)
        }
      });
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('File upload failed');
    }
  };

  const handleExport = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get('http://localhost:4000/api/export-csv', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'text'
      });
  
      const newWindow = window.open();
      newWindow.document.write(`<pre>${response.data}</pre>`);
      newWindow.document.title = 'CSV Preview';
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('CSV export failed. Possible reasons: empty data/incorrect format');
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
          <h3>Uploaded Data</h3>
          <NotesList limit={entryLimit} />
          <div className="action-buttons">
            <button className="delete-button">Delete</button>
            <button className="edit-button">Edit</button>
          </div>
        </div>
      </div>

      <div className="upload-section">
        <h2 className="section-title">Upload CSV</h2>
        <div className="upload-controls">
          <input type="file" accept=".csv" onChange={(e) => setSelectedFile(e.target.files[0])}/>
          <button className="upload-button" onClick={handleFileUpload}> Upload to Database </button>
          <button className="export-button" onClick={handleExport}> View as CSV </button>
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