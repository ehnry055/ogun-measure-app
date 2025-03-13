import React, { useState, useEffect } from 'react';
import '../styles/EditDatabasePage.css';
import NotesList from '../components/NotesList';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const EditDatabasePage = () => {
  const { isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [entryLimit, setEntryLimit] = useState(10); // default: 10 entries
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableName, setTableName] = useState("Default Table");

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log("Access token:", token); // Log the token for debugging
        const decodedToken = jwtDecode(token);
        //console.log("Decoded token:", decodedToken);

        const hasPermission = decodedToken.permissions && decodedToken.permissions.includes("adminView");
        //console.log("Has permission:", hasPermission);

        if (!hasPermission) {
         // console.log("User does not have the required permission");
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        navigate("/unauthorized");
      }
    };

    checkPermissions();
  }, [isAuthenticated, getAccessTokenSilently, navigate]);

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

    // prompt for table name and store it in a local variable
    const newTableName = window.prompt("Enter the table name:");
    if (!newTableName) {
      alert("Table name is required.");
      return;
    }

    const formData = new FormData();
    formData.append('csv', selectedFile);
    formData.append('tableName', newTableName);

    try {
      const token = await getAccessTokenSilently(); // checks if the session is valid
      await axios.post('http://localhost:4000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // can take any type of form
          Authorization: `Bearer ${token}` // passes the access token (added security)
        }
      });
      alert(`File uploaded to ${newTableName} successfully`);
      // update the state so the UI reflects the new table name
      setTableName(newTableName);
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

  // get a list of existing tables and let the user select one
  const handleSelectTable = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get('http://localhost:4000/api/tables', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const tableNames = response.data; // an array of table names
      const message = `Select a table from the following:\n${tableNames.join('\n')}`;
      const selected = window.prompt(message);
      if (!selected) return;
      if (!tableNames.includes(selected)) {
        alert("Invalid table name selected.");
        return;
      }

      // change the dynamic table on the server side
      await axios.post('http://localhost:4000/api/select-table', { tableName: selected }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTableName(selected);
      alert(`Dynamic table set to ${selected}`);
    } catch (error) {
      console.error('Error selecting table:', error);
      alert('Error selecting table');
    }
  }

  const handleDeleteTable = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get('http://localhost:4000/api/tables', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const tableNames = response.data;
      const tableToDelete = window.prompt(`Enter the table name to delete:\n${tableNames.join('\n')}`);
      if (!tableToDelete) return;  
  
      await axios.post('http://localhost:4000/api/delete-table', 
        { tableName: tableToDelete },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Table ${tableToDelete} deleted successfully.`);
      // if the current dynamic table is the one deleted, revert to default.
      if (tableName === tableToDelete) setTableName("Default Table");
    } catch (error) {
      console.error('Error deleting table:', error);
      alert('Cannot delete this table.');
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
          <h2>
            Selected Table: {tableName || "Default Table"}
          </h2>
          <NotesList tableName={tableName} limit={entryLimit} />
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
          <button className="select-button" onClick={handleSelectTable}> Select Table </button>
          <button className="delete-table-button" onClick={handleDeleteTable}> Delete Table </button>
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