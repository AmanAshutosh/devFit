import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  RiArrowLeftLine,
  RiTimeLine,
  RiFireLine,
  RiBodyScanLine,
  RiCalendarCheckLine,
  RiImageLine,
} from "react-icons/ri";
import Sidebar from "../../components/Sidebar/Sidebar";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import Footer from "../../components/Footer/Footer";
import WORKOUT_PLANS, { FALLBACK_IMG } from "../../data/workoutPlans";
import "./PlanPage.css";

const BADGE_COLORS = {
  info: {
    bg: "var(--info-subtle)",
    color: "var(--info)",
    border: "var(--info)",
  },
  accent: {
    bg: "var(--accent-subtle)",
    color: "var(--accent-dark)",
    border: "var(--accent-dark)",
  },
  danger: {
    bg: "var(--danger-subtle)",
    color: "var(--danger)",
    border: "var(--danger)",
  },
};

const ExerciseCard = ({ exercise, index }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="pp-ex-card">
      <div className="pp-ex-img-wrap">
        {!imgError ? (
          <img
            src={exercise.image}
            alt={exercise.name}
            className="pp-ex-img"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="pp-ex-img-fallback">
            <RiImageLine size={28} />
            <span>{exercise.name}</span>
          </div>
        )}
        <div className="pp-ex-num">#{index + 1}</div>
      </div>
      <div className="pp-ex-body">
        <h4 className="pp-ex-name">{exercise.name}</h4>
        <div className="pp-ex-stats">
          <div className="pp-ex-stat">
            <span className="pp-ex-stat-label">Sets</span>
            <span className="pp-ex-stat-val">{exercise.sets}</span>
          </div>
          <div className="pp-ex-stat">
            <span className="pp-ex-stat-label">Reps</span>
            <span className="pp-ex-stat-val">{exercise.reps}</span>
          </div>
          <div className="pp-ex-stat">
            <span className="pp-ex-stat-label">Rest</span>
            <span className="pp-ex-stat-val">{exercise.rest}</span>
          </div>
        </div>
        {exercise.muscles && exercise.muscles.length > 0 && (
          <div className="pp-ex-muscles">
            {exercise.muscles.map((m) => (
              <span key={m} className="pp-muscle-chip">
                {m}
              </span>
            ))}
          </div>
        )}
        <p className="pp-ex-desc">{exercise.description}</p>
      </div>
    </div>
  );
};

const PlanPage = () => {
  const { level } = useParams();
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(0);

  const plan = WORKOUT_PLANS[level];

  if (!plan) {
    return (
      <div className="page-layout">
        <Sidebar />
        <MobileHeader />
        <main className="page-content">
          <div className="pp-not-found">
            <div className="pp-not-found-icon">🏋️</div>
            <h2>Plan not found</h2>
            <p>
              The plan <strong>"{level}"</strong> does not exist.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/gym-plan")}
            >
              <RiArrowLeftLine size={15} /> Back to Gym Plans
            </button>
          </div>
        </main>
      </div>
    );
  }

  const badgeStyle = BADGE_COLORS[plan.badgeColor] || BADGE_COLORS.accent;
  const currentDay = plan.days[activeDay];
  const totalExercises = plan.days.reduce((s, d) => s + d.exercises.length, 0);

  return (
    <div className="page-layout">
      <Sidebar />
      <MobileHeader />
      <main className="page-content">
        {/* Back button */}
        <button className="pp-back-btn" onClick={() => navigate("/gym-plan")}>
          <RiArrowLeftLine size={15} /> All Plans
        </button>

        {/* Hero header */}
        <div className="pp-hero">
          <div className="pp-hero-left">
            <span
              className="pp-hero-badge"
              style={{
                background: badgeStyle.bg,
                color: badgeStyle.color,
                borderColor: badgeStyle.border,
              }}
            >
              {plan.badge}
            </span>
            <h1 className="pp-hero-title">{plan.name}</h1>
            <p className="pp-hero-subtitle">{plan.subtitle}</p>
            <p className="pp-hero-desc">{plan.description}</p>
          </div>
          <div className="pp-hero-stats">
            <div className="pp-hstat">
              <span className="pp-hstat-num">{plan.totalDays}</span>
              <span className="pp-hstat-label">Days / Week</span>
            </div>
            <div className="pp-hstat">
              <span className="pp-hstat-num">{totalExercises}</span>
              <span className="pp-hstat-label">Total Exercises</span>
            </div>
            <div className="pp-hstat">
              <span className="pp-hstat-num">
                {Math.round(
                  plan.days.reduce((s, d) => s + (d.duration || 60), 0) /
                    plan.days.length,
                )}
                m
              </span>
              <span className="pp-hstat-label">Avg Session</span>
            </div>
          </div>
        </div>

        {/* Rest note */}
        {plan.restDays && (
          <div className="pp-rest-note">
            <RiCalendarCheckLine size={14} /> {plan.restDays}
          </div>
        )}

        {/* Day tabs */}
        <div className="pp-day-tabs-wrap">
          <div className="pp-day-tabs">
            {plan.days.map((day, i) => (
              <button
                key={day.day}
                className={`pp-day-tab${activeDay === i ? " pp-day-tab--active" : ""}`}
                onClick={() => setActiveDay(i)}
              >
                <span className="pp-tab-day">Day {day.day}</span>
                <span className="pp-tab-label">{day.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current day info */}
        {currentDay && (
          <>
            <div className="pp-day-header">
              <div>
                <h2 className="pp-day-title">
                  Day {currentDay.day} — {currentDay.label}
                </h2>
                <p className="pp-day-focus">{currentDay.focus}</p>
              </div>
              <div className="pp-day-meta">
                <span className="pp-day-metaitem">
                  <RiTimeLine size={13} /> {currentDay.duration} min
                </span>
                <span className="pp-day-metaitem">
                  <RiFireLine size={13} /> {currentDay.exercises.length}{" "}
                  exercises
                </span>
                <span className="pp-day-metaitem">
                  <RiBodyScanLine size={13} />{" "}
                  {currentDay.muscleGroups.join(", ")}
                </span>
              </div>
            </div>

            {/* Exercise grid */}
            <div className="pp-ex-grid">
              {currentDay.exercises.map((ex, idx) => (
                <ExerciseCard
                  key={`${currentDay.day}-${idx}`}
                  exercise={ex}
                  index={idx}
                />
              ))}
            </div>
          </>
        )}

        <Footer />
      </main>
    </div>
  );
};

export default PlanPage;
