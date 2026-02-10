import React, { useState, useEffect } from 'react';
import '../styles/DownloadDatabasePage.css';
import NotesList from '../components/NotesList';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

let webRInstance = null;

const ViewDatabasePage = () => {
  const { getAccessTokenSilently } = useAuth0();
  
  const [entryLimit, setEntryLimit] = useState(20);
  const [tableName, setTableName] = useState("Default Table");
  const [stateFilter, setStateFilter] = useState('');
  const [presets, setPresets] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(new Set());
  const [selectedPreset, setSelectedPreset] = useState(null);
  
  const [availableTables, setAvailableTables] = useState([]);
  const [showTableSelector, setShowTableSelector] = useState(false);

  // R Analysis State
  const [rReady, setRReady] = useState(false);
  const [rLoading, setRLoading] = useState(false);
  const [rResult, setRResult] = useState(null);
  const [rError, setRError] = useState(null);
  
  // Analysis Mode & Help
  const [analysisMode, setAnalysisMode] = useState('batch');
  const [showHelp, setShowHelp] = useState(false);
  
  const [rVariables, setRVariables] = useState([
    { name: 'var1', column: '' },
    { name: 'var2', column: '' }
  ]);

  const [shellRows, setShellRows] = useState([
    { label: 'Mean', code: 'mean(vals)', expanded: false },
    { label: 'SD', code: 'sd(vals)', expanded: false }
  ]);
  const [rPresets, setRPresets] = useState([]);

  useEffect(() => {
    const savedPresets = localStorage.getItem('columnPresets');
    if (savedPresets) setPresets(JSON.parse(savedPresets));

    const savedRPresets = localStorage.getItem('rShellPresets');
    if (savedRPresets) setRPresets(JSON.parse(savedRPresets));
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


  // --- Helper Functions (Same as before) ---
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
    if (!isNaN(value)) setEntryLimit(value >= 1 ? value : 1);
  };

  const addShellRow = () => setShellRows([...shellRows, { label: '', code: '', expanded: false }]);
  
  const updateShellRow = (index, field, value) => {
    const newRows = [...shellRows];
    newRows[index][field] = value;
    setShellRows(newRows);
  };
  
  const removeShellRow = (index) => setShellRows(shellRows.filter((_, i) => i !== index));
 
  const toggleShellRowExpand = (index) => {
    const newRows = [...shellRows];
    newRows[index].expanded = !newRows[index].expanded;
    setShellRows(newRows);
  };

  const addRVariable = () => setRVariables([...rVariables, { name: `var${rVariables.length + 1}`, column: '' }]);
  
  const updateRVariable = (index, field, value) => {
    const newVars = [...rVariables];
    newVars[index][field] = value;
    setRVariables(newVars);
  };
  
  const removeRVariable = (index) => setRVariables(rVariables.filter((_, i) => i !== index));

  const handleSaveRPreset = () => {
    const presetName = prompt('Enter name for this R configuration:');
    if (!presetName) return;
    const newPreset = { name: presetName, rows: shellRows, mode: analysisMode, variables: rVariables };
    const updated = [...rPresets, newPreset];
    setRPresets(updated);
    localStorage.setItem('rShellPresets', JSON.stringify(updated));
  };

  const applyRPreset = (preset) => {
    setShellRows(preset.rows);
    if (preset.mode) setAnalysisMode(preset.mode);
    if (preset.variables) setRVariables(preset.variables);
  };

  const deleteRPreset = (presetName) => {
    const updated = rPresets.filter(p => p.name !== presetName);
    setRPresets(updated);
    localStorage.setItem('rShellPresets', JSON.stringify(updated));
  };

  const handleDownload = async () => {
    try {
      let token = await getAccessTokenSilently();
      const selectedColumnsArray = Array.from(selectedColumns);
      const params = new URLSearchParams();
      if (selectedColumnsArray.length > 0) params.append('columns', selectedColumnsArray.join(','));
      let response = await axios.get(`/api/export-csv${params.toString() ? `?${params}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'text'
      });
      let blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      let url = URL.createObjectURL(blob);
      let link = document.createElement('a');
      link.href = url; link.download = 'data.csv';
      document.body.appendChild(link); link.click();
      document.body.removeChild(link); URL.revokeObjectURL(url);
    } catch (error) { alert('CSV download failed.'); }
  };

  const handleDownloadExcel = async () => {
    try {
      let token = await getAccessTokenSilently();
      const selectedColumnsArray = Array.from(selectedColumns);
      const params = new URLSearchParams();
      if (selectedColumnsArray.length > 0) params.append('columns', selectedColumnsArray.join(','));
      let response = await axios.get(`/api/export-excel${params.toString() ? `?${params}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      let blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      let url = URL.createObjectURL(blob);
      let link = document.createElement('a');
      link.href = url; link.download = 'data.xlsx';
      document.body.appendChild(link); link.click();
      document.body.removeChild(link); URL.revokeObjectURL(url);
    } catch (error) { alert('Excel download failed.'); }
  };

  const toggleTableSelector = async () => {
    if (!showTableSelector) {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`/api/tables`, { headers: { Authorization: `Bearer ${token}` } });
        setAvailableTables(response.data);
      } catch (error) { 
        console.error(error);
        alert('Error fetching table list'); 
        return;
      }
    }
    setShowTableSelector(!showTableSelector);
  };

  const handleTableSelection = async (selectedName) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.post(`/api/select-table`, { tableName: selectedName }, { headers: { Authorization: `Bearer ${token}` } });
      setTableName(selectedName);
      setShowTableSelector(false);
    } catch (error) { 
      alert(`Error setting table to ${selectedName}`); 
    }
  };

  const handleRunRAnalysis = async () => {
    if (!rReady || !webRInstance) return;
    if (selectedColumns.size === 0) { alert("Please select columns in the table above first."); return; }
    
    setRLoading(true); setRResult(null); setRError(null);
    
    try {
      const token = await getAccessTokenSilently();
      const columnList = Array.from(selectedColumns);
      const res = await axios.post('/api/analyze-columns', { columns: columnList, limit: entryLimit }, { headers: { Authorization: `Bearer ${token}` } });
      const allData = res.data;
      const listContent = shellRows.filter(r => r.label.trim() && r.code.trim()).map(r => `\`${r.label}\` = ${r.code}`).join(', ');
      
      const finalResults = {};

      if (analysisMode === 'batch') {
        for (const colName of columnList) {
          try {
            const rawValues = allData[colName];
            if (!rawValues) continue;
            await webRInstance.objs.globalEnv.bind('vals', rawValues);
            const rObj = await webRInstance.evalR(`vals <- as.numeric(vals); list(${listContent})`);
            const js = await rObj.toJs();
            const stats = {};
            js.names.forEach((name, idx) => { stats[name] = js.values[idx].values[0]; });
            finalResults[colName] = { success: true, stats };
          } catch (e) { finalResults[colName] = { success: false, error: "Analysis error" }; }
        }
      } else {
        try {
          for (const v of rVariables) {
            if (!v.name || !v.column) continue;
            const rawValues = allData[v.column];
            if (rawValues) {
              await webRInstance.objs.globalEnv.bind(v.name, rawValues);
              await webRInstance.evalR(`${v.name} <- as.numeric(${v.name})`);
            }
          }
          const rObj = await webRInstance.evalR(`list(${listContent})`);
          const js = await rObj.toJs();
          const stats = {};
          js.names.forEach((name, idx) => { 
             stats[name] = js.values[idx].values[0]; 
          });
          finalResults["Multi-Column Result"] = { success: true, stats };
        } catch (e) {
            console.error(e);
            finalResults["Analysis Error"] = { success: false, error: "Failed to run multi-column script." }; 
        }
      }
      setRResult(finalResults);
    } catch (e) { setRError("Analysis failed."); } finally { setRLoading(false); }
  };

  // --- Styles for that "High School / Elementary" Look ---
  const boxStyle = {
    border: '2px solid #333',
    padding: '10px',
    marginBottom: '15px',
    backgroundColor: '#fff'
  };

  const simpleButtonStyle = {
    border: '2px solid #555',
    backgroundColor: '#e0e0e0',
    color: 'black',
    padding: '5px 10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginRight: '5px',
    fontSize: '0.85rem'
  };

  const inputStyle = {
    border: '2px solid #888',
    padding: '5px',
    borderRadius: '0px' // Boxy look
  };

  return (
    <div className="page-layout-container" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="left-section" style={{ borderRight: '2px solid #333' }}>
        <div className="entry-limit-container">
          <label style={{ fontWeight: 'bold' }}>Entries to display:</label>
          <input type="number" min="1" value={entryLimit} onChange={handleEntryLimitChange} style={inputStyle} />
        </div>
        <div className="state-filter-container">
          <label style={{ fontWeight: 'bold' }}>Filter by State:</label>
          <input type="text" placeholder="Enter state name" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} style={inputStyle} />
        </div>
        <div className="preset-controls" style={{ marginTop: '20px', borderTop: '2px solid #ccc', paddingTop: '10px' }}>
          <button style={simpleButtonStyle} onClick={handleSavePreset}>Save Preset</button>
          {presets.length > 0 && <h3>Saved Presets:</h3>}
          {presets.map(preset => (
            <div key={preset.name} style={{ margin: '5px 0' }}>
              <button style={{ ...simpleButtonStyle, backgroundColor: selectedPreset === preset.name ? '#ccc' : '#fff' }} onClick={() => applyPreset(preset)}>{preset.name}</button>
              <button onClick={() => deletePreset(preset.name)} style={{ border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>[x]</button>
            </div>
          ))}
        </div>
      </div>

      <div className="middle-data-section">
        <div className="data-section">
          <div className="data-item">
            <h2 style={{ borderBottom: '2px solid black', paddingBottom: '5px' }}>{tableName || "Select a table"}</h2>
            <div className='table-container' style={{ border: '2px solid #333' }}>
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

      <div className="control-section" style={{ borderLeft: '2px solid #333' }}>
        <h2 className="section-title" style={{ textDecoration: 'underline' }}>Database Controls</h2>
        <div className="controls">
          <button style={{ ...simpleButtonStyle, width: '100%', marginBottom: '5px' }} onClick={handleDownload}> Download CSV </button>
          <button style={{ ...simpleButtonStyle, width: '100%', marginBottom: '15px' }} onClick={handleDownloadExcel}> Download XLSX </button>
          
          <button style={{ ...simpleButtonStyle, width: '100%' }} onClick={toggleTableSelector}> 
            {showTableSelector ? "▼ Close List" : "▶ Select Table"} 
          </button>

          {showTableSelector && (
            <div style={{ ...boxStyle, maxHeight: '150px', overflowY: 'auto' }}>
              {availableTables.map((tName) => (
                  <div key={tName} onClick={() => handleTableSelection(tName)} style={{
                      padding: '5px', cursor: 'pointer', borderBottom: '1px solid #ccc',
                      backgroundColor: tableName === tName ? '#ffffcc' : 'transparent',
                      fontWeight: tableName === tName ? 'bold' : 'normal'
                    }}
                  >
                    {tName}
                  </div>
                ))}
            </div>
          )}
          
          <hr style={{ borderTop: '2px solid #333', margin: '20px 0' }} />
          
          {/* --- R Shell Area --- */}
          <div style={{ ...boxStyle, backgroundColor: '#fffbe6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#d32f2f' }}>R Analysis Shell</h3>
              
              {/* The "Elementary" Help Bubble */}
              <button 
                onClick={() => setShowHelp(!showHelp)}
                style={{
                  borderRadius: '50%', width: '24px', height: '24px', border: '2px solid #d32f2f', 
                  backgroundColor: '#fff', color: '#d32f2f', fontWeight: 'bold', cursor: 'pointer'
                }}
                title="Click for instructions"
              >
                ?
              </button>
            </div>

            {/* Instruction Bubble (Conditional) */}
            {showHelp && (
              <div style={{ border: '2px dashed #d32f2f', padding: '10px', backgroundColor: '#fff', fontSize: '0.8rem', marginBottom: '10px' }}>
                <strong>How to use:</strong>
                <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                  <li><strong>Batch Mode:</strong> Runs your code on each selected column separately. Use <code>vals</code> to refer to the data.</li>
                  <li><strong>Multi-Column:</strong> Define variable names (like x, y) and link them to columns. Then write one script using those names.</li>
                </ul>
              </div>
            )}
            
            {/* Mode Switcher */}
            <div style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Mode:</label>
              <select 
                value={analysisMode} 
                onChange={(e) => setAnalysisMode(e.target.value)}
                style={inputStyle}
              >
                <option value="batch">Batch (Single Column)</option>
                <option value="multi">Multi-Column (Custom)</option>
              </select>
            </div>
            
            {/* Multi-Mode Inputs (No text, just inputs) */}
            {analysisMode === 'multi' && (
               <div style={{ marginBottom: '10px' }}>
                 {rVariables.map((v, idx) => (
                   <div key={idx} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                     <input 
                       placeholder="Var" value={v.name} 
                       onChange={(e) => updateRVariable(idx, 'name', e.target.value)}
                       style={{ ...inputStyle, width: '50px' }}
                     />
                     <span style={{ alignSelf: 'center' }}>=</span>
                     <select 
                       value={v.column} onChange={(e) => updateRVariable(idx, 'column', e.target.value)}
                       style={{ ...inputStyle, flex: 1 }}
                     >
                       <option value="">-- Col --</option>
                       {Array.from(selectedColumns).map(col => <option key={col} value={col}>{col}</option>)}
                     </select>
                     <button onClick={() => removeRVariable(idx)} style={{ border: 'none', color: 'red', fontWeight: 'bold', cursor: 'pointer' }}>X</button>
                   </div>
                 ))}
                 <button onClick={addRVariable} style={{ ...simpleButtonStyle, fontSize: '0.7rem' }}>+ Add Var</button>
               </div>
            )}
            
            {/* Shell Rows */}
            <div style={{ marginBottom: '10px' }}>
              {shellRows.map((row, index) => (
                <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '5px', alignItems: 'flex-start' }}>
                  <input placeholder="Label" value={row.label} onChange={(e) => updateShellRow(index, 'label', e.target.value)} style={{ ...inputStyle, width: '30%' }} />
                  
                  {row.expanded ? (
                    <textarea 
                      placeholder="Code..." 
                      style={{ ...inputStyle, width: '50%', minHeight: '60px', fontFamily: 'monospace' }}
                      value={row.code} onChange={(e) => updateShellRow(index, 'code', e.target.value)}
                    />
                  ) : (
                    <input 
                      placeholder="Code..." 
                      style={{ ...inputStyle, width: '50%', fontFamily: 'monospace' }} 
                      value={row.code} onChange={(e) => updateShellRow(index, 'code', e.target.value)} 
                    />
                  )}
                  
                  <button onClick={() => toggleShellRowExpand(index)} style={{ border: '1px solid #ccc', cursor: 'pointer' }}>{row.expanded ? '▲' : '▼'}</button>
                  <button onClick={() => removeShellRow(index)} style={{ border: 'none', color: 'red', fontWeight: 'bold', cursor: 'pointer' }}>X</button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '5px' }}>
               <button style={simpleButtonStyle} onClick={addShellRow}>+ Row</button>
               <button style={simpleButtonStyle} onClick={handleSaveRPreset}>Save Set</button>
            </div>

             {/* R Presets List */}
            {rPresets.length > 0 && (
              <div style={{ marginTop: '10px', fontSize: '0.8rem' }}>
                {rPresets.map(preset => (
                  <span key={preset.name} style={{ display: 'inline-block', border: '1px solid #999', padding: '2px 5px', marginRight: '5px', backgroundColor: '#eee' }}>
                    <span onClick={() => applyRPreset(preset)} style={{ cursor: 'pointer' }}>{preset.name}</span>
                    <button onClick={() => deleteRPreset(preset.name)} style={{ marginLeft: '5px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>x</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleRunRAnalysis} disabled={!rReady || rLoading} style={{ ...simpleButtonStyle, width: '100%', backgroundColor: '#d32f2f', color: 'white', border: '2px solid black' }}>
            {!rReady ? "Loading..." : rLoading ? "Processing..." : "RUN ANALYSIS"}
          </button>
          
          {rError && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {rError}</p>}

          {rResult && (
            <div style={{ marginTop: "20px", borderTop: '2px solid #333', paddingTop: '10px' }}>
              {Object.entries(rResult).map(([colName, data]) => (
                <div key={colName} style={{ border: "2px solid #333", marginBottom: "10px", padding: "10px", backgroundColor: "#f9f9f9" }}>
                  <h4 style={{ margin: "0 0 5px 0", textDecoration: "underline" }}>{colName}</h4>
                  {!data.success ? (
                    <span style={{ color: 'red' }}>{data.error}</span>
                  ) : (
                    Object.entries(data.stats).map(([statName, val]) => (
                      <div key={statName} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace' }}>
                        <span>{statName}:</span>
                        <span style={{ fontWeight: 'bold' }}>{typeof val === 'number' ? val.toFixed(3) : val}</span>
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