import React, { useState, useEffect } from 'react';
import '../styles/EditDatabasePage.css';
import NotesList from '../components/NotesList';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

const ViewDatabasePage = () => {
  const { isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const [entryLimit, setEntryLimit] = useState(10); // default: 10 entries
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableName, setTableName] = useState("Default Table");
  
  const [presets, setPresets] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(new Set());
  const [selectedPreset, setSelectedPreset] = useState(null);

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

  const handleExport = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`/api/export-csv`, {
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

  const handleDownload = async () => {
    try {
      let token = await getAccessTokenSilently();
  
      let response = await axios.get(`/api/export-csv`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'text'
      });
  
      // make a Blob from the text
      let blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
  
      // create a temporary link and click it
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
      const message = `Select a table from the following:\n${tableNames.join('\n')}`;
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
      alert(`Dynamic table set to ${selected}`);
    } catch (error) {
      console.error('Error selecting table:', error);
      alert('Error selecting table');
    }
  }

  

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

      <div className="preset-controls">
        <button 
          className="preset-button save-preset"
          onClick={handleSavePreset}
        >
          Save Preset
        </button>
        
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

      <div className="data-section">
        <h2 className="section-title">Your Data</h2>
        <div className="data-item">
          <h2>
            Selected Table: {tableName || "Default Table"}
          </h2>
            <NotesList 
              limit={entryLimit}
              selectedColumns={selectedColumns}
              onToggleColumn={(column) => setSelectedColumns(prev => {
                const newSet = new Set(prev);
                newSet.has(column) ? newSet.delete(column) : newSet.add(column);
                return newSet;
              })}
            />
        </div>
      </div>

      <div className="upload-section">
        <h2 className="section-title">Database Controls</h2>
        <div className="upload-controls">
          <button className="export-button" onClick={handleExport}> View as CSV </button>
          <button className="download-button" onClick={handleDownload}> Download as CSV </button>
          <button className="select-button" onClick={handleSelectTable}> Select Table </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDatabasePage;