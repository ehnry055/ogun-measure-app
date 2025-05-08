import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import '../styles/HomePage.css'; 
import { jwtDecode } from 'jwt-decode';

// function PO({isAdmin}) change to this later
function PO({}) {
    // const isAdmin = true;
    const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
    const [isAuthorized, setIsAuthorized] = useState(() => {
        const initialState = false;
        return initialState;
      });
    useEffect(() => {
        const checkPermissions = async () => {
          try {
            const token = await getAccessTokenSilently();
            console.log("Access token:", token); // Log the token for debugging
            const decodedToken = jwtDecode(token);
            console.log("Decoded token:", decodedToken);
    
            const hasPermission = decodedToken.permissions && decodedToken.permissions.includes("adminView");
            console.log("Has permission:", hasPermission);
    
            if (!hasPermission) {
              console.log("User does not have the required permission");
            }
            else {
              console.log("changed isAuthorized to true");
              setIsAuthorized(true);
            }
          } catch (error) {
            console.error('Error checking permissions:', error);
          }
        };
    
        checkPermissions();
      }, [isAuthenticated, getAccessTokenSilently]);
    // const isAuthorized = isAuthenticated && user && user['https://your-app.com/roles']?.includes('adminView');

    // temp check
    //const isAuthorized = isAuthenticated && user?.email === 'bwan70707@gmail.com';


    const initialData = [
        [
          'Counties with a known revolts, race riots, uprisings, and other violent events between 1526-1969',
          'Counties with a highway known to have dislocated a neighborhood with predominantly residents racialized as Black between 1990-2000',
          'Counties with higher-than-the-median national occupied housing units with severe housing problems AND higher than residents racialized as Black between 2016-2020'
        ],
        [
          'Counties with a known history of redlining or sundowning practices before 1970',
          'Counties where the proportion of residents racialized as White was greater than the national proportion for 2 or more of decennial years between 1970-2000',
          'Counties where the proportion of residents racialized as White was greater than the national proportion for 2010 and 2020 or 2020 only'
        ]
      ];
    
      const [tableData, setTableData] = useState(initialData);
      const [editedData, setEditedData] = useState(initialData);
      const [editMode, setEditMode] = useState(false);
    
      const handleChange = (row, col, value) => {
        const updated = [...editedData];
        updated[row][col] = value;
        setEditedData(updated);
      };
    
      const handleEdit = () => {
        setEditedData(JSON.parse(JSON.stringify(tableData))); // Deep copy to prevent live binding
        setEditMode(true);
      };
    
      const handleCancel = () => {
        setEditedData(JSON.parse(JSON.stringify(tableData))); // Reset edits
        setEditMode(false);
      };
    
      const handleSave = () => {
        if (window.confirm('Are you sure you want to save your changes?')) {
          setTableData(editedData);
          setEditMode(false);
          // Maybe add API save call here
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
                  {isAuthorized && (
                    <div className="admin-controls" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                <tr>
                  <th>Structural Violence</th>
                  {(editMode ? editedData : tableData)[0].map((cell, col) => (
                    <td key={col}>
                      {editMode ? (
                        <textarea
                          value={cell}
                          onChange={(e) => handleChange(0, col, e.target.value)}
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Limited or Restricted Access</th>
                  {(editMode ? editedData : tableData)[1].map((cell, col) => (
                    <td key={col}>
                      {editMode ? (
                        <textarea
                          value={cell}
                          onChange={(e) => handleChange(1, col, e.target.value)}
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
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


    // const [tableData, setTableData] = useState([
    //     [
    //       "Counties with a known revolts, race riots, uprisings, and other violent events between 1526-1969",
    //       "Counties with a highway known to have dislocated a neighborhood with predominantly residents racialized as Black between 1990-2000",
    //       "Counties with higher-than-the-median national occupied housing units with severe housing problems AND higher than residents racialized as Black between 2016-2020"
    //     ],
    //     [
    //       "Counties with a known history of redlining or sundowning practices before 1970",
    //       "Counties where the proportion of residents racialized as White was greater than the national proportion for 2 or more of decennial years between 1970-2000",
    //       "Counties where the proportion of residents racialized as White was greater than the national proportion for 2010 and 2020 or 2020 only"
    //     ]
    //   ]);
    
    //   const handleChange = (row, col, value) => {
    //     const updated = [...tableData];
    //     updated[row][col] = value;
    //     setTableData(updated);
    //   };
    
    //   const saveChanges = () => {
    //     // Example: Post the data to an API
    //     fetch('/api/save-table', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(tableData),
    //     }).then(res => {
    //       if (res.ok) alert('Saved!');
    //       else alert('Failed to save');
    //     });
    //   };
    
    //   return (
    //     <div className="home-container">
    //       <h2 className="about-title">Property Ownership</h2>
    //       <div className="about-content">
    //         <table>
    //           <thead>
    //             <tr>
    //               <th>            
    //                 {isAdmin && <button onClick={saveChanges}>Save Changes</button>}
    //               </th>
    //               <th>Historical Period 1<br />Pre-Civil Rights<br />1619-1968</th>
    //               <th>Historical Period 2<br />Desegregation<br />1969-1999</th>
    //               <th>Historical Period 3<br />Modern Times<br />2000-present</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {["Structural Violence", "Limited or Restricted Access"].map((rowTitle, rowIdx) => (
    //               <tr key={rowTitle}>
    //                 <th>{rowTitle}</th>
    //                 {tableData[rowIdx].map((cell, colIdx) => (
    //                   <td key={colIdx}>
    //                     {isAdmin ? (
    //                       <textarea
    //                         value={cell}
    //                         onChange={(e) => handleChange(rowIdx, colIdx, e.target.value)}
    //                         rows={4}
    //                         style={{ width: '100%' }}
    //                       />
    //                     ) : (
    //                       cell
    //                     )}
    //                   </td>
    //                 ))}
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //         <div className="container">
    //           <a href="/gateway" className="homebtn"><span> See Measure </span></a>
    //           <a href="/viewdata" className="homebtn"><span> Generate Data </span></a>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }
    
export default PO;