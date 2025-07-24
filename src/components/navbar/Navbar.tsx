import { Link } from "react-router";
import { useState, useEffect } from "react";
import {
  Home,
  Timer,
  Trash2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { LogoutButton } from "../logoutButton/LogoutButton";
import "./Navbar.css";

const navItems = [
  { icon: Home, text: "Home", link: "/" },
  { icon: Timer, text: "Pomodoro", link: "/pomodoro" },
  { icon: Trash2, text: "Recycle Bin", link: "/recycle-bin" },
];

export const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(() => {
    const savedState = localStorage.getItem("navbarExpanded"); // aprovecho el localStorage para guardar el estado del navbar
    return savedState !== null ? JSON.parse(savedState) : true;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("navbarExpanded", JSON.stringify(isExpanded));
    document.body.style.setProperty(
      "--current-navbar-width",
      isExpanded
        ? "var(--navbar-expanded-width)"
        : "var(--navbar-collapsed-width)"
    );
  }, [isExpanded]);

  const toggleNavbar = () => setIsExpanded(!isExpanded);

  return (
    <nav
      className={`navbar ${
        isMobile ? "mobile" : isExpanded ? "expanded" : "collapsed"
      }`}
    >
      {!isMobile && (
        <button onClick={toggleNavbar} className="navbar-toggle">
          {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      )}

      <ul className="navbar-menu">
        {navItems.map((item, index) => (
          <li key={index} className="navbar-item">
            <Link to={item.link} className="navbar-link">
              <item.icon size={24} />
              {isExpanded && !isMobile && (
                <span className="navbar-text">{item.text}</span>
              )}
              {isMobile && (
                <span className="navbar-text-mobile">{item.text}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <div className="navbar-bottom">
        <div className="navbar-user">
          <User size={24} />
          {isExpanded && !isMobile && (
            <span className="navbar-text">Username</span>
          )}
        </div>
        <LogoutButton className="navbar-item navbar-logout">
          <LogOut size={24} />
          {isExpanded && !isMobile && (
            <span className="navbar-text">Logout</span>
          )}
          {isMobile && <span className="navbar-text-mobile">Logout</span>}
        </LogoutButton>
      </div>
    </nav>
  );
};
