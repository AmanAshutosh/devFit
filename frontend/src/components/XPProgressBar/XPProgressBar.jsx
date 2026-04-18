import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { RiStarLine, RiArrowUpLine } from "react-icons/ri";
import "./XPProgressBar.css";

const LEVEL_THRESHOLDS = [0, 500, 1500, 3000, 5500, 9000, 14000, 21000, 30000, 42000];
const LEVEL_TITLES = [
  "", "Rookie", "Iron", "Bronze", "Silver", "Gold",
  "Platinum", "Diamond", "Master", "Legend", "GOAT",
];

function getXPProgress(totalXP) {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  level = Math.min(level, 10);
  const currentFloor = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextCeiling = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpIntoLevel = totalXP - currentFloor;
  const xpForLevel = nextCeiling - currentFloor;
  const percent = level >= 10 ? 100 : Math.min(100, (xpIntoLevel / xpForLevel) * 100);
  return { level, title: LEVEL_TITLES[level], xpIntoLevel, xpForLevel, percent, nextCeiling };
}

const XPProgressBar = ({ totalFitXP = 0 }) => {
  const controls = useAnimation();
  const { level, title, xpIntoLevel, xpForLevel, percent } = getXPProgress(totalFitXP);

  useEffect(() => {
    controls.start({
      width: `${percent}%`,
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
    });
  }, [percent, controls]);

  return (
    <div className="xpbar-root">
      <div className="xpbar-top">
        <div className="xpbar-level-badge">
          <RiStarLine size={13} />
          <span>Level {level}</span>
        </div>
        <span className="xpbar-title">{title}</span>
        <span className="xpbar-total">{totalFitXP.toLocaleString()} FitXP</span>
      </div>

      <div className="xpbar-track">
        <motion.div
          className="xpbar-fill"
          initial={{ width: "0%" }}
          animate={controls}
        >
          <div className="xpbar-shimmer" />
        </motion.div>
      </div>

      <div className="xpbar-bottom">
        <span>{xpIntoLevel.toLocaleString()} XP into this level</span>
        {level < 10 ? (
          <span className="xpbar-next">
            <RiArrowUpLine size={11} />
            {(xpForLevel - xpIntoLevel).toLocaleString()} XP to Level {level + 1}
          </span>
        ) : (
          <span className="xpbar-next">Maximum level reached!</span>
        )}
      </div>
    </div>
  );
};

export default XPProgressBar;
