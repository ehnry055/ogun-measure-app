import React from 'react';
import '../styles/EditDatabasePage.css'; // Import the CSS file for this page

const EditDatabasePage = () => {
  return (
    <div className="edit-database-container">
      <div className="left-section">
        <div className="profile-circle"></div>
        <p className="profile-name">John Doe</p>
        <div className="pie-chart"></div>
        <p className="chart-label">Lorem Ipsum</p>
      </div>

      <div className="data-section">
        <h2 className="section-title">Your Data</h2>
        {[1, 2, 3].map((item, index) => (
          <div className="data-item" key={index}>
            <h3>Lorem Ipsum</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna.
            </p>
            <div className="action-buttons">
              <button className="delete-button">Delete</button>
              <button className="edit-button">Edit</button>
            </div>
          </div>
        ))}
      </div>

      <div className="saved-section">
        <h2 className="section-title">Saved Users(3)</h2>
        <ul className="saved-users">
          <li>Gov_Attn</li>
          <li>Marine0123</li>
          <li>Abc321</li>
        </ul>

        <h2 className="section-title">Saved Graphs(2)</h2>
        {[1, 2].map((item, index) => (
          <div className="saved-graph" key={index}>
            <div className="pie-chart"></div>
            <h3>Lorem Ipsum</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditDatabasePage;
