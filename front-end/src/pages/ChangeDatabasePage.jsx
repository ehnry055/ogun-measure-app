import React, { useState, useEffect } from 'react';
import '../styles/DownloadDatabasePage.css';
import NotesList from '../components/NotesList';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const ChangeDatabasePage = () => {
  const [entryLimit, setEntryLimit] = useState(20); // default: 20 entries
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableName, setTableName] = useState();

  const [stateFilter, setStateFilter] = useState('');
  
  const [presets, setPresets] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(new Set());
  const [selectedPreset, setSelectedPreset] = useState(null);

  //AdminRole check
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(() => {
    const initialState = false;
    return initialState;
  });

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log("Access token:", token); // Log the token for debugging
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);

        const hasPermission = decodedToken.permissions && decodedToken.permissions.includes("adminView");
        console.log("Has permission:", hasPermission);

        if (!hasPermission) {
          console.log("User does not have the required permission");
          navigate("/unauthorized");
        }
        else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        navigate("/unauthorized");
      }
    };

    checkPermissions();
  }, [isAuthenticated, getAccessTokenSilently, navigate]);
  
  useEffect(() => {
    const savedPresets = localStorage.getItem('columnPresets');
    if (savedPresets) setPresets(JSON.parse(savedPresets));
  }, []);

  const handleSavePreset = () => {
    const presetName = prompt('Enter preset name:');
    if (!presetName) return;
  
    const currentSelection = Array.from(selectedColumns);
    
    const newPreset = {
      name: presetName,
      columns: currentSelection
    };
  
    // update presets state and localStorage
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem('columnPresets', JSON.stringify(updatedPresets));
  };  

  if(!isAuthenticated || isLoading || !isAuthorized) {
    console.log(!isAuthenticated);
    console.log(isLoading);
    console.log(!isAuthorized);
    return null;
  }

  const applyPreset = (preset) => {
    if (selectedPreset === preset.name) {
      setSelectedColumns(new Set());
      setSelectedPreset(null);
    } else {
      const presetColumns = new Set(preset.columns);
      setSelectedColumns(presetColumns);
      setSelectedPreset(preset.name);
    }
  };
    
  const deletePreset = (presetName) => {
    const updated = presets.filter(p => p.name !== presetName);
    setPresets(updated);
    localStorage.setItem('columnPresets', JSON.stringify(updated));
  };
  
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
      await axios.post(`/api/upload`, formData, {
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
    
  const handleDownload = async () => {
    try {
      let token = await getAccessTokenSilently();
      
      // get the columns array
      const selectedColumnsArray = Array.from(selectedColumns);
      
      // URL params only if columns are selected
      const params = new URLSearchParams();
      if (selectedColumnsArray.length > 0) {
        params.append('columns', selectedColumnsArray.join(','));
      }

      let response = await axios.get(`/api/export-csv${params.toString() ? `?${params}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'text'
      });

      let blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      let url = URL.createObjectURL(blob);
      let link = document.createElement('a');
      link.href = url;
      link.download = 'data.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('CSV download failed.');
    }
  };

  // get a list of existing tables and let the user select one
  const handleSelectTable = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`/api/tables`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const tableNames = response.data; // an array of table names
      const message = `Select a table from the following:\n-------------------------\n${tableNames.join('\n')}`;
      const selected = window.prompt(message);
      if (!selected) return;
      if (!tableNames.includes(selected)) {
        alert("Invalid table name selected.");
        return;
      }

      // change the dynamic table on the server side
      await axios.post(`/api/select-table`, { tableName: selected }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTableName(selected);
      alert(`Current table set to ${selected}`);
    } catch (error) {
      console.error('Error selecting table:', error);
      alert('Error selecting table');
    }
  }

  const handleDeleteTable = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`/api/tables`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const tableNames = response.data;
      const tableToDelete = window.prompt(`Enter the table name to delete:\n-------------------------\n${tableNames.join('\n')}`);
      if (!tableToDelete) return;  
  
      await axios.post(`/api/delete-table`, 
        { tableName: tableToDelete },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Table ${tableToDelete} deleted successfully.`);
      // if the current dynamic table is the one deleted, revert to default.
      if (tableName === tableToDelete) setTableName("Select a table to view");
    } catch (error) {
      console.error('Error deleting table:', error);
      alert('Cannot delete this table.');
    }
  };
  

  console.log("Authorized!");
  return (
    <div className="page-layout-container">
      <div className="left-section">
        <div className="entry-limit-container">
          <label htmlFor="entryLimitInput">Entries to display:</label>
          <input
            id="entryLimitInput"
            type="number"
            min="1"
            value={entryLimit}
            onChange={handleEntryLimitChange}
            className="limit-input"
          />
        </div>

        <div className="state-filter-container">
          <label htmlFor="stateFilter">Filter by State:</label>
          <input
            id="stateFilter"
            type="text"
            placeholder="Enter state name"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          />
        </div>

        <div className="preset-controls">
          <button 
            className="preset-button save-preset"
            onClick={handleSavePreset}
          >
            Save Preset
          </button>

          {presets.length > 0 && <h3 className="presets-title">Saved Presets:</h3>}
          {presets.map(preset => (
            <div key={preset.name} className="preset-item">
              <button
                className={`preset-button ${
                  selectedPreset === preset.name ? 'active' : ''
                }`}
                onClick={() => applyPreset(preset)}
              >
                {preset.name}
              </button>
              <button 
                className="delete-preset"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePreset(preset.name);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="middle-data-section">
        <div className="data-section">
          <div className="data-item">
            <h2>
              {tableName || "Select a table to view"}
            </h2>
            <div className = 'table-container'>
              <NotesList 
                key={tableName}
                limit={entryLimit}
                selectedColumns={selectedColumns}
                onToggleColumn={(column) => setSelectedColumns(prev => {
                  const newSet = new Set(prev);
                  newSet.has(column) ? newSet.delete(column) : newSet.add(column);
                  return newSet;
                })}
                currentTableName={tableName}
                stateFilter={stateFilter}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="control-section">
        <h2 className="section-title">Database Controls</h2>
        <div className="controls">
          <input className="inputcsv" type="file" accept=".csv" onChange={(e) => setSelectedFile(e.target.files[0])}/>
          <button className="upload-button" onClick={handleFileUpload}> Upload to Database </button>
          <button className="download-button" onClick={handleDownload}> Download as CSV </button>
          <button className="select-button" onClick={handleSelectTable}> Select Table </button>
          <button className="delete-table-button" onClick={handleDeleteTable}> Delete Table </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeDatabasePage;