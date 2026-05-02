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
  RiWalkLine,
  RiHeartPulseLine,
  RiFlashlightLine,
  RiSaveLine,
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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// ── Motivational quotes ──────────────────────────────────────────────────────
const QUOTES = [
  { text: "The only bad workout is the one that didn't happen." },
  { text: "Push yourself, because no one else is going to do it for you." },
  {
    text: "Your body can stand almost anything. It's your mind you have to convince.",
  },
  { text: "Success starts with self-discipline." },
  { text: "The pain you feel today will be the strength you feel tomorrow." },
  { text: "Don't stop when you're tired. Stop when you're done." },
  { text: "Wake up with determination. Go to bed with satisfaction." },
  {
    text: "Do something today that your future self will thank you for.",
    author: "Sean Patrick Flanery",
  },
  { text: "It never gets easier, you just get stronger." },
  { text: "Train insane or remain the same." },
  { text: "Strive for progress, not perfection." },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
  },
  { text: "A one hour workout is 4% of your day. No excuses." },
  { text: "Every champion was once a contender who refused to give up." },
  { text: "Be stronger than your strongest excuse." },
  { text: "Your only limit is you." },
  { text: "The body achieves what the mind believes." },
  {
    text: "Discipline is doing what needs to be done even when you don't want to.",
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
  {
    text: "Results happen over time, not overnight. Work hard, stay consistent.",
  },
  { text: "What seems impossible today will become your warm-up tomorrow." },
  { text: "Hustle for that muscle." },
  { text: "Your health is an investment, not an expense." },
  { text: "Motivation gets you started. Habit keeps you going." },
  { text: "If you're tired of starting over, stop giving up." },
  { text: "You are one workout away from a good mood." },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
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
    <div
      className="dash-quote-card"
      style={{ background: g.bg, color: g.text }}
    >
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
      <div className="bento-icon">
        <RiWeightLine size={20} />
      </div>
      <div className="bento-value">{totalExercises ?? "—"}</div>
      <div className="bento-label">Total Exercises</div>
      <div className="bento-sub">all time</div>
    </motion.div>
    <motion.div variants={fadeUp} className="bento-card bento-card--dark">
      <div className="bento-icon">
        <RiFireLine size={20} />
      </div>
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

const WaterCard = ({ totalMl, goalMl, glassSize, onAdd }) => {
  const pct = Math.min(100, Math.round((totalMl / goalMl) * 100));
  const glasses = Math.round(totalMl / glassSize);
  return (
    <ScrollCard accent="#4facfe">
      <div className="dash-sc-header">
        <RiDropLine
          size={18}
          className="dash-sc-icon"
          style={{ color: "#4facfe" }}
        />
        <span className="dash-sc-title">Water</span>
        <button
          className="dash-sc-add-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          title="Add a glass"
        >
          <RiAddLine size={14} />
        </button>
      </div>
      <div className="dash-sc-big">{(totalMl / 1000).toFixed(1)}L</div>
      <div className="dash-sc-sub">
        {glasses} glasses · goal {(goalMl / 1000).toFixed(1)}L
      </div>
      <div className="dash-sc-bar-wrap">
        <div
          className="dash-sc-bar"
          style={{ width: `${pct}%`, background: "#4facfe" }}
        />
      </div>
      <div className="dash-sc-pct">{pct}%</div>
    </ScrollCard>
  );
};

const SleepCard = ({ hours, quality, onLog }) => {
  const qualityColor = {
    poor: "#e53e3e",
    fair: "#dd6b20",
    good: "#38a169",
    excellent: "#3182ce",
  };
  return (
    <ScrollCard accent="#a18cd1" onClick={onLog}>
      <div className="dash-sc-header">
        <RiMoonLine
          size={18}
          className="dash-sc-icon"
          style={{ color: "#a18cd1" }}
        />
        <span className="dash-sc-title">Sleep</span>
      </div>
      {hours != null ? (
        <>
          <div className="dash-sc-big">{hours}h</div>
          <div
            className="dash-sc-sub"
            style={{ color: qualityColor[quality] || "var(--text-muted)" }}
          >
            {quality}
          </div>
        </>
      ) : (
        <>
          <div
            className="dash-sc-big"
            style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}
          >
            —
          </div>
          <div className="dash-sc-sub">Tap to log</div>
        </>
      )}
      <div className="dash-sc-hint">Last night</div>
    </ScrollCard>
  );
};

