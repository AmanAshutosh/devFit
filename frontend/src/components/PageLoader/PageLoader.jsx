import React, { useEffect, useState } from "react";
import "./PageLoader.css";

const PHRASES = ["LOADING", "WARMING UP", "GETTING GAINS", "ALMOST THERE"];

const PageLoader = ({ show }) => {
  const [progress, setProgress] = useState(0);
  const [phrase, setPhrase] = useState(PHRASES[0]);
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) {
      setProgress(100);
      const t = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(t);
    }
    setVisible(true);
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 12 + 3;
      if (p >= 90) {
        p = 90;
        clearInterval(interval);
      }
      setProgress(p);
      setPhrase(PHRASES[Math.floor((p / 90) * (PHRASES.length - 1))]);
    }, 80);
    return () => clearInterval(interval);
  }, [show]);

  if (!visible) return null;

  return (
    <div className={`page-loader ${!show ? "page-loader--exit" : ""}`}>
      <div className="page-loader-inner">
        <div className="page-loader-logo">
          dev<span>Fit</span>
        </div>
        <div className="page-loader-bar-wrap">
          <div className="page-loader-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="page-loader-meta">
          <span className="page-loader-phrase">{phrase}</span>
          <span className="page-loader-num">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
