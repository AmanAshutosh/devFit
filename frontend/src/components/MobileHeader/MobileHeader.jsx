import React from "react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { RiFireLine } from "react-icons/ri";
import "./MobileHeader.css";

const MobileHeader = () => {
  const { user } = useAuth();
  return (
    <header className="mobile-header">
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