const DietCard = ({ calories, protein, calorieGoal }) => {
  const pct = Math.min(100, Math.round((calories / calorieGoal) * 100));
  return (
    <ScrollCard accent="#43e97b" linkTo="/diet">
      <div className="dash-sc-header">
        <RiLeafLine
          size={18}
          className="dash-sc-icon"
          style={{ color: "#43e97b" }}
        />
        <span className="dash-sc-title">Diet</span>
        <RiArrowRightLine size={13} className="dash-sc-arrow" />
      </div>
      <div className="dash-sc-big">{Math.round(calories)} kcal</div>
      <div className="dash-sc-sub">
        {Math.round(protein)}g protein · goal {calorieGoal}
      </div>
      <div className="dash-sc-bar-wrap">
        <div
          className="dash-sc-bar"
          style={{ width: `${pct}%`, background: "#43e97b" }}
        />
      </div>
      <div className="dash-sc-pct">{pct}%</div>
    </ScrollCard>
  );
};

const AnalyticsCard = ({ workoutDays, calorieAvg }) => (
  <ScrollCard accent="#f6d365" linkTo="/analytics">
    <div className="dash-sc-header">
      <RiLineChartLine
        size={18}
        className="dash-sc-icon"
        style={{ color: "#f6d365" }}
      />
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

// ── Steps card ───────────────────────────────────────────────────────────────
const StepsCard = ({ steps, onLog }) => {
  const goal = 8000;
  const pct = Math.min(100, Math.round((steps / goal) * 100));
  return (
    <ScrollCard accent="#f093fb" onClick={onLog}>
      <div className="dash-sc-header">
        <RiWalkLine
          size={18}
          className="dash-sc-icon"
          style={{ color: "#f093fb" }}
        />
        <span className="dash-sc-title">Steps</span>
        <button
          className="dash-sc-add-btn"
          onClick={(e) => { e.stopPropagation(); onLog(); }}
          title="Log steps"
        >
          <RiAddLine size={14} />
        </button>
      </div>
      <div className="dash-sc-big">{steps.toLocaleString()}</div>
      <div className="dash-sc-sub">goal {goal.toLocaleString()} steps</div>
      <div className="dash-sc-bar-wrap">
        <div
          className="dash-sc-bar"
          style={{ width: `${pct}%`, background: "#f093fb" }}
        />
      </div>
      <div className="dash-sc-pct">{pct}%</div>
    </ScrollCard>
  );
};

// ── Health Score card ────────────────────────────────────────────────────────
const HealthScoreCard = ({ score, mood, stress }) => {
  const moodColors = {
    Excellent: "#43e97b",
    Good: "#4facfe",
    Average: "#f6d365",
    "Needs Attention": "#f093fb",
  };
  const stressColors = { Low: "#43e97b", Medium: "#f6d365", High: "#f5576c" };
  const color = moodColors[mood] || "#a18cd1";

  return (
    <ScrollCard accent={color} linkTo="/dashboard">
      <div className="dash-sc-header">
        <RiHeartPulseLine
          size={18}
          className="dash-sc-icon"
          style={{ color }}
        />
        <span className="dash-sc-title">Health Score</span>
      </div>
      <div className="dash-sc-big" style={{ color }}>
        {score}
        <span
          style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "inherit" }}
        >
          /100
        </span>
      </div>
      <div className="dash-sc-sub">{mood}</div>
      <div className="dash-sc-bar-wrap">
        <div
          className="dash-sc-bar"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <div
        className="dash-sc-pct"
        style={{ color: stressColors[stress] || "var(--text-muted)" }}
      >
        {stress} stress
      </div>
    </ScrollCard>
  );
};

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
        <h3 className="dash-modal-title">
          <RiMoonLine size={16} /> Log Sleep
        </h3>
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
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <RiCheckLine size={14} /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Steps log modal ──────────────────────────────────────────────────────────
const StepsModal = ({ currentSteps, onClose, onSave }) => {
  const [steps, setSteps] = useState(currentSteps || 0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (steps < 0) return;
    setSaving(true);
    try {
      await onSave(steps);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="dash-modal-title">
          <RiWalkLine size={16} /> Log Steps
        </h3>
        <div className="form-group">
          <label className="form-label">Steps walked today</label>
          <input
            className="form-input"
            type="number"
            min={0}
            max={100000}
            step={100}
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
          />
        </div>
        <div className="dash-modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <RiCheckLine size={14} /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Exercise log modal (from active plan) ─────────────────────────────────
const ExerciseLogModal = ({ exercise, onClose, onSave }) => {
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ name: exercise.name, sets, reps, weight });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="dash-modal-title">
          <RiWeightLine size={16} /> Log: {exercise.name}
        </h3>
        <div className="form-group">
          <label className="form-label">Sets</label>
          <input
            className="form-input"
            type="number"
            min={1}
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Reps</label>
          <input
            className="form-input"
            type="number"
            min={1}
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Weight (kg) — 0 for bodyweight</label>
          <input
            className="form-input"
            type="number"
            min={0}
            step={0.5}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
          />
        </div>
        <div className="dash-modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <RiCheckLine size={14} /> {saving ? "Saving…" : "Save to Log"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [todayExercises, setTodayExercises] = useState([]);
  const [todayDiet, setTodayDiet] = useState(null);
  const [water, setWater] = useState({ totalMl: 0, goalMl: 2500, glassSize: 250 });
  const [sleep, setSleep] = useState(null);
  const [steps, setSteps] = useState(0);
  const [healthScore, setHealthScore] = useState(null);
  const [activeWorkoutPlan, setActiveWorkoutPlan] = useState(null);
  const [activeDietPlan, setActiveDietPlan] = useState(null);
  const [stepsHistory, setStepsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [logExercise, setLogExercise] = useState(null);
  // meal completion (stored locally per user/date, cleared daily)
  const [completedMeals, setCompletedMeals] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("devfit_meal_done") || "{}");
      const todayKey = new Date().toISOString().slice(0, 10);
      return stored.date === todayKey ? stored.meals : {};
    } catch {
      return {};
    }
  });

  const today = todayISO();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [a, e, d, w, s, st, hs, wp, dp, sh] = await Promise.allSettled([
        api.get("/analytics/overview?days=30"),
        api.get(`/exercise?date=${today}&limit=5`),
        api.get(`/diet?date=${today}`),
        api.get(`/water?date=${today}`),
        api.get(`/sleep?date=${today}`),
        api.get(`/steps?date=${today}`),
        api.get("/health-score"),
        api.get("/workout-plans/active"),
        api.get("/diet-plans/active"),
        api.get("/steps/history"),
      ]);

      if (a.status === "fulfilled") setAnalytics(a.value.data);
      if (e.status === "fulfilled") setTodayExercises(e.value.data.exercises || []);
      if (d.status === "fulfilled") setTodayDiet(d.value.data.diet || null);
      if (w.status === "fulfilled") setWater(w.value.data);
      if (s.status === "fulfilled") setSleep(s.value.data.log || null);
      if (st.status === "fulfilled") setSteps(st.value.data.steps ?? 0);
      if (hs.status === "fulfilled") setHealthScore(hs.value.data);
      if (wp.status === "fulfilled") setActiveWorkoutPlan(wp.value.data.plan || null);
      if (dp.status === "fulfilled") setActiveDietPlan(dp.value.data.plan || null);
      if (sh.status === "fulfilled") setStepsHistory(sh.value.data.history || []);
    } catch {
      // partial data is fine
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
    // Refresh health score after sleep log
    try {
      const { data: hs } = await api.get("/health-score");
      setHealthScore(hs);
    } catch {}
  };

  const handleSaveSteps = async (stepsCount) => {
    const { data } = await api.post("/steps", { steps: stepsCount, date: today });
    setSteps(data.log.steps);
    // Refresh health score and history
    try {
      const [hs, sh] = await Promise.all([
        api.get("/health-score"),
        api.get("/steps/history"),
      ]);
      setHealthScore(hs.data);
      setStepsHistory(sh.data.history || []);
    } catch {}
  };

  const handleLogExercise = async ({ name, sets, reps, weight }) => {
    const { data } = await api.post("/exercise", {
      name,
      sets,
      reps,
      weight,
      date: today,
    });
    setTodayExercises((prev) => [data.exercise, ...prev]);
  };

  const toggleMealDone = (key) => {
    const updated = { ...completedMeals, [key]: !completedMeals[key] };
    setCompletedMeals(updated);
    const todayKey = new Date().toISOString().slice(0, 10);
    localStorage.setItem(
      "devfit_meal_done",
      JSON.stringify({ date: todayKey, meals: updated }),
    );
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const calorieGoal = (() => {
    if (!user?.weight || !user?.age) return 2200;
    const heightCm = user.heightFeet
      ? user.heightFeet * 30.48 + (user.heightInches || 0) * 2.54
      : 170;
    const bmr = 10 * user.weight + 6.25 * heightCm - 5 * user.age + 5;
    return Math.round((bmr * 1.55) / 50) * 50;
  })();

  const calorieAvg = (() => {
    if (!analytics?.calorieHistory?.length) return 0;
    const sum = analytics.calorieHistory.reduce((s, d) => s + (d.calories || 0), 0);
    return sum / analytics.calorieHistory.length;
  })();

  // Map today's weekday to the active workout plan's schedule day
  const todayWorkout = (() => {
    if (!activeWorkoutPlan?.schedule?.length) return null;
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = dayNames[new Date().getDay()];
    return activeWorkoutPlan.schedule.find((d) => d.day === todayName) || null;
  })();

  const MEAL_ORDER = [
    { key: "breakfast", emoji: "🌅", label: "Breakfast" },
    { key: "morningSnack", emoji: "🍎", label: "Morning Snack" },
    { key: "lunch", emoji: "☀️", label: "Lunch" },
    { key: "eveningSnack", emoji: "🥜", label: "Evening Snack" },
    { key: "dinner", emoji: "🌙", label: "Dinner" },
  ];

  return (
    <div className="page-layout">
      <Sidebar />
      <MobileHeader />
      <main className="page-content">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="page-title">
              {greeting},<br className="dash-break" />{" "}
              {user?.name?.split(" ")[0]}
            </h1>
            <p className="page-subtitle">
              {formatDate(new Date())} · Let's make it count.
            </p>
          </div>
          {user?.streak > 0 && (
            <div className="dash-streak-pill">
              <RiFireLine size={16} />
              <span>{user.streak}d streak</span>
            </div>
          )}
        </div>

        {/* Bento */}
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
            {healthScore && (
              <HealthScoreCard
                score={healthScore.score}
                mood={healthScore.mood}
                stress={healthScore.stress}
              />
            )}
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
            <StepsCard
              steps={steps}
              onLog={() => setShowStepsModal(true)}
            />
          </motion.div>
        </section>

        {/* ── Health Score detail card ──────────────────────────────────── */}
        {healthScore && (
          <section className="dash-section">
            <h2 className="dash-section-title">Health Score</h2>
            <div className="card dash-health-card">
              <div className="dash-health-header">
                <div className="dash-health-score-wrap">
                  <div
                    className="dash-health-score"
                    style={{
                      color:
                        healthScore.score >= 80
                          ? "#43e97b"
                          : healthScore.score >= 60
                          ? "#4facfe"
                          : healthScore.score >= 40
                          ? "#f6d365"
                          : "#f093fb",
                    }}
                  >
                    {healthScore.score}
                  </div>
                  <div className="dash-health-label">/ 100</div>
                </div>
                <div className="dash-health-mood-stress">
                  <div className="dash-health-mood">{healthScore.mood}</div>
                  <div
                    className="dash-health-stress"
                    style={{
                      color:
                        healthScore.stress === "Low"
                          ? "#43e97b"
                          : healthScore.stress === "Medium"
                          ? "#f6d365"
                          : "#f5576c",
                    }}
                  >
                    {healthScore.stress} Stress
                  </div>
                </div>
              </div>

              {/* Score breakdown */}
              <div className="dash-health-breakdown">
                {[
                  {
                    label: "Exercise",
                    score: healthScore.breakdown?.exercise?.score ?? 0,
                    max: 35,
                    sub: `${healthScore.breakdown?.exercise?.days ?? 0}/7 days`,
                    color: "#f6d365",
                  },
                  {
                    label: "Sleep",
                    score: healthScore.breakdown?.sleep?.score ?? 0,
                    max: 25,
                    sub: `${healthScore.breakdown?.sleep?.avgHours ?? 0}h avg`,
                    color: "#a18cd1",
                  },
                  {
                    label: "Water",
                    score: healthScore.breakdown?.water?.score ?? 0,
                    max: 20,
                    sub: `${((healthScore.breakdown?.water?.totalMl ?? 0) / 1000).toFixed(1)}L today`,
                    color: "#4facfe",
                  },
                  {
                    label: "Steps",
                    score: healthScore.breakdown?.steps?.score ?? 0,
                    max: 20,
                    sub: `${(healthScore.breakdown?.steps?.steps ?? 0).toLocaleString()} today`,
                    color: "#f093fb",
                  },
                ].map(({ label, score, max, sub, color }) => (
                  <div key={label} className="dash-health-row">
                    <div className="dash-health-row-label">
                      <span>{label}</span>
                      <span className="dash-health-row-sub">{sub}</span>
                    </div>
                    <div className="dash-health-bar-wrap">
                      <div
                        className="dash-health-bar"
                        style={{
                          width: `${(score / max) * 100}%`,
                          background: color,
                        }}
                      />
                    </div>
                    <span className="dash-health-row-pts">
                      {score}/{max}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Today's Workout ───────────────────────────────────────────── */}
        <section className="dash-section">
          <div className="dash-section-head">
            <h2 className="dash-section-title">Today's Workout</h2>
            <Link to="/my-workout-plans" className="dash-see-all">
              My Plans <RiArrowRightLine size={13} />
            </Link>
          </div>

          {!activeWorkoutPlan ? (
            <div className="dash-empty-card">
              <RiWeightLine size={28} className="dash-empty-icon" />
              <p>No active workout plan. Set one up to see today's session.</p>
              <button
                className="btn btn-accent"
                style={{ marginTop: 12, fontSize: "0.85rem" }}
                onClick={() => navigate("/workout-plan")}
              >
                Generate a Plan
              </button>
            </div>
          ) : !todayWorkout ? (
            <div className="card dash-rest-day">
              <RiFlashlightLine size={22} className="dash-rest-icon" />
              <div>
                <div className="dash-rest-title">Rest Day</div>
                <div className="dash-rest-sub">
                  No session scheduled for today in{" "}
                  <strong>{activeWorkoutPlan.planName}</strong>. Recover well!
                </div>
              </div>
            </div>
          ) : (
            <div className="card dash-workout-card">
              <div className="dash-workout-header">
                <div>
                  <div className="dash-workout-day-label">
                    {todayWorkout.label}
                  </div>
                  <div className="dash-workout-plan-name">
                    {activeWorkoutPlan.planName}
                  </div>
                </div>
                <span className="badge badge-info">
                  {todayWorkout.exercises?.length ?? 0} exercises
                </span>
              </div>
              <div className="dash-workout-list">
                {(todayWorkout.exercises || []).map((ex, i) => (
                  <button
                    key={i}
                    className="dash-workout-ex-row"
                    onClick={() => setLogExercise(ex)}
                    title="Tap to log"
                  >
                    <div className="dash-workout-ex-left">
                      <RiWeightLine size={14} className="dash-workout-ex-icon" />
                      <span className="dash-workout-ex-name">{ex.name}</span>
                    </div>
                    <div className="dash-workout-ex-right">
                      <span className="dash-workout-ex-detail">{ex.detail}</span>
                      <span className="dash-workout-log-hint">Log</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Today's Diet ──────────────────────────────────────────────── */}
        <section className="dash-section">
          <div className="dash-section-head">
            <h2 className="dash-section-title">Today's Diet</h2>
            <Link to="/my-diet-plans" className="dash-see-all">
              My Plans <RiArrowRightLine size={13} />
            </Link>
          </div>

          {!activeDietPlan ? (
            <div className="dash-empty-card">
              <RiLeafLine size={28} className="dash-empty-icon" />
              <p>No active diet plan. Set one up to track your meals.</p>
              <button
                className="btn btn-accent"
                style={{ marginTop: 12, fontSize: "0.85rem" }}
                onClick={() => navigate("/diet-plan")}
              >
                Generate a Diet Plan
              </button>
            </div>
          ) : (
            <div className="card dash-diet-plan-card">
              <div className="dash-diet-plan-header">
                <div className="dash-diet-plan-name">{activeDietPlan.planName}</div>
                <span className="badge badge-info">
                  {activeDietPlan.calories} kcal
                </span>
              </div>
              <div className="dash-diet-meals">
                {MEAL_ORDER.map(({ key, emoji, label }) =>
                  activeDietPlan.meals?.[key] ? (
                    <div
                      key={key}
                      className={`dash-diet-meal-row ${completedMeals[key] ? "dash-diet-meal-row--done" : ""}`}
                    >
                      <span className="dash-diet-meal-emoji">{emoji}</span>
                      <div className="dash-diet-meal-info">
                        <span className="dash-diet-meal-label">{label}</span>
                        <span className="dash-diet-meal-desc">
                          {activeDietPlan.meals[key]}
                        </span>
                      </div>
                      <button
                        className={`dash-diet-done-btn ${completedMeals[key] ? "dash-diet-done-btn--done" : ""}`}
                        onClick={() => toggleMealDone(key)}
                        title={completedMeals[key] ? "Mark undone" : "Mark as Done"}
                      >
                        <RiCheckLine size={14} />
                        {completedMeals[key] ? "Done" : "Mark as Done"}
                      </button>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}
        </section>

        {/* ── Steps weekly trend ────────────────────────────────────────── */}
        {stepsHistory.length > 0 && (
          <section className="dash-section">
            <div className="dash-section-head">
              <h2 className="dash-section-title">Steps This Week</h2>
              <button
                className="dash-see-all"
                onClick={() => setShowStepsModal(true)}
              >
                Log <RiAddLine size={13} />
              </button>
            </div>
            <div className="card dash-steps-chart">
              {stepsHistory.map(({ date, steps: s }, i) => {
                const dayName = new Date(date + "T12:00:00")
                  .toLocaleDateString("en", { weekday: "short" });
                const pct = Math.min(100, (s / 8000) * 100);
                const isToday = date === today;
                return (
                  <div key={i} className="dash-steps-bar-col">
                    <div className="dash-steps-val">{s >= 1000 ? (s / 1000).toFixed(1) + "k" : s}</div>
                    <div className="dash-steps-bar-track">
                      <div
                        className="dash-steps-bar-fill"
                        style={{
                          height: `${Math.max(4, pct)}%`,
                          background: isToday ? "#f093fb" : "var(--accent-subtle)",
                        }}
                      />
                    </div>
                    <div className={`dash-steps-day ${isToday ? "dash-steps-day--today" : ""}`}>
                      {dayName}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Leaderboard */}
        <section className="dash-section">
          <Leaderboard />
        </section>

        {/* Today's Exercises (logged) */}
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
              <Link
                to="/exercises"
                className="btn btn-accent"
                style={{ marginTop: 12, fontSize: "0.85rem" }}
              >
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
                    {ex.sets}×{ex.reps}
                    {ex.weight ? ` @ ${ex.weight}kg` : ""}
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
      {showStepsModal && (
        <StepsModal
          currentSteps={steps}
          onClose={() => setShowStepsModal(false)}
          onSave={handleSaveSteps}
        />
      )}
      {logExercise && (
        <ExerciseLogModal
          exercise={logExercise}
          onClose={() => setLogExercise(null)}
          onSave={handleLogExercise}
        />
      )}
    </div>
  );
};

export default Dashboard;
