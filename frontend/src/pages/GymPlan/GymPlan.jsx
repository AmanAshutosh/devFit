import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import {
  RiCalendarCheckLine, RiSaveLine, RiAddLine, RiDeleteBinLine,
  RiHotelBedLine, RiTimeLine, RiBodyScanLine, RiArrowRightLine,
  RiWeightLine,
} from 'react-icons/ri';
import api from '../../utils/api';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import './GymPlan.css';

const DAYS = [1, 2, 3, 4, 5, 6];
const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core', 'Full Body'];

const PRESET_PLANS = [
  {
    level: 'beginner',
    route: '/gym-plan/beginner',
    badge: 'Beginner',
    badgeColor: 'info',
    name: 'Full Body Split',
    subtitle: '3 Days / Week',
    desc: 'Three full-body sessions hitting every muscle group. Ideal for building your foundation and learning movement patterns.',
    stats: ['3 workout days', '6 exercises/day', '~60 min sessions'],
    accent: '#2563eb',
  },
  {
    level: 'intermediate',
    route: '/gym-plan/intermediate',
    badge: 'Intermediate',
    badgeColor: 'accent',
    name: 'PPL + Arnold Split',
    subtitle: '6 Days / Week',
    desc: 'Combines Push/Pull/Legs frequency with Arnold-style bodybuilding pairings for proven intermediate progression.',
    stats: ['6 workout days', '5–6 exercises/day', '~65 min sessions'],
    accent: '#5cb800',
  },
  {
    level: 'advanced',
    route: '/gym-plan/advanced',
    badge: 'Advanced',
    badgeColor: 'danger',
    name: 'PPL + Double Split',
    subtitle: '6 Days / Week — Max Volume',
    desc: 'High frequency PPL for strength combined with Double Muscle Split hypertrophy sessions. For experienced lifters only.',
    stats: ['6 workout days', '6 exercises/day', '~75 min sessions'],
    accent: '#e53e3e',
  },
];

const BADGE_STYLE = {
  info:   { bg: 'var(--info-subtle)',    color: 'var(--info)',       border: 'var(--info)' },
  accent: { bg: 'var(--accent-subtle)',  color: 'var(--accent-dark)', border: 'var(--accent-dark)' },
  danger: { bg: 'var(--danger-subtle)', color: 'var(--danger)',     border: 'var(--danger)' },
};

