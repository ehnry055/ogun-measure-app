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
    if (selectedColumns.size === 0) {
      alert("Please select at least one column from the table first.");
      return;
    }

    setRLoading(true);
    setRResult(null);
    setRError(null);

    try {
      const token = await getAccessTokenSilently();
      const columnList = Array.from(selectedColumns);

      // 1. Fetch data for ALL selected columns
      const res = await axios.post('/api/analyze-columns', 
        { columns: columnList, limit: entryLimit },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allData = res.data; 
      const finalResults = {}; // Will store { "ColName": { stats }, ... }

      // 2. Prepare the R Shell script template
      const listContent = shellRows
        .filter(row => row.label.trim() !== '' && row.code.trim() !== '')
        .map(row => `\`${row.label}\` = ${row.code}`)
        .join(', ');

      // 3. Loop through each column and run the R analysis
      for (const colName of columnList) {
        const columnValues = allData[colName];

        try {
          const rCode = `
            vals <- as.numeric(c(${columnValues.join(',')}))
            # Check if we have any valid numeric data after conversion
            if(all(is.na(vals))) stop("Column contains no numeric data")
            
            list(${listContent})
          `;

          const rObj = await webRInstance.evalR(rCode);
          const js = await rObj.toJs();
          
          // Parse R list to JS object
          const stats = {};
          js.names.forEach((name, idx) => {
            const v = js.values[idx];
            if (v && v.values) stats[name] = v.values[0];
          });

          finalResults[colName] = { success: true, stats };
        } catch (colErr) {
          // If one column fails, mark it so we can show the error in UI
          finalResults[colName] = { success: false, error: "Non-numeric data" };
        }
      }

      setRResult(finalResults);
    } catch (e) {
      console.error("Global R analysis error", e);
      setRError("Failed to fetch data from server.");
    } finally {
      setRLoading(false);
    }
  };

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
            <div className="r-result-container" style={{ 
              marginTop: "1.5rem", 
              maxHeight: "450px", 
              overflowY: "auto", 
              overflowX: "hidden", 
              width: "100%", 
              boxSizing: "border-box",
              padding: "0 5px" 
            }}>
              {Object.entries(rResult).map(([colName, data]) => (
                <div key={colName} style={{ 
                  padding: "12px", 
                  backgroundColor: "#fcfcfc", 
                  borderRadius: "8px", 
                  border: "1px solid #8C68CD",
                  marginBottom: "12px",
                  width: "92%",         // Reduced slightly more to ensure the border is never hidden
                  margin: "0 auto 12px auto", 
                  boxSizing: "border-box", 
                  display: "block",
                  wordBreak: "break-all",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  <p style={{ 
                    fontWeight: 'bold', 
                    fontSize: '0.85rem', 
                    color: '#333', 
                    margin: "0 0 8px 0",
                    borderBottom: '1px solid #eee',
                    paddingBottom: '4px'
                  }}>
                    {colName} {/* Removed "Col:" prefix here */}
                  </p>

                  {!data.success ? (
                    <p style={{ color: '#d9534f', fontSize: '0.75rem', margin: 0 }}>{data.error}</p>
                  ) : (
                    Object.entries(data.stats).map(([statName, val]) => (
                      <div key={statName} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: '0.85rem', 
                        margin: '4px 0',
                        color: '#444' 
                      }}>
                        <span style={{ marginRight: '10px' }}>{statName}:</span>
                        <span style={{ color: '#8C68CD', fontWeight: 'bold', textAlign: 'right' }}>
                          {typeof val === 'number' ? val.toFixed(3) : val}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDatabasePage;

