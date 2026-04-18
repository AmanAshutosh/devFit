import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import {
  RiWeightLine,
  RiLeafLine,
  RiLineChartLine,
  RiCapsuleLine,
  RiYoutubeLine,
  RiCalendarCheckLine,
  RiArrowRightLine,
  RiFireLine,
  RiTrophyLine,
  RiShieldCheckLine,
  RiFlashlightLine,
  RiHeartPulseLine,
  RiBodyScanLine,
  RiTimeLine,
  RiCheckLine,
} from "react-icons/ri";
import "./Landing.css";

const STATS = [
  { value: "6", unit: "modules", label: "All-in-one" },
  { value: "50+", unit: "foods", label: "Macro DB" },
  { value: "3", unit: "plans", label: "Preset splits" },
  { value: "100%", unit: "free", label: "No paywalls" },
];

const FEATURES = [
  {
    icon: RiWeightLine,
    color: "#a0ff6f",
    label: "Workout Tracking",
    desc: "Log sets, reps, and rest. Build a full 6-day split.",
  },
  {
    icon: RiLeafLine,
    color: "#34d399",
    label: "Diet & Macros",
    desc: "Auto-fill nutrition from 50+ foods. Track every meal.",
  },
  {
    icon: RiLineChartLine,
    color: "#60a5fa",
    label: "Analytics",
    desc: "Visualise progress over time with beautiful charts.",
  },
  {
    icon: RiCapsuleLine,
    color: "#f59e0b",
    label: "Supplements",
    desc: "Log your full supplement stack with dosage & timing.",
  },
  {
    icon: RiCalendarCheckLine,
    color: "#a78bfa",
    label: "Gym Plans",
    desc: "Start from a Beginner, Intermediate, or Advanced preset.",
  },
  {
    icon: RiYoutubeLine,
    color: "#f87171",
    label: "Video Suggestions",
    desc: "AI-curated workout videos matched to your training split.",
  },
];

const PLAN_BADGES = [
  {
    label: "Full Body Split",
    sub: "3 days / week",
    badge: "Beginner",
    color: "var(--info)",
  },
  {
    label: "Push/Pull/Legs",
    sub: "4 days / week",
    badge: "Intermediate",
    color: "var(--accent-dark)",
  },
  {
    label: "PPL — 6 Days",
    sub: "6 days / week",
    badge: "Advanced",
    color: "var(--danger)",
  },
];

const AnimatedCounter = ({ target, suffix = "" }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const num = parseInt(target);
    if (isNaN(num)) {
      setVal(target);
      return;
    }
    let start = 0;
    const step = Math.ceil(num / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        setVal(num);
        clearInterval(timer);
      } else setVal(start);
    }, 40);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <>
      {val}
      {suffix}
    </>
  );
};

