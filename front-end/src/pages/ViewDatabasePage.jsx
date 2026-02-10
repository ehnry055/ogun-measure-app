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
  const [analysisMode, setAnalysisMode] = useState('batch'); // 'batch' or 'multi'
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


  // --- Helper Functions ---
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
            finalResults["Analysis Error"] = { success: false, error: e.message || "Failed to run multi-column script." }; 
        }
      }
      setRResult(finalResults);
    } catch (e) { setRError("Analysis failed."); } finally { setRLoading(false); }
  };

  // --- GRID STYLE CONSTANTS ---
  const rowGridStyle = {
    display: 'grid',
    // Adjusted: 1fr label, 2fr code, 25px Expand, 20px Delete (More precision to avoid overflow)
    gridTemplateColumns: '1fr 2fr 25px 20px', 
    gap: '5px',
    marginBottom: '5px',
    alignItems: 'start'
  };

  const varGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'minmax(40px, 60px) 15px 1fr 20px',
    gap: '5px',
    marginBottom: '5px',
    alignItems: 'center'
  };

  // Unified Input Style (Matches standard font, no monospace unless needed)
  const inputStyle = {
    width: '100%', 
    padding: '4px', 
    border: '1px solid #ccc', 
    borderRadius: '4px', 
    boxSizing: 'border-box',
    fontFamily: 'inherit', // Fixes font consistency
    fontSize: '0.8rem'
  };

  const deleteBtnStyle = {
    border: 'none', 
    background: 'none', 
    color: '#d9534f', 
    cursor: 'pointer', 
    fontSize: '1rem', 
    padding: 0,
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div className="page-layout-container">
      <div className="left-section">
        <div className="entry-limit-container">
          <label style={{ color: '#010a13ff'}}>Entries to display:</label>
          <input type="number" min="1" value={entryLimit} onChange={handleEntryLimitChange} className="limit-input" />
        </div>
        <div className="state-filter-container">
          <label>Filter by State:</label>
          <input type="text" placeholder="Enter state name" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} />
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
            <h2>{tableName || "Select a table to view"}</h2>
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
          
          <button 
            className="select-button" 
            onClick={toggleTableSelector}
            style={{ marginBottom: showTableSelector ? '5px' : '10px'}}
          > 
            {showTableSelector ? "▼ Close Table List" : "▶ Select Table"} 
          </button>

          {showTableSelector && (
            <div className="table-selector-list" style={{
              maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', backgroundColor: '#fff'
            }}>
              {availableTables.map((tName) => (
                  <div key={tName} onClick={() => handleTableSelection(tName)} style={{
                      padding: '8px 10px', cursor: 'pointer', borderBottom: '1px solid #eee',
                      backgroundColor: tableName === tName ? '#f0f8ff' : 'transparent',
                      color: tableName === tName ? '#000' : '#333', fontSize: '0.9rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tableName === tName ? '#f0f8ff' : 'transparent'}
                  >
                    {tName} {tableName === tName && <span style={{color: 'green', fontSize: '0.8rem'}}>●</span>}
                  </div>
                ))}
            </div>
          )}
          
          <hr style={{width: '100%', margin: '15px 0', border: '0.5px solid #ddd'}} />
          
          {/* --- R Shell Header --- */}
          <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '15px'}}>
            <h3 style={{fontSize: '1rem', color: '#ca6767ff', margin: 0, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'}}>
              R Analysis Shell
              <span 
                onClick={() => setShowHelp(!showHelp)}
                style={{
                  marginLeft: '8px', cursor: 'pointer', fontSize: '0.8rem', border: '1px solid #ca6767ff', 
                  borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', 
                  alignItems: 'center', justifyContent: 'center', color: '#ca6767ff'
                }}
                title="Help"
              >?</span>
            </h3>
            
            <div style={{fontSize: '0.7rem', display: 'flex', gap: '5px', background: '#f5f5f5', padding: '3px', borderRadius: '4px'}}>
              <button 
                onClick={() => setAnalysisMode('batch')}
                style={{
                  border: 'none', background: analysisMode === 'batch' ? '#fff' : 'transparent', 
                  color: analysisMode === 'batch' ? '#333' : '#999',
                  boxShadow: analysisMode === 'batch' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  borderRadius: '3px', cursor: 'pointer', padding: '4px 8px'
                }}
              >Batch</button>
              <button 
                onClick={() => setAnalysisMode('multi')}
                style={{
                  border: 'none', background: analysisMode === 'multi' ? '#fff' : 'transparent', 
                  color: analysisMode === 'multi' ? '#333' : '#999',
                  boxShadow: analysisMode === 'multi' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  borderRadius: '3px', cursor: 'pointer', padding: '4px 8px'
                }}
              >Multi</button>
            </div>
          </div>
          
          {showHelp && (
            <div style={{backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '4px', padding: '10px', fontSize: '0.75rem', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
              <p style={{margin: '0 0 5px 0'}}><strong>Batch:</strong> Runs code on each selected column individually. Use variable <code>vals</code>.</p>
              <p style={{margin: 0}}><strong>Multi:</strong> Define variables (x, y) mapped to columns, then write one script using them.</p>
            </div>
          )}
          
          {/* Multi-Mode Inputs */}
          {analysisMode === 'multi' && (
             <div style={{backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px', marginBottom: '10px', border: '1px solid #eee', boxSizing: 'border-box'}}>
               {rVariables.map((v, idx) => (
                 <div key={idx} style={varGridStyle}>
                   <input 
                     placeholder="Var" value={v.name} 
                     onChange={(e) => updateRVariable(idx, 'name', e.target.value)}
                     style={inputStyle}
                   />
                   <span style={{textAlign: 'center', fontSize: '0.8rem'}}>=</span>
                   <select 
                     value={v.column} onChange={(e) => updateRVariable(idx, 'column', e.target.value)}
                     style={inputStyle}
                   >
                     <option value="">-- Column --</option>
                     {Array.from(selectedColumns).map(col => <option key={col} value={col}>{col}</option>)}
                   </select>
                   <button onClick={() => removeRVariable(idx)} style={deleteBtnStyle}>×</button>
                 </div>
               ))}
               <button onClick={addRVariable} style={{border: 'none', background: 'none', color: '#8C68CD', fontSize: '0.75rem', cursor: 'pointer', padding: 0}}>+ Add Variable</button>
             </div>
          )}
          
          {/* Shell Rows (Fixed: Now uses standard inputs and matching X button) */}
          <div className="r-shell-container" style={{maxHeight: '200px', overflowY: 'auto', marginBottom: '10px', width: '100%'}}>
            {shellRows.map((row, index) => (
              <div key={index} style={rowGridStyle}>
                
                <input 
                  placeholder="Label" 
                  style={inputStyle} 
                  value={row.label} 
                  onChange={(e) => updateShellRow(index, 'label', e.target.value)} 
                />
                
                {row.expanded ? (
                  <textarea 
                    placeholder="R Code"
                    style={{...inputStyle, minHeight: '80px', resize: 'vertical'}}
                    value={row.code}
                    onChange={(e) => updateShellRow(index, 'code', e.target.value)}
                  />
                ) : (
                  <input 
                    placeholder={analysisMode === 'batch' ? "mean(vals)" : "cor(var1, var2)"}
                    style={inputStyle} 
                    value={row.code} 
                    onChange={(e) => updateShellRow(index, 'code', e.target.value)} 
                  />
                )}
                
                <button onClick={() => toggleShellRowExpand(index)} style={{background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '5px 0', fontSize: '0.8rem'}}>
                  {row.expanded ? '▲' : '▼'}
                </button>
                <button onClick={() => removeShellRow(index)} style={deleteBtnStyle}>
                  ×
                </button>
              </div>
            ))}
          </div>

          <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
             <button className="select-button" style={{fontSize: '0.8rem', padding: '5px', flex: 1}} onClick={addShellRow}>+ Add Row</button>
             <button className="select-button" style={{fontSize: '0.8rem', padding: '5px', flex: 1, backgroundColor: '#f0f8ff', borderColor: '#8C68CD', color: '#8C68CD'}} onClick={handleSaveRPreset}>Save Preset</button>
          </div>

           {/* Presets List */}
           {rPresets.length > 0 && (
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px'}}>
              {rPresets.map(preset => (
                <div key={preset.name} style={{ display: 'flex', alignItems: 'center', background: '#eee', borderRadius: '4px', paddingLeft: '8px', fontSize: '0.8rem' }}>
                  <span onClick={() => applyRPreset(preset)} style={{ cursor: 'pointer', marginRight: '5px' }}>{preset.name}</span>
                  <button onClick={() => deleteRPreset(preset.name)} style={{ border: 'none', background: 'none', color: '#d9534f', cursor: 'pointer', padding: '4px 8px', borderLeft: '1px solid #ddd' }}>×</button>
                </div>
              ))}
            </div>
          )}

          <button className="download-button" onClick={handleRunRAnalysis} disabled={!rReady || rLoading} style={{marginTop: '5px'}}>
            {!rReady ? "Loading R..." : rLoading ? "Analyzing..." : "Run Analysis"}
          </button>
          
          {rError && <p style={{color: 'red', fontSize: '0.8rem'}}>{rError}</p>}

          {rResult && (
            <div className="r-result-container" style={{ 
              marginTop: "1.5rem", maxHeight: "450px", overflowY: "auto", overflowX: "hidden", 
              width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", 
              alignItems: "flex-start", paddingRight: "10px"
            }}>
              {Object.entries(rResult).map(([colName, data]) => (
                <div key={colName} style={{ 
                  padding: "12px", backgroundColor: "#fcfcfc", borderRadius: "8px", border: "1px solid #8C68CD",
                  marginBottom: "12px", width: "100%", boxSizing: "border-box", 
                  wordBreak: "break-all", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
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
                        <span style={{ color: '#8C68CD', fontWeight: 'bold' }}>{typeof val === 'number' ? val.toFixed(3) : val}</span>
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