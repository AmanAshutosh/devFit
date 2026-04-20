import React, { useState } from "react";
import {
  RiUserLine,
  RiLeafLine,
  RiFlashlightLine,
  RiFireLine,
  RiWeightLine,
  RiRunLine,
  RiHome2Line,
  RiBuildingLine,
  RiBodyScanLine,
  RiLightbulbLine,
  RiArrowLeftLine,
  RiRefreshLine,
  RiScales2Line,
  RiMenLine,
  RiWomenLine,
  RiTeamLine,
  RiTimerLine,
  RiHeartPulseLine,
} from "react-icons/ri";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import MobileHeader from "../../components/MobileHeader/MobileHeader.jsx";
import DisclaimerModal from "../../components/DisclaimerModal/DisclaimerModal.jsx";
import "./WorkoutPlanGenerator.css";

// ── Exercise database ─────────────────────────────────────────────────────────
const EXERCISES = {
  chest: {
    gym:  ["Bench Press", "Incline Dumbbell Press", "Cable Flyes", "Push-Up", "Dip"],
    home: ["Push-Up", "Wide Push-Up", "Decline Push-Up", "Diamond Push-Up", "Chest Dip (chairs)"],
  },
  back: {
    gym:  ["Pull-Up", "Barbell Row", "Lat Pulldown", "Seated Cable Row", "Deadlift"],
    home: ["Pull-Up", "Inverted Row", "Superman Hold", "Resistance Band Row", "Doorframe Row"],
  },
  legs: {
    gym:  ["Squat", "Leg Press", "Romanian Deadlift", "Leg Curl", "Calf Raise"],
    home: ["Squat", "Bulgarian Split Squat", "Lunges", "Glute Bridge", "Calf Raise"],
  },
  shoulders: {
    gym:  ["Overhead Press", "Lateral Raise", "Face Pull", "Arnold Press", "Rear Delt Flyes"],
    home: ["Pike Push-Up", "Lateral Raise (bottles)", "Front Raise (bottles)", "Handstand Push-Up", "Band Pull-Apart"],
  },
  arms: {
    gym:  ["Barbell Curl", "Tricep Pushdown", "Hammer Curl", "Skull Crusher", "Preacher Curl"],
    home: ["Close-Grip Push-Up", "Chin-Up", "Resistance Band Curl", "Tricep Dip (chair)", "Isometric Curl"],
  },
  core: {
    gym:  ["Cable Crunch", "Plank", "Hanging Leg Raise", "Russian Twist", "Ab Wheel"],
    home: ["Plank", "Crunches", "Bicycle Crunch", "Leg Raise", "Mountain Climber"],
  },
  cardio: {
    gym:  ["Treadmill Run", "Rowing Machine", "Stationary Bike", "Jump Rope", "Stair Climber"],
    home: ["Jump Rope", "Burpees", "High Knees", "Jumping Jacks", "Box Step-Ups"],
  },
  hiit: {
    gym:  ["Battle Ropes", "Burpee", "Box Jump", "Sled Push", "Kettlebell Swing"],
    home: ["Burpee", "Jump Squat", "Mountain Climber", "Tuck Jump", "Sprint in Place"],
  },
};

// ── Sets / reps based on goal + level ────────────────────────────────────────
function getSetsReps(goal, level, type = "strength") {
  if (type === "cardio") {
    return { beginner: "20 min", intermediate: "30 min", advanced: "45 min" }[level] || "30 min";
  }
  if (type === "hiit") {
    return {
      beginner:     "3 rounds · 30s on / 30s off",
      intermediate: "4 rounds · 40s on / 20s off",
      advanced:     "5 rounds · 45s on / 15s off",
    }[level] || "4 rounds";
  }
  return (
    { weight_loss: { beginner: "3 × 15", intermediate: "4 × 15", advanced: "4 × 20" },
      muscle_gain: { beginner: "4 × 8",  intermediate: "4 × 10", advanced: "5 × 8"  } }
    [goal]?.[level] || "3 × 12"
  );
}