const Landing = () => {
  return (
    <div className="landing">
      {/* Nav */}
      <header className="landing-nav">
        <div className="landing-nav-logo">
          dev<span>Fit</span>
        </div>
        <div className="landing-nav-right">
          <ThemeToggle />
          <Link to="/login" className="btn btn-ghost landing-nav-btn">
            Log in
          </Link>
          <Link to="/register" className="btn btn-primary landing-nav-btn">
            Get started <RiArrowRightLine size={14} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-eyebrow">
          <RiFlashlightLine size={13} /> Free · Open source · No ads
        </div>
        <h1 className="landing-hero-title">
          TRAIN SMARTER.
          <br />
          <span className="landing-hero-accent">TRACK EVERYTHING.</span>
        </h1>
        <p className="landing-hero-sub">
          Workouts, diet, supplements, analytics — all in one brutally simple
          app.
        </p>
        <div className="landing-hero-cta">
          <Link to="/register" className="btn btn-accent landing-cta-primary">
            Start for free <RiArrowRightLine size={15} />
          </Link>
          <Link to="/login" className="btn btn-ghost landing-cta-secondary">
            I have an account
          </Link>
        </div>

        {/* Inline stats */}
        <div className="landing-stats">
          {STATS.map((s) => (
            <div key={s.label} className="landing-stat">
              <div className="landing-stat-val">
                <AnimatedCounter target={s.value} />
                <span className="landing-stat-unit"> {s.unit}</span>
              </div>
              <div className="landing-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid */}
      <section className="landing-bento-section">
        <div className="landing-bento">
          {/* Tile 1 — Workout (XL) */}
          <div className="bento-tile bento-tile--xl bento-workout">
            <div className="bento-tile-label">
              <RiWeightLine size={16} /> Workout Tracking
            </div>
            <h2 className="bento-tile-title">
              Build your
              <br />
              perfect split
            </h2>
            <p className="bento-tile-desc">
              6-day planner. Log exercises, sets, reps, and rest. Load a preset
              or build from scratch.
            </p>
            <div className="bento-workout-preview">
              {[
                { name: "Bench Press", sets: "4×8", muscle: "Chest" },
                { name: "Squat", sets: "5×5", muscle: "Legs" },
                { name: "Deadlift", sets: "3×6", muscle: "Back" },
              ].map((ex) => (
                <div key={ex.name} className="bento-ex-row">
                  <span className="bento-ex-dot" />
                  <span className="bento-ex-name">{ex.name}</span>
                  <span className="bento-ex-sets">{ex.sets}</span>
                  <span className="bento-ex-muscle">{ex.muscle}</span>
                </div>
              ))}
            </div>
            <div className="bento-tile-badge">
              <RiCheckLine size={11} /> Streak tracking included
            </div>
          </div>

          {/* Tile 2 — Diet */}
          <div className="bento-tile bento-diet">
            <div className="bento-tile-label">
              <RiLeafLine size={14} /> Diet & Macros
            </div>
            <h3 className="bento-tile-title-sm">Auto-fill nutrition</h3>
            <p className="bento-tile-desc-sm">
              Type a food, get macros instantly from a 50+ item database.
            </p>
            <div className="bento-macro-pills">
              <span className="bento-mpill bento-mpill-p">Protein 32g</span>
              <span className="bento-mpill bento-mpill-c">Carbs 48g</span>
              <span className="bento-mpill bento-mpill-f">Fats 12g</span>
            </div>
            <div className="bento-cal-bar-wrap">
              <div className="bento-cal-bar" style={{ width: "68%" }} />
            </div>
            <div className="bento-cal-label">1,496 / 2,200 kcal</div>
          </div>

          {/* Tile 3 — Analytics */}
          <div className="bento-tile bento-analytics">
            <div className="bento-tile-label">
              <RiLineChartLine size={14} /> Analytics
            </div>
            <h3 className="bento-tile-title-sm">See your progress</h3>
            <div className="bento-chart-mock">
              {[40, 55, 48, 70, 63, 80, 75].map((h, i) => (
                <div
                  key={i}
                  className="bento-bar"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Tile 4 — Gym Plans */}
          <div className="bento-tile bento-plans">
            <div className="bento-tile-label">
              <RiCalendarCheckLine size={14} /> Gym Plans
            </div>
            <h3 className="bento-tile-title-sm">Preset splits</h3>
            <div className="bento-plan-list">
              {PLAN_BADGES.map((p) => (
                <div key={p.label} className="bento-plan-item">
                  <span
                    className="bento-plan-badge"
                    style={{ color: p.color, borderColor: p.color }}
                  >
                    {p.badge}
                  </span>
                  <div className="bento-plan-info">
                    <span className="bento-plan-name">{p.label}</span>
                    <span className="bento-plan-sub">{p.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tile 5 — Supplements */}
          <div className="bento-tile bento-supps">
            <div className="bento-tile-label">
              <RiCapsuleLine size={14} /> Supplements
            </div>
            <h3 className="bento-tile-title-sm">Track your stack</h3>
            <p className="bento-tile-desc-sm">
              Creatine, whey, vitamins — log dosage and timing every day.
            </p>
            <div className="bento-supp-icons">
              {["💊", "🧪", "⚡", "🫀"].map((e) => (
                <span key={e} className="bento-supp-icon">
                  {e}
                </span>
              ))}
            </div>
          </div>

          {/* Tile 6 — Videos */}
          <div className="bento-tile bento-videos">
            <div className="bento-tile-label">
              <RiYoutubeLine size={14} /> Video Suggestions
            </div>
            <h3 className="bento-tile-title-sm">Watch & learn</h3>
            <p className="bento-tile-desc-sm">
              AI-matched video tutorials based on your current workout plan.
            </p>
            <div className="bento-video-thumb">
              <div className="bento-video-play">▶</div>
            </div>
          </div>

          {/* Tile 7 — Health metrics (full width bottom) */}
          <div className="bento-tile bento-metrics">
            <div className="bento-metrics-content">
              <div className="bento-tile-label">
                <RiHeartPulseLine size={14} /> Health Metrics
              </div>
              <h3 className="bento-tile-title-sm">
                BMI · Streak · Calories · Macros
              </h3>
              <p className="bento-tile-desc-sm">
                Your complete fitness dashboard at a glance.
              </p>
            </div>
            <div className="bento-metrics-tags">
              {[
                "BMI Calculator",
                "Calorie Goal",
                "Macro Rings",
                "Weekly Streak",
                "Body Scan",
                "Export Data",
              ].map((t) => (
                <span key={t} className="bento-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features list */}
      <section className="landing-features-section">
        <h2 className="landing-section-title">EVERYTHING YOU NEED</h2>
        <div className="landing-features-grid">
          {FEATURES.map((f) => (
            <div key={f.label} className="landing-feature-card">
              <div
                className="landing-feature-icon"
                style={{
                  background: f.color + "22",
                  border: `2px solid ${f.color}`,
                }}
              >
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <div>
                <div className="landing-feature-name">{f.label}</div>
                <div className="landing-feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="landing-cta-section">
        <div className="landing-cta-card">
          <div className="landing-cta-icon">
            <RiTrophyLine size={32} />
          </div>
          <h2 className="landing-cta-title">
            READY TO START YOUR
            <br />
            FITNESS JOURNEY?
          </h2>
          <p className="landing-cta-sub">
            Free forever. No credit card. Just gains.
          </p>
          <div
            className="landing-hero-cta"
            style={{ justifyContent: "center" }}
          >
            <Link to="/register" className="btn btn-accent landing-cta-primary">
              Create free account <RiArrowRightLine size={15} />
            </Link>
            <Link to="/login" className="btn btn-ghost landing-cta-secondary">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-logo">
          dev<span>Fit</span>
        </div>
        <div className="landing-footer-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
        <div className="landing-footer-copy">
          Built for athletes. Powered by data.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
