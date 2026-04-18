import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { RiFireLine, RiArrowLeftLine } from "react-icons/ri";
import "./MobileHeader.css";

const MobileHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="mobile-header">
      <button className="mobile-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
        <RiArrowLeftLine size={20} />
      </button>
      <div className="mobile-header-brand">
        dev<span>Fit</span>
      </div>
      <div className="mobile-header-right">
        {user?.streak > 0 && (
          <div className="mobile-streak">
            <RiFireLine size={13} />
            {user.streak}d
          </div>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default MobileHeader;
