import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotesList = ({ limit, selectedColumns, onToggleColumn }) => {
  const [notes, setNotes] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, columnsRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/notes?limit=${limit}`),
          axios.get('http://localhost:4000/api/columns')
        ]);
        
        setNotes(notesRes.data);
        setColumns(columnsRes.data.map(c => c.name));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [limit]);

  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            {columns.map(column => (
              <th 
                key={column}
                className={selectedColumns.has(column) ? 'selected' : ''}
              >
                <div className="column-header" onClick={() => onToggleColumn(column)}>
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
            <tr key={entry.GISJOIN}>
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
    </div>
  );
};

export default NotesList;
