import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiWeightLine,
  RiDeleteBinLine,
  RiFlashlightLine,
  RiCheckboxCircleLine,
  RiAddLine,
  RiEdit2Line,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import MobileHeader from "../../components/MobileHeader/MobileHeader.jsx";
import api from "../../utils/api.js";
import "./MyWorkoutPlans.css";

const MyWorkoutPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/workout-plans");
      setPlans(data.plans);
      setActivePlanId(data.activeWorkoutPlanId);
    } catch {
      setError("Failed to load plans.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleActivate = async (id) => {
    setActionLoading(id + "_activate");
    try {
      await api.post(`/workout-plans/${id}/activate`);
      setActivePlanId(id);
    } catch {
      setError("Failed to activate plan.");
    } finally {
      setActionLoading("");
    }
  };

  const handleDeactivate = async () => {
    setActionLoading("deactivate");
    try {
      await api.post("/workout-plans/deactivate");
      setActivePlanId(null);
    } catch {
      setError("Failed to deactivate plan.");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    setActionLoading(id + "_delete");
    try {
      await api.delete(`/workout-plans/${id}`);
      setPlans((p) => p.filter((pl) => pl._id !== id));
      if (activePlanId === id) setActivePlanId(null);
    } catch {
      setError("Failed to delete plan.");
    } finally {
      setActionLoading("");
    }
  };

  const handleRename = async (id) => {
    if (!editName.trim()) return;
    setActionLoading(id + "_rename");
    try {
      const { data } = await api.put(`/workout-plans/${id}`, {
        planName: editName.trim(),
      });
      setPlans((p) => p.map((pl) => (pl._id === id ? data.plan : pl)));
      setEditingId(null);
    } catch {
      setError("Failed to rename plan.");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <MobileHeader />
      <main className="page-content mwp-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Workout Plans</h1>
            <p className="page-subtitle">Manage and activate your saved plans</p>
          </div>
          <button
            className="btn btn-accent"
            onClick={() => navigate("/workout-plan")}
          >
            <RiAddLine size={15} /> New Plan
          </button>
        </div>

        {error && <div className="mwp-error">{error}</div>}

        {loading ? (
          <div className="dash-loading">Loading…</div>
        ) : plans.length === 0 ? (
          <div className="dash-empty-card">
            <RiWeightLine size={32} className="dash-empty-icon" />
            <p>No workout plans saved yet.</p>
            <button
              className="btn btn-accent"
              style={{ marginTop: 12 }}
              onClick={() => navigate("/workout-plan")}
            >
              Generate a Plan
            </button>
          </div>
        ) : (
          <div className="mwp-list">
            {plans.map((plan) => {
              const isActive = plan._id === activePlanId;
              return (
                <div
                  key={plan._id}
                  className={`card mwp-card ${isActive ? "mwp-card--active" : ""}`}
                >
                  <div className="mwp-card-header">
                    <div className="mwp-card-title-row">
                      {editingId === plan._id ? (
                        <div className="mwp-rename-row">
                          <input
                            className="form-input mwp-rename-input"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRename(plan._id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            autoFocus
                          />
                          <button
                            className="btn btn-primary mwp-icon-btn"
                            onClick={() => handleRename(plan._id)}
                            disabled={actionLoading === plan._id + "_rename"}
                          >
                            <RiCheckLine size={14} />
                          </button>
                          <button
                            className="btn btn-ghost mwp-icon-btn"
                            onClick={() => setEditingId(null)}
                          >
                            <RiCloseLine size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="mwp-plan-name">{plan.planName}</span>
                          <button
                            className="btn btn-ghost mwp-icon-btn"
                            title="Rename"
                            onClick={() => {
                              setEditingId(plan._id);
                              setEditName(plan.planName);
                            }}
                          >
                            <RiEdit2Line size={14} />
                          </button>
                        </>
                      )}
                      {isActive && (
                        <span className="badge badge-success mwp-active-badge">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="mwp-meta">
                      {plan.metadata?.fitnessLevel && (
                        <span className="badge badge-info">
                          {plan.metadata.fitnessLevel}
                        </span>
                      )}
                      {plan.metadata?.goal && (
                        <span className="badge badge-info">
                          {plan.metadata.goal.replace("_", " ")}
                        </span>
                      )}
                      {plan.metadata?.location && (
                        <span className="badge badge-info">
                          {plan.metadata.location}
                        </span>
                      )}
                      <span className="mwp-days-count">
                        {plan.schedule?.length ?? 0} days/week
                      </span>
                    </div>
                  </div>

                  {/* Schedule preview */}
                  <div className="mwp-schedule-preview">
                    {(plan.schedule || []).slice(0, 3).map((d, i) => (
                      <div key={i} className="mwp-day-pill">
                        <span className="mwp-day-name">{d.day?.slice(0, 3)}</span>
                        <span className="mwp-day-label">{d.label}</span>
                      </div>
                    ))}
                    {plan.schedule?.length > 3 && (
                      <div className="mwp-day-pill mwp-day-pill--more">
                        +{plan.schedule.length - 3} more
                      </div>
                    )}
                  </div>

                  <div className="mwp-actions">
                    {isActive ? (
                      <button
                        className="btn btn-ghost mwp-deactivate-btn"
                        onClick={handleDeactivate}
                        disabled={actionLoading === "deactivate"}
                      >
                        {actionLoading === "deactivate" ? "…" : "Deactivate"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary mwp-activate-btn"
                        onClick={() => handleActivate(plan._id)}
                        disabled={actionLoading === plan._id + "_activate"}
                      >
                        <RiFlashlightLine size={14} />
                        {actionLoading === plan._id + "_activate"
                          ? "Activating…"
                          : "Set as Active Plan"}
                      </button>
                    )}
                    <button
                      className="btn btn-ghost mwp-delete-btn"
                      onClick={() => handleDelete(plan._id)}
                      disabled={actionLoading === plan._id + "_delete"}
                      title="Delete plan"
                    >
                      <RiDeleteBinLine size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyWorkoutPlans;
