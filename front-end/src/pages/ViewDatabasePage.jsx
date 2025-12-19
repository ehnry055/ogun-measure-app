import React, { useState, useEffect } from 'react';
import '../styles/DownloadDatabasePage.css';
import NotesList from '../components/NotesList';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import InfoPopup from '../components/InfoPopup';

let webRInstance = null;

const ViewDatabasePage = () => {
  const { isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  
  // --- EXISTING STATE ---
  const [entryLimit, setEntryLimit] = useState(20);
  const [tableName, setTableName] = useState("Default Table");
  const [stateFilter, setStateFilter] = useState('');
  const [presets, setPresets] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(new Set());
  const [selectedPreset, setSelectedPreset] = useState(null);
  
  // --- R ANALYSIS STATE ---
  const [rReady, setRReady] = useState(false);
  const [rLoading, setRLoading] = useState(false);
  const [rResult, setRResult] = useState(null);
  const [rError, setRError] = useState(null);

  // --- R SHELL STATE (Dynamic Rows) ---
  const [shellRows, setShellRows] = useState([
    { label: 'Mean', code: 'mean(vals)' },
    { label: 'SD', code: 'sd(vals)' }
  ]);

  // --- INITIALIZATION EFFECTS ---
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

  // --- R SHELL HELPER FUNCTIONS ---
  const addShellRow = () => setShellRows([...shellRows, { label: '', code: '' }]);
  
  const updateShellRow = (index, field, value) => {
    const newRows = [...shellRows];
    newRows[index][field] = value;
    setShellRows(newRows);
  };

  const removeShellRow = (index) => {
    setShellRows(shellRows.filter((_, i) => i !== index));
  };

  // --- MAIN ANALYSIS FUNCTION ---
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
      // Note: Ensure your server.js has the /api/analyze-columns endpoint we created!
      const res = await axios.post('/api/analyze-columns', 
        { columns: columnList, limit: entryLimit },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allData = res.data; 
      const finalResults = {}; // Will store { "ColName": { success: true, stats: {...} } }

      // 2. Build dynamic R command from shellRows
      const listContent = shellRows
        .filter(row => row.label.trim() !== '' && row.code.trim() !== '')
        .map(row => `\`${row.label}\` = ${row.code}`)
        .join(', ');

      if (!listContent) {
        alert("Please add at least one variable to the R Shell.");
        setRLoading(false);
        return;
      }

      // 3. Loop through columns and run R script
      for (const colName of columnList) {
        try {
          const rawValues = allData[colName];
          if (!rawValues || rawValues.length === 0) {
             finalResults[colName] = { success: false, error: "No data found" };
             continue;
          }

          // Inject specific column data into R as 'vals'
          await webRInstance.objs.globalEnv.bind('vals', rawValues);
          
          const rCode = `
            vals <- as.numeric(vals)
            # Safety check: if all values are NA, it's likely text data
            if(all(is.na(vals))) stop("Non-numeric data")
            
            list(${listContent})
          `;

          const rObj = await webRInstance.evalR(rCode);
          const js = await rObj.toJs();
          
          // Parse the R list structure
          const stats = {};
          const names = js.names || [];
          const values = js.values || [];

          names.forEach((name, idx) => {
            const v = values[idx];
            if (v && v.values) stats[name] = v.values[0];
          });

          finalResults[colName] = { success: true, stats };
        } catch (colErr) {
          // Gracefully handle non-numeric columns without crashing the loop
          finalResults[colName] = { success: false, error: "Non-numeric data" };
        }
      }

      setRResult(finalResults);
    } catch (e) {
      console.error("Global R analysis error", e);
      setRError("Failed to fetch or analyze data.");
    } finally {
      setRLoading(false);
    }
  };

  // --- EXISTING HANDLERS (Placeholders - ensure these match your existing logic) ---
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

  // !!! IMPORTANT: Ensure these match your original implementation !!!
  const handleDownload = async () => { 
    alert("Download CSV triggered"); 
    // ... insert your original CSV download logic here
  };
  const handleDownloadExcel = async () => { 
    alert("Download Excel triggered"); 
    // ... insert your original Excel download logic here
  };
  const handleSelectTable = async () => { 
    alert("Select Table triggered"); 
    // ... insert your original Select Table logic here
  };

  return (
    <div className="page-layout-container">
      {/* LEFT COLUMN: FILTERS & PRESETS */}
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

      {/* MIDDLE COLUMN: DATA TABLE */}
      <div className="middle-data-section">
        <div className="data-section">
          <div className="data-item">
            <h2>
              {tableName || "Select a table to view"}
              <InfoPopup>
                <h2 style={{ color: '#8C68CD'}}>View Data </h2>
                <p style={{ textAlign: 'left' , margin: '0 20px', fontSize: '16px'}}>
                  Select columns to view data. Click headers to sort. Use the controls on the right to analyze or download.
                </p>
              </InfoPopup>
            </h2>
            <div className='table-container'>
              <NotesList 
                key={tableName} 
                limit={entryLimit} 
                selectedColumns={selectedColumns} 
                onToggleColumn={(col) => setSelectedColumns(prev => {
                  const n = new Set(prev); n.has(col) ? n.delete(col) : n.add(col); return n;
                })}
                currentTableName={tableName} 
                stateFilter={stateFilter}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: CONTROLS & ANALYSIS */}
      <div className="control-section" style={{ boxSizing: 'border-box' }}>
        <h2 className="section-title">Database Controls</h2>
        
        {/* Flex container to ensure left alignment of all children */}
        <div className="controls" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          
          <button className="download-button" onClick={handleDownload} style={{ width: '100%', marginBottom: '10px' }}> 
            Download as CSV 
          </button>
          <button className="download-button" onClick={handleDownloadExcel} style={{ width: '100%', marginBottom: '10px' }}> 
            Download as XLSX 
          </button>
          <button className="select-button" onClick={handleSelectTable} style={{ width: '100%', marginBottom: '15px' }}> 
            Select Table 
          </button>
          
          <hr style={{ width: '100%', margin: '15px 0', border: '0.5px solid #ddd' }} />
          
          <h3 style={{ fontSize: '1rem', color: '#8C68CD', margin: '0 0 5px 0' }}>R Analysis Shell</h3>
          <p style={{ fontSize: '0.7rem', marginBottom: '10px', color: '#fff' }}>Use <b>vals</b> for the data vector</p>
          
          {/* R Shell Inputs */}
          <div className="r-shell-container" style={{ width: '100%', maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
            {shellRows.map((row, index) => (
              <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '8px', width: '100%' }}>
                <input 
                  placeholder="Label" 
                  style={{ width: '35%', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }} 
                  value={row.label}
                  onChange={(e) => updateShellRow(index, 'label', e.target.value)}
                />
                <input 
                  placeholder="R Code" 
                  style={{ width: '55%', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }} 
                  value={row.code}
                  onChange={(e) => updateShellRow(index, 'code', e.target.value)}
                />
                <button onClick={() => removeShellRow(index)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
              </div>
            ))}
          </div>
          
          <button className="select-button" style={{ fontSize: '0.8rem', padding: '8px 12px', marginBottom: '10px' }} onClick={addShellRow}>
            + Add Row
          </button>

          <button
            className="download-button"
            onClick={handleRunRAnalysis}
            disabled={!rReady || rLoading}
            style={{ width: '100%', backgroundColor: rLoading ? '#555' : '#8C68CD', marginTop: '5px' }}
          >
            {!rReady ? "Loading R..." : rLoading ? "Analyzing..." : "Run Analysis"}
          </button>

          {rError && <p style={{ color: '#ff4d4d', fontSize: '0.8rem', marginTop: '10px' }}>{rError}</p>}

          {/* RESULTS DISPLAY - Fixed for Perfect Alignment */}
          {rResult && (
            <div className="r-result-container" style={{ 
              marginTop: "1.5rem", 
              maxHeight: "400px", 
              overflowY: "auto", 
              overflowX: "hidden", 
              width: "100%", 
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start", // Left align
              paddingRight: "5px"
            }}>
              {Object.entries(rResult).map(([colName, data]) => (
                <div key={colName} style={{ 
                  padding: "12px", 
                  backgroundColor: "#fcfcfc", 
                  borderRadius: "8px", 
                  border: "1px solid #8C68CD",
                  marginBottom: "12px",
                  // Width calc accounts for scrollbar space to prevent clipping or overlay
                  width: "calc(100% - 10px)", 
                  marginLeft: "0",
                  boxSizing: "border-box", 
                  wordBreak: "break-all",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  <p style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333', margin: "0 0 8px 0", borderBottom: '1px solid #eee', paddingBottom: '4px', textAlign: 'left' }}>
                    {colName}
                  </p>

                  {!data.success ? (
                    <p style={{ color: '#d9534f', fontSize: '0.75rem', margin: 0, textAlign: 'left' }}>{data.error}</p>
                  ) : (
                    Object.entries(data.stats).map(([statName, val]) => (
                      <div key={statName} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', margin: '4px 0', color: '#444' }}>
                        <span style={{ marginRight: '10px' }}>{statName}:</span>
                        <span style={{ color: '#8C68CD', fontWeight: 'bold' }}>
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