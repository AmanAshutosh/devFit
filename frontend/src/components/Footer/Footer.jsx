import React from "react";
import { RiHeartFill, RiWeightLine } from "react-icons/ri";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <RiWeightLine size={14} className="footer-gym-icon" />
    <span>Made with</span>
    <RiHeartFill size={12} className="footer-heart" />
    <span>
      by <strong>Ashutosh</strong>
    </span>
    <span className="footer-dot">·</span>
    <span className="footer-brand">devFit</span>
  </footer>
);

export default Footer;
