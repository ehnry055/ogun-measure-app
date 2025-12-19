import React, { useState, useEffect } from 'react';
import '../styles/DownloadDatabasePage.css';
import NotesList from '../components/NotesList';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import InfoPopup from '../components/InfoPopup';

let webRInstance = null;

const ViewDatabasePage = () => {
  const { isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const [entryLimit, setEntryLimit] = useState(20);
  const [tableName, setTableName] = useState("Default Table");
  const [stateFilter, setStateFilter] = useState('');
  const [presets, setPresets] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(new Set());
  const [selectedPreset, setSelectedPreset] = useState(null);
  
  // R Analysis State
  const [rReady, setRReady] = useState(false);
  const [rLoading, setRLoading] = useState(false);
  const [rResult, setRResult] = useState(null);
  const [rError, setRError] = useState(null);

  // New R Shell State: Array of objects for dynamic inputs
  const [shellRows, setShellRows] = useState([
    { label: 'Mean', code: 'mean(vals)' },
    { label: 'SD', code: 'sd(vals)' }
  ]);

  useEffect(() => {
    const savedPresets = localStorage.getItem('columnPresets');
    if (savedPresets) setPresets(JSON.parse(savedPresets));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!window.WebR) return;
        const instance = new window.WebR();
        await instance.init();
        if (!cancelled) {
          webRInstance = instance;
          setRReady(true);
        }
      } catch (e) {
        console.error("webR: failed to init", e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Functions to handle shell row changes
  const addShellRow = () => setShellRows([...shellRows, { label: '', code: '' }]);
  
  const updateShellRow = (index, field, value) => {
    const newRows = [...shellRows];
    newRows[index][field] = value;
    setShellRows(newRows);
  };

  const removeShellRow = (index) => {
    setShellRows(shellRows.filter((_, i) => i !== index));
  };

  const handleRunRAnalysis = async () => {
    if (!rReady || !webRInstance) return;
    setRLoading(true);
    setRResult(null);
    setRError(null);

    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get(`/api/sample-column?limit=${entryLimit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { columnName, values } = res.data || {};
      if (!values || values.length === 0) {
        alert("No numeric data returned from server.");
        setRLoading(false);
        return;
      }

      // 1. Build the dynamic R code string from shellRows state
      const listContent = shellRows
        .filter(row => row.label.trim() !== '' && row.code.trim() !== '')
        .map(row => `\`${row.label}\` = ${row.code}`)
        .join(', ');

      if (!listContent) {
        alert("Please add at least one analysis variable.");
        setRLoading(false);
        return;
      }

      const rCode = `
        vals <- as.numeric(vals)
        list(
          ${listContent}
        )
      `;

      // 2. Execute in R
      const rObj = await webRInstance.evalR(rCode, { env: { vals: values } });
      const js = await rObj.toJs();

      // 3. Parse result dynamically
      const names = js.names || [];
      const outVals = js.values || [];
      const flattened = {};
      
      names.forEach((name, idx) => {
        const v = outVals[idx];
        if (v && Array.isArray(v.values)) {
          flattened[name] = v.values[0];
        }
      });

      setRResult({
        stats: flattened,
        columnName,
        count: values.length
      });
    } catch (e) {
      console.error("R analysis error", e);
      setRError(e.message);
    } finally {
      setRLoading(false);
    }
  };

  // Rest of your existing preset/table functions...
  const handleSavePreset = () => {
    const presetName = prompt('Enter preset name:');
    if (!presetName) return;
    const newPreset = { name: presetName, columns: Array.from(selectedColumns) };
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem('columnPresets', JSON.stringify(updatedPresets));
  };

  const applyPreset = (preset) => {
    if (selectedPreset === preset.name) {
      setSelectedColumns(new Set());
      setSelectedPreset(null);
    } else {
      setSelectedColumns(new Set(preset.columns));
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
    setEntryLimit(!isNaN(value) && value >= 1 ? value : 1);
  };

  const handleDownload = async () => { /* ... existing download code ... */ };
  const handleDownloadExcel = async () => { /* ... existing download code ... */ };
  const handleSelectTable = async () => { /* ... existing select code ... */ };

  return (
    <div className="page-layout-container">
      <div className="left-section">
        <div className="entry-limit-container">
          <label htmlFor="entryLimitInput" style={{ color: '#8C68CD'}}>Entries to display:</label>
          <input id="entryLimitInput" type="number" min="1" value={entryLimit} onChange={handleEntryLimitChange} className="limit-input" />
        </div>

        <div className="state-filter-container">
          <label htmlFor="stateFilter">Filter by State:</label>
          <input id="stateFilter" type="text" placeholder="Enter state name" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} />
        </div>

        <div className="preset-controls">
          <button className="preset-button save-preset" onClick={handleSavePreset}>Save Preset</button>
          {presets.length > 0 && <h3 className="presets-title">Saved Presets:</h3>}
          {presets.map(preset => (
            <div key={preset.name} className="preset-item">
              <button className={`preset-button ${selectedPreset === preset.name ? 'active' : ''}`} onClick={() => applyPreset(preset)}>{preset.name}</button>
              <button className="delete-preset" onClick={() => deletePreset(preset.name)}>×</button>
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
                <p style={{ textAlign: 'left' , margin: '0 20px', fontSize: '16px'}}>
                  Historical data info... (truncated for brevity)
                </p>
              </InfoPopup>
            </h2>
            <div className='table-container'>
              <NotesList 
                key={tableName} limit={entryLimit} selectedColumns={selectedColumns} 
                onToggleColumn={(col) => setSelectedColumns(prev => {
                  const n = new Set(prev); n.has(col) ? n.delete(col) : n.add(col); return n;
                })}
                currentTableName={tableName} stateFilter={stateFilter}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="control-section">
        <h2 className="section-title">Database Controls</h2>
        <div className="controls">
          <button className="download-button" onClick={handleDownload}> Download as CSV </button>
          <button className="download-button" onClick={handleDownloadExcel}> Download as XLSX </button>
          <button className="select-button" onClick={handleSelectTable}> Select Table </button>
          
          <hr style={{width: '100%', margin: '15px 0', border: '0.5px solid #ddd'}} />
          
          <h3 style={{fontSize: '1rem', color: '#8C68CD'}}>R Analysis Shell</h3>
          <p style={{fontSize: '0.7rem', marginBottom: '10px'}}>Use <b>vals</b> for the data vector</p>
          
          <div className="r-shell-container" style={{maxHeight: '200px', overflowY: 'auto', marginBottom: '10px'}}>
            {shellRows.map((row, index) => (
              <div key={index} style={{display: 'flex', gap: '5px', marginBottom: '5px'}}>
                <input 
                  placeholder="Label" style={{width: '35%'}} value={row.label}
                  onChange={(e) => updateShellRow(index, 'label', e.target.value)}
                />
                <input 
                  placeholder="R Code" style={{width: '55%'}} value={row.code}
                  onChange={(e) => updateShellRow(index, 'code', e.target.value)}
                />
                <button onClick={() => removeShellRow(index)} style={{background: 'none', border: 'none', color: 'red', cursor: 'pointer'}}>×</button>
              </div>
            ))}
          </div>
          
          <button className="select-button" style={{fontSize: '0.8rem', padding: '5px'}} onClick={addShellRow}>+ Add Row</button>

          <button
            className="download-button"
            onClick={handleRunRAnalysis}
            disabled={!rReady || rLoading}
            style={{marginTop: '10px'}}
          >
            {!rReady ? "Loading R..." : rLoading ? "Analyzing..." : "Run Analysis"}
          </button>

          {rError && <p style={{color: 'red', fontSize: '0.8rem'}}>{rError}</p>}

          {rResult && (
            <div className="r-result-box" style={{ marginTop: "1rem", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "5px", border: "1px solid #8C68CD" }}>
              <p style={{fontWeight: 'bold', fontSize: '0.8rem'}}>Results: {rResult.columnName}</p>
              {Object.entries(rResult.stats).map(([key, val]) => (
                <p key={key} style={{fontSize: '0.9rem', margin: '2px 0'}}>
                  {key}: <span style={{color: '#8C68CD'}}>{typeof val === 'number' ? val.toFixed(3) : val}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDatabasePage;