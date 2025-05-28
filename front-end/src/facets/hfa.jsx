import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import '../styles/HomePage.css'; 
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function HFA() {
    const pageId = "HealthyFoodAccess"; 
    const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
    const [isAuthorized, setIsAuthorized] = useState(() => {
        const initialState = false;
        return initialState;
      });
    useEffect(() => {
      const loadData = async () => {
        try {
          // runs for ALL users
          const response = await axios.get(`/api/ogun-pages/load?pageId=${pageId}`);

          if (response.data) {
            setTableData(response.data);
            setEditedData(response.data);
          }
        } catch (error) {
          setTableData(initialData);
          setEditedData(initialData);
        }
      }

      const checkAdminPermissions = async () => {
        if (!isAuthenticated) {
          setIsAuthorized(false);
          return;
        }
        try {
          const token = await getAccessTokenSilently();
          console.log("Access token:", token); // Log the token for debugging
          const decodedToken = jwtDecode(token);
          console.log("Decoded token:", decodedToken);
          const hasPermission = decodedToken.permissions && decodedToken.permissions.includes("adminView");
          console.log("Has permission:", hasPermission);
          setIsAuthorized(hasPermission);
        } catch (error) {
          console.error("Permission error", error);
        }
      }

      loadData();
      checkAdminPermissions();
    }, [isAuthenticated, getAccessTokenSilently]);


    const initialData = [
        [
          '',
          '',
          ''
        ],
        [
          '',
          '',
          ''
        ]
      ];
    
      const [tableData, setTableData] = useState(initialData);
      const [editedData, setEditedData] = useState(initialData);
      const [editMode, setEditMode] = useState(false);
    
      const handleChange = (row, col, value) => {
        setEditedData(prev => prev.map((r, rIdx) => 
          rIdx === row ? r.map((c, cIdx) => cIdx === col ? value : c) : r
        ));
      };
    
      const handleEdit = () => {
        setEditedData(JSON.parse(JSON.stringify(tableData))); // Deep copy to prevent live binding
        setEditMode(true);
      };
    
      const handleCancel = () => {
        setEditedData(JSON.parse(JSON.stringify(tableData))); // Reset edits
        setEditMode(false);
      };
    
      const handleSave = async () => {
        if (!window.confirm('Save changes?')) return;

        try {
          const token = await getAccessTokenSilently();
          
          await axios.post('/api/ogun-pages/save', 
            { pageId, tableData: editedData },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          setTableData(editedData);
          setEditMode(false);
          alert("Changes saved successfully!");
        } catch (error) {
          console.error('Save failed:', error);
          alert("Error saving changes to database");
        }
      };
    
      return (
        
        <div className="home-container">
          <h2 className="about-title">Healthy Food Access</h2>
          <div className="about-content">
            <table>
              <thead>
                <tr>
                  <th class="table-header-edit">
                  {isAuthorized && (
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
                {["Structural Violence", "Limited or Restricted Access"].map((rowTitle, rowIdx) => (
                    <tr key={rowTitle}>
                    <th>{rowTitle}</th>
                    {(editMode ? editedData : tableData)[rowIdx].map((cell, colIdx) => (
                        <td key={colIdx}>
                        {editMode ? (
                            <textarea
                            value={cell}
                            onChange={(e) => handleChange(rowIdx, colIdx, e.target.value)}
                            rows={4}
                            style={{ width: '100%' }}
                            />
                        ) : (
                            cell
                        )}
                        </td>
                    ))}
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
    
export default HFA;