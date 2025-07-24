import { Link } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import axiosInstance from "../../config/axios";
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

  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const auth = useAuth();

  const fetchUsername = async () => {
    try {
      const firebaseUID = auth?.currentUser?.uid;
      if (!firebaseUID) {
        throw new Error("User is not authenticated");
      }
      const response = await axiosInstance.get(
        `http://localhost:3000/api/users/${firebaseUID}`
      );
      setUsername(response.data.data?.username || "username");
      console.debug("Data fetched successfully.");
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error("Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchUsername();
  }, []);

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
          {loading && "Loading..."}
          {error && "Error fetching username"}
          {isExpanded && !isMobile && (
            <span className="navbar-text">{username}</span>
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
