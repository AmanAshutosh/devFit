import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  RiWeightLine,
  RiFireLine,
  RiArrowRightLine,
  RiLeafLine,
  RiDropLine,
  RiMoonLine,
  RiAddLine,
  RiLineChartLine,
  RiCheckLine,
  RiRestTimeLine,
} from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import Footer from "../../components/Footer/Footer";
import { formatDate, todayISO } from "../../utils/helpers";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import "./Dashboard.css";

// ── Animation presets ───────────────────────────────────────────────────────
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// ── Motivational quotes ──────────────────────────────────────────────────────
const QUOTES = [
  { text: "The only bad workout is the one that didn't happen." },
  { text: "Push yourself, because no one else is going to do it for you." },
  { text: "Your body can stand almost anything. It's your mind you have to convince." },
  { text: "Success starts with self-discipline." },
  { text: "The pain you feel today will be the strength you feel tomorrow." },
  { text: "Don't stop when you're tired. Stop when you're done." },
  { text: "Wake up with determination. Go to bed with satisfaction." },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "It never gets easier, you just get stronger." },
  { text: "Train insane or remain the same." },
  { text: "Strive for progress, not perfection." },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "A one hour workout is 4% of your day. No excuses." },
  { text: "Every champion was once a contender who refused to give up." },
  { text: "Be stronger than your strongest excuse." },
  { text: "Your only limit is you." },
  { text: "The body achieves what the mind believes." },
  { text: "Discipline is doing what needs to be done even when you don't want to." },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "Results happen over time, not overnight. Work hard, stay consistent." },
  { text: "What seems impossible today will become your warm-up tomorrow." },
  { text: "Hustle for that muscle." },
  { text: "Your health is an investment, not an expense." },
  { text: "Motivation gets you started. Habit keeps you going." },
  { text: "If you're tired of starting over, stop giving up." },
  { text: "You are one workout away from a good mood." },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Once you see results, it becomes an addiction." },
  { text: "Good things come to those who sweat." },
  { text: "Excuses don't burn calories." },
  { text: "You've survived 100% of your worst days so far." },
  { text: "Every rep counts. Every set matters. Every session is progress." },
  { text: "Fitness is a journey, not a destination." },
  { text: "Abs are built in the kitchen, sculpted in the gym." },
  { text: "Sore today, strong tomorrow." },
  { text: "Fall in love with taking care of your body." },
];

const GRADIENTS = [
  { bg: "linear-gradient(135deg,#667eea,#764ba2)", text: "#fff" },
  { bg: "linear-gradient(135deg,#f093fb,#f5576c)", text: "#fff" },
  { bg: "linear-gradient(135deg,#4facfe,#00f2fe)", text: "#fff" },
  { bg: "linear-gradient(135deg,#43e97b,#38f9d7)", text: "#1a3a2a" },
  { bg: "linear-gradient(135deg,#fa709a,#fee140)", text: "#3a1a00" },
  { bg: "linear-gradient(135deg,#a18cd1,#fbc2eb)", text: "#2a1040" },
  { bg: "linear-gradient(135deg,#f6d365,#fda085)", text: "#3a1a00" },
  { bg: "linear-gradient(135deg,#89f7fe,#66a6ff)", text: "#0a1040" },
  { bg: "linear-gradient(135deg,#d4fc79,#96e6a1)", text: "#1a3a1a" },
  { bg: "linear-gradient(135deg,#fddb92,#d1fdff)", text: "#1a2a3a" },
];

const getDailyIndex = (arr) => {
  const now = new Date();
  const day = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  return day % arr.length;
};

// ── Sub-components ───────────────────────────────────────────────────────────
const QuoteCard = () => {
  const q = QUOTES[getDailyIndex(QUOTES)];
  const g = GRADIENTS[getDailyIndex(GRADIENTS)];
  return (
    <div className="dash-quote-card" style={{ background: g.bg, color: g.text }}>
      <div className="dash-quote-mark">"</div>
      <p className="dash-quote-text">{q.text}</p>
      {q.author && <p className="dash-quote-author">— {q.author}</p>}
    </div>
  );
};

const SummaryBento = ({ totalExercises, streak }) => (
  <motion.div
    className="bento-grid bento-grid--2"
    variants={stagger}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={fadeUp} className="bento-card">
      <div className="bento-icon"><RiWeightLine size={20} /></div>
      <div className="bento-value">{totalExercises ?? "—"}</div>
      <div className="bento-label">Total Exercises</div>
      <div className="bento-sub">all time</div>
    </motion.div>
    <motion.div variants={fadeUp} className="bento-card bento-card--dark">
      <div className="bento-icon"><RiFireLine size={20} /></div>
      <div className="bento-value">{streak ?? 0}d</div>
      <div className="bento-label">Streak</div>
      <div className="bento-sub">keep it up!</div>
    </motion.div>
  </motion.div>
);

// Horizontal scroll card
const ScrollCard = ({ children, onClick, linkTo, accent }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onClick) onClick();
    else if (linkTo) navigate(linkTo);
  };
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="dash-scroll-card"
      style={accent ? { borderTop: `3px solid ${accent}` } : {}}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {children}
    </motion.div>
  );
};

