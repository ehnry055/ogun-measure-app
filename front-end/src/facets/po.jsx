import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import '../styles/HomePage.css'; 
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function PO() {
    const pageId = "PropertyOwnership"; 
    const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(() => {
        const initialState = false;
        return initialState;
      });
    useEffect(() => {
      if (isLoading) return;        // wait until Auth0 is ready
      if (!isAuthenticated) {
        navigate("/unauthorized");
        return;
      }

      const checkPermissions = async () => {
        try {
          const token = await getAccessTokenSilently();
          console.log("Access token:", token); 
          const decodedToken = jwtDecode(token);
          console.log("Decoded token:", decodedToken);
  
          const hasPermission = decodedToken.permissions && decodedToken.permissions.includes("adminView");
          console.log("Has permission:", hasPermission);
  
          if (!hasPermission) {
            console.log("User does not have the required permission");
            navigate("/unauthorized");
          }
          else {
            console.log("changed isAdmin to true");
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking permissions:', error);
          navigate("/unauthorized");
        }
      };
  
      checkPermissions();


        // fetch(`/api/ogun-pages/load?pageId=${pageId}`)
        // .then(res => res.json())
        // .then(data => setTableData(data))
        // .catch(err => console.error(err));


      }, [isAuthenticated, getAccessTokenSilently, navigate]);


    const initialData = [
        [
          'Counties where the value of all farmland/buildings owned by people racialized as Colored were less than 75% the value of all farmland/buildings owned by people racialized as White in 1930',
          'Counties where there is greater house value for properties owned by people racialized as White compared to people racialized as Black in 1980',
          'Counties with an anti-ski masklaw and/or a Crown Act law'
        ],
        [
          'Counties where the proportion of farm owners racialized as White was above the national proportion of residents racialized as White in 1930',
          'Counties where the owneroccupied units by residents racialized as Black decreased by 1% or more from 1990 to 2000',
          'Counties where the average proportion of residents racialized as Black denied a home loan is above the national average, from 2010 to 2017'
        ]
      ];
    
      let [tableData, setTableData] = useState([initialData]);
      let [editedData, setEditedData] = useState([initialData.map(r=>[...r])]);
      let [editMode, setEditMode] = useState(false);

      useEffect(() => {
        async function load() {
          let token = await getAccessTokenSilently();
          let resp = await fetch(`/api/ogun-pages/load?pageId=${pageId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          let entries = await resp.json();
          setTableData(entries);
          setEditedData(entries.map(e => ({ ...e })));
        }
        load();
      }, [getAccessTokenSilently]);
    
      let handleChange = (id, value) => {
        let updated = editedData.map(e =>
          e.id === id ? { ...e, content: value } : e
        );
        setEditedData(updated);
      };
    
      const handleEdit = () => {
        setEditedData(JSON.parse(JSON.stringify(tableData))); 
        setEditMode(true);
      };
    
      const handleCancel = () => {
        setEditedData(JSON.parse(JSON.stringify(tableData)));
        setEditMode(false);
      };
    
      let handleSave = async () => {
        
        if (!window.confirm('Save changes?')) return;
        const token = await getAccessTokenSilently();
        let resp = await fetch('/api/ogun-pages/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Add the Authorization header
          },
          body: JSON.stringify({ pageId, updates: editedData })
        });

        if (resp.ok) {
          setTableData(editedData);
          setEditMode(false);
          alert('Saved!');
        } else {
          alert('Save failed');
        }
      };
    
      return (
        
        <div className="home-container">
          <h2 className="about-title">Property Ownership</h2>
          <div className="about-content">
            <table>
              <thead>
                <tr>
                  <th class="table-header-edit">
                  {isAdmin && (
                    <div className="admin-controls" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        {!editMode ? (
                        <button onClick={handleEdit} className="edit-icon-btn">
                            <Pencil size={24}/>
                        </button>
                        ) : (
                        <>
                            <button onClick={handleSave} className="save" style={{ marginBottom: '10px' }}>Save Changes</button>
                            <button onClick={handleCancel} className="cancel" >Cancel</button>
                        </>
                        )}
                    </div>
                    )}
                  </th>
                  <th>Historical Period 1<br /> Pre-Civil Rights <br />1619-1968</th>
                  <th>Historical Period 2<br /> Desegregation <br />1969-1999</th>
                  <th>Historical Period 3<br /> Modern Times <br />2000-present</th>
                </tr>
              </thead>
              <tbody>
                {[0,1].map(rowIdx => (
                  <tr key={rowIdx}>
                    <th>{ rowIdx === 0 ? 'Structural Violence' : 'Limited or Restricted Access' }</th>
                    {[0,1,2].map(colIdx => {
                      const source = editMode ? editedData : tableData;
                      const entry  = source.find(e =>
                        e.rowIndex === rowIdx && e.colIndex === colIdx
                      );
                      const text   = entry?.content ?? "";  //  safe default
                      const id     = entry?.id;             // may be undefined pre-load
                      return (
                        <td key={colIdx}>
                          {editMode
                            ? <textarea
                                value={text}
                                onChange={e => id && handleChange(id, e.target.value)}
                                rows={4}
                                style={{ width: '100%' }}
                              />
                            : text
                          }
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="container">
              <a href="/gateway" className="homebtn"><span> See Measure </span></a>
              <a href="/viewdata" className="homebtn" id="gendata"><span> Generate Data </span></a>
            </div>
          </div>
        </div>
      );
    }
    
export default PO;