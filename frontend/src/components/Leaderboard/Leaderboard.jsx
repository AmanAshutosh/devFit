import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiTrophyLine,
  RiStarLine,
  RiFireLine,
  RiArrowUpLine,
} from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import "./Leaderboard.css";

const MEDAL_CONFIG = {
  1: { emoji: "🥇", cls: "lb-rank-gold", label: "Gold" },
  2: { emoji: "🥈", cls: "lb-rank-silver", label: "Silver" },
  3: { emoji: "🥉", cls: "lb-rank-bronze", label: "Bronze" },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -40, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", damping: 22, stiffness: 180 },
  },
  exit: { opacity: 0, x: 40, scale: 0.95, transition: { duration: 0.2 } },
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/user/leaderboard")
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const top5 = data?.leaderboard?.slice(0, 5) || [];
  const cu = data?.currentUser;

  return (
    <div className="lb-root">
      <div className="lb-header">
        <RiTrophyLine size={20} className="lb-header-icon" />
        <span className="lb-header-title">FitXP Leaderboard</span>
        <span className="lb-header-badge">Top 5</span>
      </div>

      {loading ? (
        <div className="lb-skeleton-list">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="lb-skeleton-row" />
          ))}
        </div>
      ) : (
        <motion.ul
          className="lb-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {top5.map((entry, i) => {
              const rank = i + 1;
              const medal = MEDAL_CONFIG[rank];
              const isCurrentUser =
                user?.username && entry.username === user.username;

              return (
                <motion.li
                  key={entry._id}
                  layoutId={`lb-entry-${entry._id}`}
                  layout
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                  className={`lb-card ${medal ? medal.cls : "lb-rank-other"} ${isCurrentUser ? "lb-card--me" : ""}`}
                >
                  <div className="lb-card-rank">
                    {medal ? (
                      <span className="lb-medal" aria-label={medal.label}>
                        {medal.emoji}
                      </span>
                    ) : (
                      <span className="lb-rank-num">#{rank}</span>
                    )}
                  </div>

                  <div className="lb-card-info">
                    <span className="lb-card-name">
                      {entry.name}
                      {isCurrentUser && (
                        <span className="lb-you-pill">YOU</span>
                      )}
                    </span>
                    <span className="lb-card-sub">
                      @{entry.username || "—"} · Lv.{entry.level || 1}
                      {entry.streak > 0 && (
                        <span className="lb-streak">
                          <RiFireLine size={11} /> {entry.streak}d
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="lb-card-xp">
                    <span className="lb-xp-val">
                      {(entry.totalFitXP || 0).toLocaleString()}
                    </span>
                    <span className="lb-xp-label">FitXP</span>
                  </div>

                  {rank === 1 && (
                    <motion.div
                      className="lb-glow-ring"
                      animate={{ opacity: [0.4, 0.9, 0.4] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      )}

      {!loading && cu && cu.xpToOvertake && cu.userAboveName && (
        <motion.div
          className="lb-motivation"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <RiArrowUpLine size={14} className="lb-motivation-icon" />
          <span>
            The next winner could be{" "}
            <strong>you, {user?.name?.split(" ")[0]}!</strong> Only{" "}
            <strong>{cu.xpToOvertake.toLocaleString()} FitXP</strong> to
            overtake <strong>{cu.userAboveName}</strong>.
          </span>
        </motion.div>
      )}

      {!loading && top5.length === 0 && (
        <div className="lb-empty">
          <RiStarLine size={28} />
          <p>Be the first on the leaderboard — log a workout!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