// Water intake mini-widget inside scroll card
const WaterCard = ({ totalMl, goalMl, glassSize, onAdd }) => {
  const pct = Math.min(100, Math.round((totalMl / goalMl) * 100));
  const glasses = Math.round(totalMl / glassSize);
  return (
    <ScrollCard accent="#4facfe">
      <div className="dash-sc-header">
        <RiDropLine size={18} className="dash-sc-icon" style={{ color: "#4facfe" }} />
        <span className="dash-sc-title">Water</span>
        <button
          className="dash-sc-add-btn"
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          title="Add a glass"
        >
          <RiAddLine size={14} />
        </button>
      </div>
      <div className="dash-sc-big">{(totalMl / 1000).toFixed(1)}L</div>
      <div className="dash-sc-sub">{glasses} glasses · goal {(goalMl / 1000).toFixed(1)}L</div>
      <div className="dash-sc-bar-wrap">
        <div className="dash-sc-bar" style={{ width: `${pct}%`, background: "#4facfe" }} />
      </div>
      <div className="dash-sc-pct">{pct}%</div>
    </ScrollCard>
  );
};

// Sleep mini-widget
const SleepCard = ({ hours, quality, onLog }) => {
  const qualityColor = { poor: "#e53e3e", fair: "#dd6b20", good: "#38a169", excellent: "#3182ce" };
  return (
    <ScrollCard accent="#a18cd1" onClick={onLog}>
      <div className="dash-sc-header">
        <RiMoonLine size={18} className="dash-sc-icon" style={{ color: "#a18cd1" }} />
        <span className="dash-sc-title">Sleep</span>
      </div>
      {hours != null ? (
        <>
          <div className="dash-sc-big">{hours}h</div>
          <div className="dash-sc-sub" style={{ color: qualityColor[quality] || "var(--text-muted)" }}>
            {quality}
          </div>
        </>
      ) : (
        <>
          <div className="dash-sc-big" style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}>—</div>
          <div className="dash-sc-sub">Tap to log</div>
        </>
      )}
      <div className="dash-sc-hint">Last night</div>
    </ScrollCard>
  );
};

// Diet summary mini-widget
const DietCard = ({ calories, protein, calorieGoal }) => {
  const pct = Math.min(100, Math.round((calories / calorieGoal) * 100));
  return (
    <ScrollCard accent="#43e97b" linkTo="/diet">
      <div className="dash-sc-header">
        <RiLeafLine size={18} className="dash-sc-icon" style={{ color: "#43e97b" }} />
        <span className="dash-sc-title">Diet</span>
        <RiArrowRightLine size={13} className="dash-sc-arrow" />
      </div>
      <div className="dash-sc-big">{Math.round(calories)} kcal</div>
      <div className="dash-sc-sub">{Math.round(protein)}g protein · goal {calorieGoal}</div>
      <div className="dash-sc-bar-wrap">
        <div className="dash-sc-bar" style={{ width: `${pct}%`, background: "#43e97b" }} />
      </div>
      <div className="dash-sc-pct">{pct}%</div>
    </ScrollCard>
  );
};

// Analytics card
const AnalyticsCard = ({ workoutDays, calorieAvg }) => (
  <ScrollCard accent="#f6d365" linkTo="/analytics">
    <div className="dash-sc-header">
      <RiLineChartLine size={18} className="dash-sc-icon" style={{ color: "#f6d365" }} />
      <span className="dash-sc-title">Analytics</span>
      <RiArrowRightLine size={13} className="dash-sc-arrow" />
    </div>
    <div className="dash-sc-big">{workoutDays ?? 0}d</div>
    <div className="dash-sc-sub">workouts this month</div>
    {calorieAvg > 0 && (
      <div className="dash-sc-hint">{Math.round(calorieAvg)} kcal avg/day</div>
    )}
  </ScrollCard>
);