const GymPlan = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [activeDay, setActiveDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/gymplan')
      .then(({ data }) => setPlan(data.plan || createEmptyPlan()))
      .catch(() => setPlan(createEmptyPlan()))
      .finally(() => setLoading(false));
  }, []);

  const createEmptyPlan = () => ({
    planName: 'My Custom Plan',
    level: 'beginner',
    days: DAYS.map(d => ({ day: d, label: `Day ${d}`, duration: 60, muscleGroups: [], exercises: [], isRestDay: false })),
  });

  const savePlan = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const { data } = await api.post('/gymplan', plan);
      setPlan(data.plan);
      setSuccess('Plan saved successfully!');
    } catch {
      setError('Failed to save plan.');
    } finally {
      setSaving(false);
    }
  };

  const updateDay = (field, value) => setPlan(prev => ({
    ...prev,
    days: prev.days.map(d => d.day === activeDay ? { ...d, [field]: value } : d),
  }));

  const toggleMuscle = (muscle) => {
    const day = plan.days.find(d => d.day === activeDay);
    const cur = day?.muscleGroups || [];
    updateDay('muscleGroups', cur.includes(muscle) ? cur.filter(m => m !== muscle) : [...cur, muscle]);
  };

  const addExercise = () => {
    const day = plan.days.find(d => d.day === activeDay);
    updateDay('exercises', [...(day?.exercises || []), { name: '', sets: 3, reps: '10-12', rest: '60s' }]);
  };

  const updateExercise = (idx, field, value) => {
    const day = plan.days.find(d => d.day === activeDay);
    updateDay('exercises', day.exercises.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
  };

  const removeExercise = (idx) => {
    const day = plan.days.find(d => d.day === activeDay);
    updateDay('exercises', day.exercises.filter((_, i) => i !== idx));
  };

  const currentDay = plan?.days?.find(d => d.day === activeDay);

  if (loading) return (
    <div className="page-layout">
      <Sidebar />
      <MobileHeader />
      <main className="page-content">
        <div className="dash-loading">Loading your gym plan…</div>
      </main>
    </div>
  );

  return (
    <div className="page-layout">
      <Sidebar />
      <MobileHeader />
      <main className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Gym Plan</h1>
            <p className="page-subtitle">Choose a preset plan or build your own 6-day split.</p>
          </div>
        </div>

        {error && <div className="error-message" style={{ marginBottom: 14 }}>{error}</div>}
        {success && <div className="success-message" style={{ marginBottom: 14 }}>{success}</div>}

        {/* ── Preset Plans ─────────────────────────────────────── */}
        <div className="gp-presets-section">
          <h2 className="gp-section-title">
            <RiCalendarCheckLine size={16} /> Structured Plans
          </h2>
          <div className="gp-preset-cards">
            {PRESET_PLANS.map(p => {
              const bs = BADGE_STYLE[p.badgeColor];
              return (
                <button
                  key={p.level}
                  className="gp-preset-card"
                  onClick={() => navigate(p.route)}
                  style={{ '--card-accent': p.accent }}
                >
                  <div className="gp-pc-top">
                    <span
                      className="gp-pc-badge"
                      style={{ background: bs.bg, color: bs.color, borderColor: bs.border }}
                    >
                      {p.badge}
                    </span>
                    <RiArrowRightLine size={18} className="gp-pc-arrow" />
                  </div>
                  <h3 className="gp-pc-name">{p.name}</h3>
                  <p className="gp-pc-sub">{p.subtitle}</p>
                  <p className="gp-pc-desc">{p.desc}</p>
                  <div className="gp-pc-stats">
                    {p.stats.map(s => (
                      <span key={s} className="gp-pc-stat">{s}</span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="gp-divider-row">
          <div className="gp-divider-line" />
          <span className="gp-divider-text">or build your own</span>
          <div className="gp-divider-line" />
        </div>

        {/* ── Custom Plan Builder ───────────────────────────────── */}
        <div className="gp-builder-header">
          <div>
            <h2 className="gp-section-title">
              <RiWeightLine size={16} /> Custom Plan Builder
            </h2>
            <p className="gp-builder-sub">Create a personalized 6-day split from scratch.</p>
          </div>
          <button className="btn btn-primary" onClick={savePlan} disabled={saving}>
            <RiSaveLine size={15} />
            {saving ? 'Saving…' : 'Save Plan'}
          </button>
        </div>

        {/* Plan meta */}
        <div className="card gp-meta-card">
          <div className="gp-meta-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Plan Name</label>
              <input
                className="form-input"
                value={plan?.planName || ''}
                onChange={e => setPlan(p => ({ ...p, planName: e.target.value }))}
                placeholder="My Custom Plan"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Level</label>
              <select
                className="form-select"
                value={plan?.level || 'beginner'}
                onChange={e => setPlan(p => ({ ...p, level: e.target.value }))}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Day tabs */}
        <div className="gp-day-tabs-wrap">
          <div className="gp-day-tabs">
            {DAYS.map(d => {
              const dd = plan?.days?.find(x => x.day === d);
              return (
                <button
                  key={d}
                  className={`gp-day-tab ${activeDay === d ? 'gp-day-tab--active' : ''} ${dd?.isRestDay ? 'gp-day-tab--rest' : ''}`}
                  onClick={() => setActiveDay(d)}
                >
                  <span className="gp-day-num">Day {d}</span>
                  <span className="gp-day-label">{dd?.isRestDay ? 'Rest' : (dd?.label || '—')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day editor */}
        {currentDay && (
          <div className="card gp-editor">
            <div className="gp-editor-head">
              <h3 className="gp-editor-title">
                Day {activeDay} — {currentDay.isRestDay ? 'Rest Day' : currentDay.label || 'Workout'}
              </h3>
              <label className="gp-rest-toggle">
                <input
                  type="checkbox"
                  checked={currentDay.isRestDay || false}
                  onChange={e => updateDay('isRestDay', e.target.checked)}
                />
                <RiHotelBedLine size={14} /> Rest Day
              </label>
            </div>

            {!currentDay.isRestDay ? (
              <>
                <div className="gp-fields">
                  <div className="form-group">
                    <label className="form-label">Label</label>
                    <input
                      className="form-input"
                      value={currentDay.label || ''}
                      onChange={e => updateDay('label', e.target.value)}
                      placeholder="e.g. Chest + Triceps"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><RiTimeLine size={11} /> Duration (min)</label>
                    <input
                      className="form-input"
                      type="number"
                      value={currentDay.duration || ''}
                      onChange={e => updateDay('duration', Number(e.target.value))}
                      min="10"
                      max="180"
                    />
                  </div>
                </div>

                <div className="gp-muscles">
                  <label className="form-label"><RiBodyScanLine size={11} /> Muscle Groups</label>
                  <div className="gp-muscle-chips">
                    {MUSCLE_GROUPS.map(m => (
                      <button
                        key={m}
                        type="button"
                        className={`gp-chip ${currentDay.muscleGroups?.includes(m) ? 'gp-chip--active' : ''}`}
                        onClick={() => toggleMuscle(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="gp-exercises">
                  <div className="gp-ex-head">
                    <label className="form-label">Exercises</label>
                    <button type="button" className="btn btn-ghost gp-add-btn" onClick={addExercise}>
                      <RiAddLine size={13} /> Add
                    </button>
                  </div>
                  {currentDay.exercises?.length === 0 && (
                    <div className="gp-ex-empty">No exercises yet. Click Add to build your workout.</div>
                  )}
                  {currentDay.exercises?.map((ex, idx) => (
                    <div key={idx} className="gp-ex-row">
                      <input
                        className="form-input gp-ex-name"
                        value={ex.name}
                        onChange={e => updateExercise(idx, 'name', e.target.value)}
                        placeholder="Exercise name"
                      />
                      <div className="gp-ex-nums">
                        <input
                          className="form-input"
                          type="number"
                          value={ex.sets}
                          onChange={e => updateExercise(idx, 'sets', Number(e.target.value))}
                          placeholder="Sets"
                          min="1"
                        />
                        <input
                          className="form-input"
                          value={ex.reps}
                          onChange={e => updateExercise(idx, 'reps', e.target.value)}
                          placeholder="Reps"
                        />
                        <input
                          className="form-input"
                          value={ex.rest}
                          onChange={e => updateExercise(idx, 'rest', e.target.value)}
                          placeholder="Rest"
                        />
                      </div>
                      <button className="btn btn-danger gp-remove-btn" onClick={() => removeExercise(idx)}>
                        <RiDeleteBinLine size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="gp-rest-msg">
                <RiHotelBedLine size={32} />
                <p>Rest day. Recovery is where growth happens.</p>
              </div>
            )}
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
};

export default GymPlan;
