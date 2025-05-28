import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import profile from '../components/profile';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ProfilePage = () => {

    return (
        <div>
            <profile />
        </div>
    );
}

export default ProfilePage;