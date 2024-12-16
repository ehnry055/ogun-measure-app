import React from 'react';
import '../styles/EditDatabasePage.css'; 

const EditUsers = () => {
    return (
      <div className="edit-database-container">
        <div className="saved-section">
            <h2 className="section-title">Registered Users</h2>
            <ul className="saved-users">
                <li>Jason Chae: jascha25@bergen.org</li>
                <li>Henry Choi: hencho25@bergen.org</li>
                <li>Stephen Yoon: steyoo25@bergen.org</li>
            </ul>
        </div>
        <div>
            <h>this is where user editing will occur</h>
        </div>
      </div>
    );
  };
  
  export default EditUsers;
  