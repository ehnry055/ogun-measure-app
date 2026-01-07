import "../styles/Navbar.css";
import columbiaLogo from "../assets/columbia-logo.svg";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* Left: Columbia logo */}
        <div className="navbar-left">
          <img
            src={columbiaLogo}
            alt="Columbia University"
            className="navbar-logo"
          />
        </div>

        {/* Center: navigation buttons (UNCHANGED functionality) */}
        <nav className="navbar-center">
          <ul className="navbar-links">
            <li><a href="/">Home</a></li>
            <li><a href="/measure">Measure</a></li>
            <li><a href="/data">Data</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>

        {/* Right: Login */}
        <div className="navbar-right">
          <a href="/login" className="login-button">Login</a>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
