import React, { useState, useEffect, useCallback } from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import {
  RiWeightLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiDownload2Line,
} from "react-icons/ri";
import api from "../../utils/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import { todayISO, formatDate } from "../../utils/helpers";
import "./ExerciseTracker.css";

const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Glutes",
  "Core",
  "Cardio",
  "Full Body",
];
const BLANK = {
  name: "",
  weight: "",
  reps: "",
  sets: "",
  muscleGroup: "",
  notes: "",
  date: todayISO(),
};

const ExerciseTracker = () => {
  const [exercises, setExercises] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterDate, setFilterDate] = useState(todayISO());
  const [showForm, setShowForm] = useState(false);

  const fetchExercises = useCallback(async () => {
    setFetching(true);
    try {
      const { data } = await api.get(`/exercise?date=${filterDate}`);
      setExercises(data.exercises || []);
    } catch {
      setError("Failed to load exercises.");
    } finally {
      setFetching(false);
    }
  }, [filterDate]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const update = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const resetForm = () => {
    setForm({ ...BLANK, date: filterDate });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        weight: Number(form.weight) || 0,
        reps: Number(form.reps),
        sets: Number(form.sets),
      };
      if (editId) await api.put(`/exercise/${editId}`, payload);
      else await api.post("/exercise", payload);
      setSuccess(editId ? "Exercise updated!" : "Exercise logged!");
      resetForm();
      fetchExercises();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ex) => {
    setForm({
      name: ex.name,
      weight: ex.weight || "",
      reps: ex.reps,
      sets: ex.sets,
      muscleGroup: ex.muscleGroup || "",
      notes: ex.notes || "",
      date: ex.date ? ex.date.split("T")[0] : todayISO(),
    });
    setEditId(ex._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exercise?")) return;
    try {
      await api.delete(`/exercise/${id}`);
      setSuccess("Deleted.");
      fetchExercises();
    } catch {
      setError("Failed to delete.");
    }
  };

  const totalVolume = exercises.reduce(
    (s, e) => s + (e.weight || 0) * e.reps * e.sets,
    0,
  );

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Exercises</h1>
            <p className="page-subtitle">
              Log sets, reps, and weight. Track your volume.
            </p>
          </div>
        </div>
        {error && (
          <div className="error-message" style={{ marginBottom: 14 }}>
            {error}
          </div>
        )}
        {success && (
          <div className="success-message" style={{ marginBottom: 14 }}>
            {success}
          </div>
        )}

        <div className="ex-toolbar">
          <div className="form-group">
            <label className="form-label">
              <RiCalendarLine size={12} /> Date
            </label>
            <input
              className="form-input"
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setForm((p) => ({ ...p, date: e.target.value }));
              }}
            />
          </div>
          <button
            className="btn btn-accent"
            onClick={() => {
              setShowForm(!showForm);
              setEditId(null);
              setForm({ ...BLANK, date: filterDate });
            }}
          >
            {showForm ? (
              <>
                <RiCloseLine size={15} /> Cancel
              </>
            ) : (
              <>
                <RiAddLine size={15} /> Log Exercise
              </>
            )}
          </button>
        </div>

        {showForm && (
          <div className="card ex-form-card">
            <h3 className="ex-form-title">
              <RiWeightLine size={16} />{" "}
              {editId ? "Edit Exercise" : "Log New Exercise"}
            </h3>
            <form onSubmit={handleSubmit} className="ex-form">
              <div className="ex-form-grid">
                <div className="form-group ex-span2">
                  <label className="form-label">Exercise Name *</label>
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={update("name")}
                    placeholder="e.g. Bench Press"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Muscle Group</label>
                  <select
                    className="form-select"
                    value={form.muscleGroup}
                    onChange={update("muscleGroup")}
                  >
                    <option value="">Select…</option>
                    {MUSCLE_GROUPS.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={form.weight}
                    onChange={update("weight")}
                    placeholder="0"
                    min="0"
                    step="0.5"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reps *</label>
                  <input
                    className="form-input"
                    type="number"
                    value={form.reps}
                    onChange={update("reps")}
                    placeholder="10"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sets *</label>
                  <input
                    className="form-input"
                    type="number"
                    value={form.sets}
                    onChange={update("sets")}
                    placeholder="3"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group ex-span3">
                  <label className="form-label">Notes</label>
                  <input
                    className="form-input"
                    value={form.notes}
                    onChange={update("notes")}
                    placeholder="Optional notes…"
                  />
                </div>
              </div>
              <div className="ex-form-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={resetForm}
                >
                  <RiCloseLine size={14} /> Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <RiCheckLine size={14} />{" "}
                  {loading ? "Saving…" : editId ? "Update" : "Log Exercise"}
                </button>
              </div>
            </form>
          </div>
        )}

        {exercises.length > 0 && (
          <div className="ex-summary">
            {[
              ["Exercises", exercises.length],
              ["Total Sets", exercises.reduce((s, e) => s + e.sets, 0)],
              ["Volume", `${totalVolume.toLocaleString()}kg`],
            ].map(([l, v]) => (
              <div key={l} className="ex-stat">
                <div className="ex-stat-val">{v}</div>
                <div className="ex-stat-label">{l}</div>
              </div>
            ))}
          </div>
        )}

        <div className="ex-list">
          {fetching ? (
            <div className="dash-loading">Loading…</div>
          ) : exercises.length === 0 ? (
            <div className="empty-state">
              <RiWeightLine size={28} className="empty-state-icon" />
              <div className="empty-state-text">
                No exercises logged for {formatDate(filterDate)}.
              </div>
            </div>
          ) : (
            exercises.map((ex) => (
              <div key={ex._id} className="ex-item">
                <div className="ex-item-icon">
                  <RiWeightLine size={18} />
                </div>
                <div className="ex-item-left">
                  <div className="ex-item-name">{ex.name}</div>
                  <div className="ex-item-meta">
                    {ex.muscleGroup && (
                      <span className="badge badge-info">{ex.muscleGroup}</span>
                    )}
                    <span className="ex-item-stats">
                      {ex.sets}×{ex.reps}
                      {ex.weight ? ` @ ${ex.weight}kg` : ""}
                    </span>
                  </div>
                  {ex.notes && <div className="ex-item-notes">{ex.notes}</div>}
                </div>
                {ex.weight > 0 && (
                  <div className="ex-item-vol">
                    <div className="ex-item-vol-val">
                      {(ex.weight * ex.reps * ex.sets).toLocaleString()}
                    </div>
                    <div className="ex-item-vol-label">kg vol</div>
                  </div>
                )}
                <div className="ex-item-actions">
                  <button
                    className="btn btn-ghost ex-btn-sm"
                    onClick={() => handleEdit(ex)}
                  >
                    <RiEditLine size={14} />
                  </button>
                  <button
                    className="btn btn-danger ex-btn-sm"
                    onClick={() => handleDelete(ex._id)}
                  >
                    <RiDeleteBinLine size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Sticky FAB — mobile only, hidden when form is open */}
        <div className={`sticky-log-fab${showForm ? " sticky-log-fab--hidden" : ""}`}>
          <button
            className="btn btn-accent"
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm({ ...BLANK, date: filterDate });
            }}
          >
            <RiAddLine size={18} /> Log Exercise
          </button>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default ExerciseTracker;
