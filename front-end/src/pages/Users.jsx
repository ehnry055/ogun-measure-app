import React from 'react';
import '../styles/HomePage.css'; 
import Profile from '../components/profile'

function Users() {
    return (
        <div>
            <div>User profile picture should show up, not working on firefox :/</div>
            <Profile />
        </div>
    );
};

export default Users;