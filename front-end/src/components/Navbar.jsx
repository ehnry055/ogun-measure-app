import "../styles/Navbar.css";
import columbiaLogo from "../assets/columbia-logo.svg"; // add your logo here

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Left: Columbia logo */}
        <div className="navbar-logo">
          <img
            src={columbiaLogo}
            alt="Columbia University"
          />
        </div>

        {/* Centered navigation */}
        <nav className="navbar-nav">
          <ul className="navbar-links">
            <li><a href="/">Home</a></li>
            <li><a href="/measure">Measure</a></li>
            <li><a href="/data">Data</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