// ── Sleep log modal ──────────────────────────────────────────────────────────
const SleepModal = ({ onClose, onSave }) => {
  const [hours, setHours] = useState(7);
  const [quality, setQuality] = useState("good");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(hours, quality);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="dash-modal-title"><RiMoonLine size={16} /> Log Sleep</h3>
        <div className="form-group">
          <label className="form-label">Hours slept</label>
          <input
            className="form-input"
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Quality</label>
          <select
            className="form-select"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          >
            {["poor", "fair", "good", "excellent"].map((q) => (
              <option key={q} value={q}>
                {q.charAt(0).toUpperCase() + q.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="dash-modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <RiCheckLine size={14} /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [todayExercises, setTodayExercises] = useState([]);
  const [todayDiet, setTodayDiet] = useState(null);
  const [water, setWater] = useState({ totalMl: 0, goalMl: 2500, glassSize: 250 });
  const [sleep, setSleep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSleepModal, setShowSleepModal] = useState(false);

  const today = todayISO();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [a, e, d, w, s] = await Promise.allSettled([
        api.get("/analytics/overview?days=30"),
        api.get(`/exercise?date=${today}&limit=5`),
        api.get(`/diet?date=${today}`),
        api.get(`/water?date=${today}`),
        api.get(`/sleep?date=${today}`),
      ]);

      if (a.status === "fulfilled") setAnalytics(a.value.data);
      if (e.status === "fulfilled") setTodayExercises(e.value.data.exercises || []);
      if (d.status === "fulfilled") setTodayDiet(d.value.data.diet || null);
      if (w.status === "fulfilled") setWater(w.value.data);
      if (s.status === "fulfilled") setSleep(s.value.data.log || null);
    } catch {
      // silently continue — partial data is fine
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAddWater = async () => {
    try {
      const { data } = await api.post("/water/add", {
        date: today,
        ml: water.glassSize,
      });
      setWater({ totalMl: data.totalMl, goalMl: data.goalMl, glassSize: data.glassSize });
    } catch {
      // no-op
    }
  };

  const handleSaveSleep = async (hours, quality) => {
    const { data } = await api.post("/sleep", { date: today, hours, quality });
    setSleep(data.log);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Calorie goal derived from user profile (simple TDEE estimation)
  const calorieGoal = (() => {
    if (!user?.weight || !user?.age) return 2200;
    const heightCm = user.heightFeet
      ? user.heightFeet * 30.48 + (user.heightInches || 0) * 2.54
      : 170;
    // Mifflin-St Jeor (male default, ×1.55 moderate activity)
    const bmr = 10 * user.weight + 6.25 * heightCm - 5 * user.age + 5;
    return Math.round(bmr * 1.55 / 50) * 50; // round to nearest 50
  })();

  const calorieAvg = (() => {
    if (!analytics?.calorieHistory?.length) return 0;
    const sum = analytics.calorieHistory.reduce((s, d) => s + (d.calories || 0), 0);
    return sum / analytics.calorieHistory.length;
  })();

  return (
    <div className="page-layout">
      <Sidebar />
      <MobileHeader />
      <main className="page-content">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="page-title">
              {greeting},<br className="dash-break" /> {user?.name?.split(" ")[0]}
            </h1>
            <p className="page-subtitle">{formatDate(new Date())} · Let's make it count.</p>
          </div>
          {user?.streak > 0 && (
            <div className="dash-streak-pill">
              <RiFireLine size={16} />
              <span>{user.streak}d streak</span>
            </div>
          )}
        </div>

        {/* Bento — 2 cards: Total Exercises + Streak */}
        <SummaryBento
          totalExercises={analytics?.totalExercises}
          streak={user?.streak}
        />

        {/* Daily quote — mobile only */}
        <section className="dash-section dash-mobile-only">
          <QuoteCard />
        </section>

        {/* Horizontal scroll cards */}
        <section className="dash-section">
          <h2 className="dash-section-title">Today's Overview</h2>
          <motion.div
            className="dash-scroll-row"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <AnalyticsCard
              workoutDays={analytics?.workoutDays?.length}
              calorieAvg={calorieAvg}
            />
            <DietCard
              calories={todayDiet?.totalCalories || 0}
              protein={todayDiet?.totalProtein || 0}
              calorieGoal={calorieGoal}
            />
            <WaterCard
              totalMl={water.totalMl}
              goalMl={water.goalMl}
              glassSize={water.glassSize}
              onAdd={handleAddWater}
            />
            <SleepCard
              hours={sleep?.hours}
              quality={sleep?.quality}
              onLog={() => setShowSleepModal(true)}
            />
          </motion.div>
        </section>

        {/* Leaderboard */}
        <section className="dash-section">
          <Leaderboard />
        </section>

        {/* Today's Exercises */}
        <section className="dash-section">
          <div className="dash-section-head">
            <h2 className="dash-section-title">Today's Exercises</h2>
            <Link to="/exercises" className="dash-see-all">
              See all <RiArrowRightLine size={13} />
            </Link>
          </div>
          {loading ? (
            <div className="dash-loading">Loading…</div>
          ) : todayExercises.length === 0 ? (
            <div className="dash-empty-card">
              <RiWeightLine size={28} className="dash-empty-icon" />
              <p>No exercises logged today.</p>
              <Link to="/exercises" className="btn btn-accent" style={{ marginTop: 12, fontSize: "0.85rem" }}>
                Log your first set
              </Link>
            </div>
          ) : (
            <div className="dash-ex-list">
              {todayExercises.map((ex) => (
                <div key={ex._id} className="dash-ex-item">
                  <div className="dash-ex-left">
                    <RiWeightLine size={16} className="dash-ex-icon" />
                    <div>
                      <div className="dash-ex-name">{ex.name}</div>
                      {ex.muscleGroup && (
                        <span className="badge badge-info">{ex.muscleGroup}</span>
                      )}
                    </div>
                  </div>
                  <div className="dash-ex-meta">
                    {ex.sets}×{ex.reps}{ex.weight ? ` @ ${ex.weight}kg` : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <Footer />
      </main>

      {showSleepModal && (
        <SleepModal
          onClose={() => setShowSleepModal(false)}
          onSave={handleSaveSleep}
        />
      )}
    </div>
  );
};

export default Dashboard;
