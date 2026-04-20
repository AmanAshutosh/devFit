import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import {
  RiDashboardLine,
  RiCalendarCheckLine,
  RiWeightLine,
  RiLeafLine,
  RiCapsuleLine,
  RiLineChartLine,
  RiYoutubeLine,
  RiUserLine,
  RiLogoutBoxRLine,
  RiFireLine,
  RiRestaurantLine,
  RiRunLine,
} from "react-icons/ri";
import "./Sidebar.css";

const NAV_ITEMS = [
  {
    path: "/dashboard",
    icon: RiDashboardLine,
    label: "Dashboard",
    mobileLabel: "Home",
  },
  {
    path: "/gym-plan",
    icon: RiCalendarCheckLine,
    label: "Gym Plan",
    mobileLabel: "Gym",
  },
  {
    path: "/exercises",
    icon: RiWeightLine,
    label: "Exercises",
    mobileLabel: "Workout",
  },
  { path: "/diet", icon: RiLeafLine, label: "Diet", mobileLabel: "Diet" },
  {
    path: "/supplements",
    icon: RiCapsuleLine,
    label: "Supplements",
    mobileLabel: "Supps",
  },
  {
    path: "/analytics",
    icon: RiLineChartLine,
    label: "Analytics",
    mobileLabel: "Stats",
  },
  { path: "/diet-plan", icon: RiRestaurantLine, label: "Diet Plan" },
  { path: "/workout-plan", icon: RiRunLine, label: "Workout Plan" },
  { path: "/videos", icon: RiYoutubeLine, label: "Videos" },
  { path: "/profile", icon: RiUserLine, label: "Profile" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <span>dev</span>
            <span className="sidebar-logo-fit">Fit</span>
          </div>
          <ThemeToggle />
        </div>

        {user && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user.name}</p>
              <p className="sidebar-user-handle">@{user.username}</p>
            </div>
          </div>
        )}

        {user?.streak > 0 && (
          <div className="sidebar-streak">
            <RiFireLine size={14} />
            {user.streak} day streak
          </div>
        )}

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link--active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <RiLogoutBoxRLine size={16} />
          <span>Log out</span>
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ path, icon: Icon, label, mobileLabel }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? "bottom-nav-item--active" : ""}`
            }
          >
            <Icon size={20} />
            <span>{mobileLabel || label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
