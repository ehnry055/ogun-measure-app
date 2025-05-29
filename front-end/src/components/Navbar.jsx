import React from 'react';
import '../styles/Navbar.css'; 
import '../styles/LoginLogout.css'; 
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './login';
import LogoutButton from './logout';
import { Dropdown } from 'react-bootstrap'; // Add this import
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS bundle


//CURRENT BUG: the log out button disappears when navigating to another page, i think isauthenticated isn't updated every time? confusing

function Navbar() {
  const { isLoading, error, user, loginWithRedirect, logout } = useAuth0();
  return (
    <nav class="navbar navbar-expand-lg navbar-light navbar-gradient sticky-top">
      <div className="container-fluid">
      <a class="navbar-brand" href="/">Ogun Database</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="/">Home {/* <span class="sr-only">(current)</span>*/}</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/gateway">Measure</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/viewdata">View Data</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/changedata">Upload/Delete Data</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/map">Map Display</a>
          </li>
          {/*
          <li class="nav-item">
            <a class="nav-link" href="/graphs">Graphs</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/users">Users</a>
          </li>
          */}
          {/* <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" href="#">Disabled</a>
          </li> */}
        </ul>
      {/*<form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"> 
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button> 
      </form> */}
      <div className="navbar-nav ms-auto" style={{minHeight: '50px'}}>
        <div className="tba">
          {error && <p>Authentication Error</p>}
          {!error && isLoading &&  <p>Loading...</p>}  
          {!error && !isLoading && (
            <>
              <LoginButton/>
              {/* <LogoutButton/> */}
            </>
          )}
          
          {/* If logged in, show profile icon with dropdown */}
          {!error && !isLoading && user && (
                <Dropdown alignRight>
                  <Dropdown.Toggle variant="success" id="dropdown-profile" className="custom-dropdown-toggle">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="rounded-circle"
                      width="30"
                      height="30"
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="custom-dropdown-menu">
                    <Dropdown.Item href="/profile" className="custom-dropdown-item">Profile</Dropdown.Item>
                    <Dropdown.Item href="/requests" className="custom-dropdown-item">Requests</Dropdown.Item>
                    {/*}
                    <Dropdown.Item href="/settings" className="custom-dropdown-item">Settings</Dropdown.Item>
                    */}
                    <Dropdown.Item href="/users" className="custom-dropdown-item">User Manage</Dropdown.Item>
                    <Dropdown.Item className="custom-dropdown-item" onClick={() => logout({ returnTo: window.location.origin })}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
        </div>
      </div>
      </div>
    </div>
  </nav>

  );
};
    
    
    
    
    
    
    
  {/** 
    <div className="top-navbar">
     <div className="navbar-left">
       <img
          src=
          alt="Logo"
          className="logo"
        />
        <span className="title">Placeholder</span>
        <span className="subtitle">Racism Data System</span>
      </div>
      <div className="navbar-center">
        <nav className="nav-links">
          <a href="/" className="nav-link">🏠 Home</a>
          <a href="/users" className="nav-link">👤 Users</a>
          <a href="/data" className="nav-link">📁 Data</a>
          <a href="/graphs" className="nav-link">📊 Graphs</a>
        </nav>
      </div>
      <div className="navbar-right">
        <input type="text" className="search-bar" placeholder="Search..." />
        <div className="tba">
          {error && <p>Authentication Error</p>}
          {!error && isLoading &&  <p>Loading</p>}  
           loading is a placeholder, replace with an animation! 
          {!error && !isLoading && (
            <>
              <LoginButton />
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </div>
        */}



export default Navbar;