// ── Weekly split builder ──────────────────────────────────────────────────────
function buildWeeklyPlan({ fitnessLevel, goal, location, days, workoutTypes }) {
  const loc      = location === "gym" ? "gym" : "home";
  const sr       = (type = "strength") => getSetsReps(goal, fitnessLevel, type);
  const exCount  = fitnessLevel === "beginner" ? 2 : fitnessLevel === "intermediate" ? 3 : 4;

  const muscleDay = (muscles, label) => ({
    label,
    exercises: muscles.flatMap((m) =>
      (EXERCISES[m]?.[loc] || []).slice(0, exCount).map((name) => ({ name, detail: sr() }))
    ),
  });

  const cardioDay = () => ({
    label: "Cardio",
    exercises: EXERCISES.cardio[loc].slice(0, 2).map((name) => ({ name, detail: sr("cardio") })),
  });

  const hiitDay = () => ({
    label: "HIIT",
    exercises: EXERCISES.hiit[loc].slice(0, 3).map((name) => ({ name, detail: sr("hiit") })),
  });

  const coreDay = () => ({
    label: "Core & Abs",
    exercises: EXERCISES.core[loc].slice(0, 4).map((name) => ({ name, detail: sr() })),
  });

  const push  = muscleDay(["chest", "shoulders", "arms"], "Push · Chest / Shoulders / Triceps");
  const pull  = muscleDay(["back", "arms"],               "Pull · Back / Biceps");
  const legs  = muscleDay(["legs", "core"],               "Legs & Core");
  const upper = muscleDay(["chest", "back", "shoulders", "arms"], "Upper Body");
  const lower = muscleDay(["legs", "core"],               "Lower Body");
  const full  = muscleDay(["chest", "back", "legs", "shoulders"], "Full Body");

  const wantCardio = workoutTypes.includes("cardio");
  const wantHiit   = workoutTypes.includes("hiit");

  const splits = {
    1: [full],
    2: [upper, lower],
    3: [push, legs, pull],
    4: [push, pull, legs, wantCardio ? cardioDay() : coreDay()],
    5: [push, pull, legs, wantCardio ? cardioDay() : coreDay(), wantHiit ? hiitDay() : full],
    6: [push, pull, legs, upper, wantCardio ? cardioDay() : lower, wantHiit ? hiitDay() : coreDay()],
    7: [push, pull, legs, upper, lower, wantCardio ? cardioDay() : coreDay(), wantHiit ? hiitDay() : full],
  };

  const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return (splits[Math.min(days, 7)] || splits[3]).map((w, i) => ({ day: DAY_NAMES[i], ...w }));
}

// ── Option button ─────────────────────────────────────────────────────────────
const OptionBtn = ({ selected, onClick, icon: Icon, label, sub }) => (
  <button
    type="button"
    className={`option-btn ${selected ? "option-btn--active" : ""}`}
    onClick={onClick}
  >
    {Icon && <Icon size={16} className="option-btn-icon" />}
    <span className="option-btn-label">{label}</span>
    {sub && <span className="option-sub">{sub}</span>}
  </button>
);

// ── Step data ─────────────────────────────────────────────────────────────────
const STEPS = ["About You", "Goal & Location", "Preferences"];

const INITIAL = {
  gender: "",
  fitnessLevel: "",
  goal: "",
  location: "",
  days: "",
  workoutTypes: [],
};

const toggleItem = (arr, val) =>
  arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

// ── Exercise category icon map (for result cards) ─────────────────────────────
const CATEGORY_ICONS = {
  "Push · Chest / Shoulders / Triceps": RiWeightLine,
  "Pull · Back / Biceps":               RiBodyScanLine,
  "Legs & Core":                        RiRunLine,
  "Upper Body":                         RiWeightLine,
  "Lower Body":                         RiRunLine,
  "Full Body":                          RiHeartPulseLine,
  "Cardio":                             RiTimerLine,
  "HIIT":                               RiFlashlightLine,
  "Core & Abs":                         RiBodyScanLine,
};

