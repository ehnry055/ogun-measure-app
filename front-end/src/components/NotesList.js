// front-end/src/components/NotesList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotesList = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Make GET request to fetch notes from backend
    axios.get('http://localhost:4000/api/notes')
      .then((response) => {
        setNotes(response.data); // Store data in state
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.contents}</p>
            <small>Created: {new Date(note.created).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesList;
