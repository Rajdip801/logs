import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/header.css";
import "../style/tailwind.css";
import logo from "../assets/Big Logo.svg";
import slogo from "../assets/Shortlogo.svg";
import searchlogo from "../assets/search.svg";

export default function Header() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const navigate = useNavigate();

  const openNav = () => {
    setIsMenuActive(true);
  };

  const closeNav = () => {
    setIsMenuActive(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); // Redirect to login page
  };

  return (
    <>
      <div className="header">
        <div className="togglemenu">
          <button onClick={openNav} className="menu-btn" aria-label="Open Menu">
            ☰
          </button>
          <div id="mySidenav" className={`sidenav ${isMenuActive ? "active" : ""}`}>
            <a href="#" className="closebtn" onClick={closeNav} aria-label="Close Menu">
              ×
            </a>
            <a href="/">
              <img src={logo} alt="Company Logo" className="w-32" />
            </a>
            <a href="/dashboard/welcome">Home</a>
            <a href="/dashboard/stats">Stats</a>
            <a href="/dashboard/adscontrol">Adscontrol</a>
            <a href="/dashboard/thumbnails">Thumbcontrol</a>
            <button
              onClick={handleLogout}
              className="logout-btn mt-4 p-2 bg-amber-500 text-white rounded hover:bg-amber-600 text-left "
              style={{ border: "none", cursor: "pointer" }}
              aria-label="Log out"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="slogo">
          <a href="/">
            <img src={slogo} alt="Short Logo" className="w-16" />
          </a>
        </div>
        <div className="search">
          <div className="search-box">
            <button className="btn-search" aria-label="Search">
              <img src={searchlogo} alt="Search Icon" className="w-6 h-6" />
            </button>
            <input
              type="text"
              className="input-search"
              placeholder="Type to Search..."
              aria-label="Search"
            />
          </div>
        </div>
      </div>
      <div className="gap h-16"></div>
    </>
  );
}