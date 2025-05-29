import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotesList = ({ limit, selectedColumns, onToggleColumn, stateFilter }) => {
  const [notes, setNotes] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('limit', limit);
        if (stateFilter) {
          params.append('state', stateFilter); // send state filter to backend
        }
        
        const [notesRes, columnsRes] = await Promise.all([
          axios.get(`/api/notes?${params.toString()}`),
          axios.get(`/api/columns`)
        ]);
        
        setNotes(notesRes.data);
        setColumns(
          columnsRes.data
            .map(c => c.name)
            .filter(columnName => columnName !== 'id')
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [limit, stateFilter]);  // re-fetch when limit or filter changes

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="table-container">
      {notes.length === 0 ? (
        <div>No matching records found</div>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              {columns.map(column => (
                <th 
                  key={column} 
                  className={selectedColumns.has(column) ? 'selected' : ''}
                >
                  <div 
                    className="column-header" 
                    onClick={() => onToggleColumn(column)}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedColumns.has(column)} 
                      readOnly 
                    />
                    {column}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {notes.map(entry => (
              <tr key={entry.GISJOIN || entry.id || Math.random()}>
                {columns.map(column => (
                  <td 
                    key={column} 
                    className={selectedColumns.has(column) ? 'selected' : ''}
                  >
                    {entry[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NotesList;