// ── Main component ────────────────────────────────────────────────────────────
const WorkoutPlanGenerator = () => {
  const [step, setStep]               = useState(0);
  const [form, setForm]               = useState(INITIAL);
  const [showDisclaimer, setShow]     = useState(false);
  const [plan, setPlan]               = useState(null);
  const [errors, setErrors]           = useState({});

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.gender)       e.gender       = "Select a gender";
      if (!form.fitnessLevel) e.fitnessLevel = "Select your fitness level";
    }
    if (step === 1) {
      if (!form.goal)     e.goal     = "Select a goal";
      if (!form.location) e.location = "Select workout location";
    }
    if (step === 2) {
      if (!form.days || form.days < 1 || form.days > 7) e.days = "Choose 1–7 days";
      if (form.workoutTypes.length === 0) e.workoutTypes = "Select at least one type";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      sessionStorage.getItem("devfit_disclaimer") === "accepted"
        ? setPlan(buildWeeklyPlan(form))
        : setShow(true);
    }
  };

  const handleAccept = () => {
    sessionStorage.setItem("devfit_disclaimer", "accepted");
    setShow(false);
    setPlan(buildWeeklyPlan(form));
  };

  const handleReset = () => { setForm(INITIAL); setPlan(null); setStep(0); setErrors({}); };

  // ── Result view ───────────────────────────────────────────────────────────
  if (plan) {
    return (
      <div className="page-layout">
        <Sidebar />
        <MobileHeader />
        <main className="page-content wg-content">
          <div className="page-header">
            <div>
              <h1 className="page-title">Your Workout Plan</h1>
              <p className="page-subtitle">
                {form.days}-day {form.location} plan ·{" "}
                {form.fitnessLevel} · {form.goal.replace("_", " ")}
              </p>
            </div>
            <button className="btn btn-ghost" onClick={handleReset}>
              <RiRefreshLine size={15} /> Regenerate
            </button>
          </div>

          <div className="wg-week-grid">
            {plan.map(({ day, label, exercises }) => {
              const DayIcon = CATEGORY_ICONS[label] || RiWeightLine;
              return (
                <div className="card wg-day-card" key={day}>
                  <div className="wg-day-header">
                    <span className="wg-day-name">{day}</span>
                    <span className="wg-day-badge">
                      <DayIcon size={12} />
                      {label}
                    </span>
                  </div>
                  <div className="wg-exercise-list">
                    {exercises.map((ex, i) => (
                      <div key={i} className="wg-exercise-row">
                        <span className="wg-ex-name">{ex.name}</span>
                        <span className="wg-ex-detail">{ex.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card wg-tips">
            <h3 className="dg-section-title">
              <RiLightbulbLine size={18} className="wg-tips-icon" /> Training Tips
            </h3>
            <ul className="dg-tips-list">
              <li>Warm up for 5–10 min before every session</li>
              <li>Cool down and stretch after each workout</li>
              <li>Progressive overload — increase weight or reps weekly</li>
              <li>Rest 60–90 sec between sets for hypertrophy</li>
              <li>Prioritise protein intake post-workout for recovery</li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  // ── Questionnaire ─────────────────────────────────────────────────────────
  return (
    <div className="page-layout">
      <Sidebar />
      <MobileHeader />
      <main className="page-content wg-content">
        {showDisclaimer && (
          <DisclaimerModal onAccept={handleAccept} onCancel={() => setShow(false)} />
        )}

        <div className="page-header">
          <div>
            <h1 className="page-title">Workout Generator</h1>
            <p className="page-subtitle">Get a personalised weekly workout split</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="dg-progress-wrap">
          <div className="dg-step-labels">
            {STEPS.map((label, i) => (
              <span
                key={i}
                className={`dg-step-label ${i === step ? "dg-step-label--active" : ""} ${i < step ? "dg-step-label--done" : ""}`}
              >
                {i < step ? "✓" : i + 1}. {label}
              </span>
            ))}
          </div>
          <div className="dg-progress-bar">
            <div className="dg-progress-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        <div className="card dg-form-card">

          {/* ── Step 0: About You ───────────────────────────────────────── */}
          {step === 0 && (
            <div className="dg-step-content">
              <h2 className="dg-step-heading">About you</h2>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <div className="option-grid">
                  <OptionBtn icon={RiMenLine}   label="Male"   selected={form.gender === "male"}   onClick={() => set("gender", "male")} />
                  <OptionBtn icon={RiWomenLine}  label="Female" selected={form.gender === "female"} onClick={() => set("gender", "female")} />
                  <OptionBtn icon={RiTeamLine}   label="Other"  selected={form.gender === "other"}  onClick={() => set("gender", "other")} />
                </div>
                {errors.gender && <span className="dg-error">{errors.gender}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Fitness Level</label>
                <div className="option-grid">
                  <OptionBtn icon={RiLeafLine}       label="Beginner"     sub="New to training"       selected={form.fitnessLevel === "beginner"}     onClick={() => set("fitnessLevel", "beginner")} />
                  <OptionBtn icon={RiFlashlightLine}  label="Intermediate" sub="6+ months experience"  selected={form.fitnessLevel === "intermediate"} onClick={() => set("fitnessLevel", "intermediate")} />
                  <OptionBtn icon={RiFireLine}        label="Advanced"     sub="2+ years training"     selected={form.fitnessLevel === "advanced"}     onClick={() => set("fitnessLevel", "advanced")} />
                </div>
                {errors.fitnessLevel && <span className="dg-error">{errors.fitnessLevel}</span>}
              </div>
            </div>
          )}

          {/* ── Step 1: Goal & Location ─────────────────────────────────── */}
          {step === 1 && (
            <div className="dg-step-content">
              <h2 className="dg-step-heading">Goal & location</h2>

              <div className="form-group">
                <label className="form-label">Primary Goal</label>
                <div className="option-grid">
                  <OptionBtn icon={RiScales2Line} label="Weight Loss" sub="Burn fat & get lean"      selected={form.goal === "weight_loss"} onClick={() => set("goal", "weight_loss")} />
                  <OptionBtn icon={RiWeightLine}  label="Muscle Gain" sub="Build size & strength"    selected={form.goal === "muscle_gain"} onClick={() => set("goal", "muscle_gain")} />
                </div>
                {errors.goal && <span className="dg-error">{errors.goal}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Workout Location</label>
                <div className="option-grid">
                  <OptionBtn icon={RiHome2Line}    label="Home" sub="Minimal equipment"  selected={form.location === "home"} onClick={() => set("location", "home")} />
                  <OptionBtn icon={RiBuildingLine} label="Gym"  sub="Full equipment"     selected={form.location === "gym"}  onClick={() => set("location", "gym")} />
                </div>
                {errors.location && <span className="dg-error">{errors.location}</span>}
              </div>
            </div>
          )}

          {/* ── Step 2: Preferences ─────────────────────────────────────── */}
          {step === 2 && (
            <div className="dg-step-content">
              <h2 className="dg-step-heading">Workout preferences</h2>

              <div className="form-group">
                <label className="form-label">Days per Week</label>
                <div className="option-grid wg-days-grid">
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <OptionBtn key={d} label={String(d)} selected={Number(form.days) === d} onClick={() => set("days", d)} />
                  ))}
                </div>
                {errors.days && <span className="dg-error">{errors.days}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Workout Types (select all that apply)</label>
                <div className="option-grid">
                  <OptionBtn icon={RiWeightLine}      label="Strength"   selected={form.workoutTypes.includes("strength")}   onClick={() => set("workoutTypes", toggleItem(form.workoutTypes, "strength"))} />
                  <OptionBtn icon={RiRunLine}          label="Cardio"     selected={form.workoutTypes.includes("cardio")}     onClick={() => set("workoutTypes", toggleItem(form.workoutTypes, "cardio"))} />
                  <OptionBtn icon={RiFlashlightLine}   label="HIIT"       selected={form.workoutTypes.includes("hiit")}       onClick={() => set("workoutTypes", toggleItem(form.workoutTypes, "hiit"))} />
                  <OptionBtn icon={RiBodyScanLine}     label="Bodyweight" selected={form.workoutTypes.includes("bodyweight")} onClick={() => set("workoutTypes", toggleItem(form.workoutTypes, "bodyweight"))} />
                </div>
                {errors.workoutTypes && <span className="dg-error">{errors.workoutTypes}</span>}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="dg-nav-row">
            {step > 0 && (
              <button className="btn btn-ghost" type="button" onClick={() => setStep((s) => s - 1)}>
                <RiArrowLeftLine size={15} /> Back
              </button>
            )}
            <button className="btn btn-accent dg-next-btn" type="button" onClick={handleNext}>
              {step === STEPS.length - 1 ? "Generate My Plan" : "Next"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutPlanGenerator;
