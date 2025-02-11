import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotesList = ({ limit }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/notes?limit=${limit}`) // passing limit to the API
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error('error fetching data:', error);
      });
  }, [limit]);

  return (
    <div>
      <ul>
        {notes.map((entry) => (
          <li key={entry.GISJOIN}>
            <h2>{entry.STATE}, {entry.ALLCOUNTIES}</h2> 
            <p>STATEICP: {entry.STATEICP}</p>
            <p>STATEFIPS: {entry.STATEFIPS}</p>
            <p>COUNTYFIPS: {entry.COUNTYFIPS}</p>
            <p>RSG_SV1: {entry.RSG_SV1}</p>
            <p>GR_SV1: {entry.GR_SV1}</p>
            <p>HFA_SV2: {entry.HFA_SV2}</p>
            <p>MM_LRA1: {entry.MM_LRA1}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesList;