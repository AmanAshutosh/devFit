import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { RiSunLine, RiMoonLine } from 'react-icons/ri';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle ${theme === 'dark' ? 'theme-toggle--dark' : ''}`}
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb" />
      </span>
      <span className="theme-toggle-icon">
        {theme === 'dark' ? <RiMoonLine size={14} /> : <RiSunLine size={14} />}
      </span>
    </button>
  );
};

export default ThemeToggle;
