import React, { useState, useEffect } from 'react';
import '../styles/DownloadDatabasePage.css';
import NotesList from '../components/NotesList';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import InfoPopup from '../components/InfoPopup';

let webRInstance = null;

const ViewDatabasePage = () => {
  const { isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently, isLoading } = useAuth0();
  
  // --- AUTH STATE (SECURITY GATE) ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // --- APP STATE ---
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
  
  const [shellRows, setShellRows] = useState([
    { label: 'Mean', code: 'mean(vals)', expanded: false },
    { label: 'SD', code: 'sd(vals)', expanded: false }
  ]);

  // --- AUTHORIZATION CHECKER (ROBUST VERSION) ---
  const checkUserRole = async () => {
    if (isAuthenticated && user) {
      try {
        const token = await getAccessTokenSilently();
        
        console.log("DEBUG: Checking roles for User ID:", user.sub);

        // FIX 1: Use 'params' to automatically handle special characters like '|'
        const res = await axios.get('/api/admin/get-user-roles', {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId: user.sub } 
        });
        
        const rawData = res.data; 
        console.log("DEBUG: Raw Roles Response from Server:", rawData); 

        // FIX 2: Normalize data (Handle if response is Array directly OR Object wrapper)
        const rolesArray = Array.isArray(rawData) ? rawData : (rawData.roles || []);

        // FIX 3: Robust check (Strings vs Objects + Case Insensitive)
        const hasAccess = rolesArray.some(r => {
          // If 'r' is a string, use it; otherwise look for '.name'
          const roleName = (typeof r === 'string') ? r : r.name;
          
          if (!roleName) return false;

          const lowerName = roleName.toLowerCase();
          // Checks for your specific roles from the screenshot
          return lowerName === 'registered_role' || lowerName === 'admin_role';
        });
        
        if (hasAccess) {
          console.log("DEBUG: Access Granted.");
          setIsAuthorized(true);
        } else {
          console.warn("DEBUG: Access Denied. No matching roles found in:", rolesArray);
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("DEBUG: Error checking authorization:", error);
        setIsAuthorized(false);
      }
    }
    setAuthLoading(false);
  };

  // Run auth check on load
  useEffect(() => {
    if (!isLoading) {
      checkUserRole();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.sub, isLoading]);

  // --- EFFECT: LOAD PRESETS ---
  useEffect(() => {
    const savedPresets = localStorage.getItem('columnPresets');
    if (savedPresets) setPresets(JSON.parse(savedPresets));
  }, []);

  // --- EFFECT: INIT WEBR ---
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

  // --- PRESET & LIMIT HANDLERS ---
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

  // --- R SHELL ROW MANAGEMENT ---
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

  // --- DOWNLOAD & SELECT LOGIC ---
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

  const handleSelectTable = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`/api/tables`, { headers: { Authorization: `Bearer ${token}` } });
      const tableNames = response.data;
      const message = `Select a table from the following:\n-------------------------\n${tableNames.join('\n')}`;
      const selected = window.prompt(message);
      if (!selected || !tableNames.includes(selected)) return;
      await axios.post(`/api/select-table`, { tableName: selected }, { headers: { Authorization: `Bearer ${token}` } });
      setTableName(selected);
      alert(`Current table set to ${selected}`);
    } catch (error) { alert('Error selecting table'); }
  };

  // --- R ANALYSIS LOGIC ---
  const handleRunRAnalysis = async () => {
    if (!rReady || !webRInstance) return;
    if (selectedColumns.size === 0) { alert("Please select columns first."); return; }
    setRLoading(true); setRResult(null); setRError(null);
    try {
      const token = await getAccessTokenSilently();
      const columnList = Array.from(selectedColumns);
      const res = await axios.post('/api/analyze-columns', { columns: columnList, limit: entryLimit }, { headers: { Authorization: `Bearer ${token}` } });
      const allData = res.data;
      const finalResults = {};
      const listContent = shellRows.filter(r => r.label.trim() && r.code.trim()).map(r => `\`${r.label}\` = ${r.code}`).join(', ');
      
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
        } catch (e) { finalResults[colName] = { success: false, error: "Non-numeric data" }; }
      }
      setRResult(finalResults);
    } catch (e) { setRError("Analysis failed."); } finally { setRLoading(false); }
  };

  // --- RENDERING: SECURITY GATES ---
  
  if (isLoading || authLoading) {
    return <div style={{ color: '#333', textAlign: 'center', marginTop: '50px' }}>Loading Database Permissions...</div>;
  }

  // Gate 1: Not Logged In
  if (!isAuthenticated) {
    return (
      <div style={{ color: '#333', textAlign: 'center', marginTop: '50px' }}>
        <h2>Access Denied</h2>
        <p>Please log in to view the database.</p>
        <button onClick={() => loginWithRedirect()} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#347ecc', color: 'white', border: 'none', borderRadius: '5px' }}>Log In</button>
      </div>
    );
  }

  // Gate 2: Logged In but Unauthorized
  if (!isAuthorized) {
    return (
      <div style={{ color: '#333', textAlign: 'center', marginTop: '50px' }}>
        <h2 style={{ color: '#b91c1c' }}>Unauthorized Access</h2>
        <p>Your account does not have permission to view this database.</p>
        <p>Please contact an administrator to request access.</p>
        <button onClick={() => logout()} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>Log Out</button>
      </div>
    );
  }

  // --- MAIN CONTENT (Authorized) ---
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
          <button className="select-button" onClick={handleSelectTable}> Select Table </button>
          
          <hr style={{width: '100%', margin: '15px 0', border: '0.5px solid #ddd'}} />
          
          <h3 style={{fontSize: '1rem', color: '#ca6767ff'}}>R Analysis Shell</h3>
          <p style={{fontSize: '0.7rem', marginBottom: '10px'}}>Use <b>vals</b> for the data vector</p>
          
          <div className="r-shell-container" style={{maxHeight: '200px', overflowY: 'auto', marginBottom: '10px', width: '100%'}}>
            {shellRows.map((row, index) => (
              <div key={index} style={{display: 'flex', gap: '5px', marginBottom: '5px', alignItems: 'flex-start'}}>
                <input 
                  placeholder="Label" 
                  style={{width: '35%'}} 
                  value={row.label} 
                  onChange={(e) => updateShellRow(index, 'label', e.target.value)} 
                />
                
                {/* Expandable R Code Area */}
                {row.expanded ? (
                  <textarea 
                    placeholder="R Code (Script)"
                    style={{
                      width: '55%', 
                      fontFamily: 'monospace', 
                      minHeight: '80px',
                      padding: '5px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      resize: 'vertical'
                    }}
                    value={row.code}
                    onChange={(e) => updateShellRow(index, 'code', e.target.value)}
                  />
                ) : (
                  <input 
                    placeholder="R Code" 
                    style={{width: '55%'}} 
                    value={row.code} 
                    onChange={(e) => updateShellRow(index, 'code', e.target.value)} 
                  />
                )}
                
                <button 
                  onClick={() => toggleShellRowExpand(index)} 
                  style={{
                    background: 'none', 
                    border: 'none', 
                    color: '#666', 
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    marginTop: '5px'
                  }}
                  title={row.expanded ? "Collapse" : "Expand for long script"}
                >
                  {row.expanded ? '▲' : '▼'}
                </button>

                <button 
                  onClick={() => removeShellRow(index)} 
                  style={{
                    background: 'none', 
                    border: 'none', 
                    color: 'red', 
                    cursor: 'pointer',
                    marginTop: '5px'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <button className="select-button" style={{fontSize: '0.8rem', padding: '5px'}} onClick={addShellRow}>+ Add Row</button>
          <button className="download-button" onClick={handleRunRAnalysis} disabled={!rReady || rLoading} style={{marginTop: '10px'}}>
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
                  marginBottom: "12px", width: "calc(100% - 15px)", marginLeft: "0", boxSizing: "border-box", 
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