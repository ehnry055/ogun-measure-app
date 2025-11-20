import React, { useState, useEffect } from 'react';
import '../styles/DownloadDatabasePage.css';
import NotesList from '../components/NotesList';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import InfoPopup from '../components/InfoPopup';
import { Info } from 'lucide-react';

const ViewDatabasePage = () => {
  const { isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const [entryLimit, setEntryLimit] = useState(20); // default: 20 entries
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableName, setTableName] = useState("Default Table");

  const [stateFilter, setStateFilter] = useState('');
  
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

  const handleDownloadExcel = async () => {
  try {
    let token = await getAccessTokenSilently();

    const selectedColumnsArray = Array.from(selectedColumns);

    const params = new URLSearchParams();
    if (selectedColumnsArray.length > 0) {
      params.append('columns', selectedColumnsArray.join(','));
    }

    let response = await axios.get(`/api/export-excel${params.toString() ? `?${params}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'  // important!
    });

    let blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.download = 'data.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Excel download failed:', error);
    alert('Excel download failed.');
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

  console.log("Authorized!");
  return (
    <div className="page-layout-container">
      <div className="left-section">
        <div className="entry-limit-container">
          <label htmlFor="entryLimitInput" style={{ color: '#8C68CD'}}>Entries to display:</label>
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
              <InfoPopup>
              <h2 style={{ color: '#8C68CD'}}>View Data </h2>
              <p style={{ textAlign: 'left' , margin: '0 20px', fontSize: '22px'}}>
              This is the data collected on counties across the US.
                <br />
                <br />
                Each column represents a different combination of a facet, pathway, and time period.
<br /><br />10 facets: 
<br />Residential Segregation and Gentrification (RSG)
<br />Property Ownership (PO)
<br />Government Representation (GR)
<br />Policing and Incarceration (PI)
<br />Income and Poverty (IP)
<br />Occupational Segregation and Unemployment (OSU)
<br />Healthcare Access (HCA)
<br />Healthy Food Access (HFA)
<br />Environmental Pollution (EP)
<br />Media and Marketing (MM)

<br /><br />2 pathways:<br />
Structural Violence (SV)<br />
Limited or Restricted Access (LRA)<br /><br />

3 historical periods:<br />
Before the Civil Rights Act of 1968 that included the Fair Housing Act legally ending residential segregation (Time Period 1)<br />
During Desegregation or Integration (1969-1999) (Time Period 2)<br />
Modern Times (2000-present) (Time Period 3)<br />

              </p>
              </InfoPopup>
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
          <button className="download-button" onClick={handleDownload} width="85%"> Download as CSV </button>
          <button className="downloadExcel-button" onClick={handleDownloadExcel} width="85%"> Download as XLSX </button>
          <button className="select-button" onClick={handleSelectTable} width="85%"> Select Table </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDatabasePage;