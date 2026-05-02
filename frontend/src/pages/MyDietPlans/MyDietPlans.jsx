import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiLeafLine,
  RiDeleteBinLine,
  RiFlashlightLine,
  RiAddLine,
  RiEdit2Line,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import MobileHeader from "../../components/MobileHeader/MobileHeader.jsx";
import api from "../../utils/api.js";
import "./MyDietPlans.css";

const MEAL_LABELS = [
  { key: "breakfast", emoji: "🌅", label: "Breakfast" },
  { key: "morningSnack", emoji: "🍎", label: "Morning Snack" },
  { key: "lunch", emoji: "☀️", label: "Lunch" },
  { key: "eveningSnack", emoji: "🥜", label: "Evening Snack" },
  { key: "dinner", emoji: "🌙", label: "Dinner" },
];

const MyDietPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/diet-plans");
      setPlans(data.plans);
      setActivePlanId(data.activeDietPlanId);
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
      await api.post(`/diet-plans/${id}/activate`);
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
      await api.post("/diet-plans/deactivate");
      setActivePlanId(null);
    } catch {
      setError("Failed to deactivate plan.");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this diet plan?")) return;
    setActionLoading(id + "_delete");
    try {
      await api.delete(`/diet-plans/${id}`);
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
      const { data } = await api.put(`/diet-plans/${id}`, {
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
      <main className="page-content mdp-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Diet Plans</h1>
            <p className="page-subtitle">Manage and activate your saved diet plans</p>
          </div>
          <button
            className="btn btn-accent"
            onClick={() => navigate("/diet-plan")}
          >
            <RiAddLine size={15} /> New Plan
          </button>
        </div>

        {error && <div className="mdp-error">{error}</div>}

        {loading ? (
          <div className="dash-loading">Loading…</div>
        ) : plans.length === 0 ? (
          <div className="dash-empty-card">
            <RiLeafLine size={32} className="dash-empty-icon" />
            <p>No diet plans saved yet.</p>
            <button
              className="btn btn-accent"
              style={{ marginTop: 12 }}
              onClick={() => navigate("/diet-plan")}
            >
              Generate a Diet Plan
            </button>
          </div>
        ) : (
          <div className="mdp-list">
            {plans.map((plan) => {
              const isActive = plan._id === activePlanId;
              const isExpanded = expandedId === plan._id;
              return (
                <div
                  key={plan._id}
                  className={`card mdp-card ${isActive ? "mdp-card--active" : ""}`}
                >
                  <div className="mdp-card-header">
                    <div className="mdp-card-title-row">
                      {editingId === plan._id ? (
                        <div className="mdp-rename-row">
                          <input
                            className="form-input mdp-rename-input"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRename(plan._id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            autoFocus
                          />
                          <button
                            className="btn btn-primary mdp-icon-btn"
                            onClick={() => handleRename(plan._id)}
                            disabled={actionLoading === plan._id + "_rename"}
                          >
                            <RiCheckLine size={14} />
                          </button>
                          <button
                            className="btn btn-ghost mdp-icon-btn"
                            onClick={() => setEditingId(null)}
                          >
                            <RiCloseLine size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="mdp-plan-name">{plan.planName}</span>
                          <button
                            className="btn btn-ghost mdp-icon-btn"
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
                        <span className="badge badge-success mdp-active-badge">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Macro summary */}
                    <div className="mdp-macros">
                      <span className="mdp-macro mdp-macro--cal">
                        {plan.calories} kcal
                      </span>
                      <span className="mdp-macro">P: {plan.proteinG}g</span>
                      <span className="mdp-macro">C: {plan.carbG}g</span>
                      <span className="mdp-macro">F: {plan.fatG}g</span>
                      {plan.goal && (
                        <span className="badge badge-info">
                          {plan.goal.replace("_", " ")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expandable meals */}
                  <button
                    className="mdp-expand-btn"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : plan._id)
                    }
                  >
                    {isExpanded ? "▲ Hide meals" : "▼ View meals"}
                  </button>

                  {isExpanded && plan.meals && (
                    <div className="mdp-meals">
                      {MEAL_LABELS.map(({ key, emoji, label }) =>
                        plan.meals[key] ? (
                          <div key={key} className="mdp-meal-row">
                            <span className="mdp-meal-emoji">{emoji}</span>
                            <div className="mdp-meal-info">
                              <span className="mdp-meal-label">{label}</span>
                              <span className="mdp-meal-desc">
                                {plan.meals[key]}
                              </span>
                            </div>
                          </div>
                        ) : null,
                      )}
                    </div>
                  )}

                  <div className="mdp-actions">
                    {isActive ? (
                      <button
                        className="btn btn-ghost mdp-deactivate-btn"
                        onClick={handleDeactivate}
                        disabled={actionLoading === "deactivate"}
                      >
                        {actionLoading === "deactivate" ? "…" : "Deactivate"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary mdp-activate-btn"
                        onClick={() => handleActivate(plan._id)}
                        disabled={actionLoading === plan._id + "_activate"}
                      >
                        <RiFlashlightLine size={14} />
                        {actionLoading === plan._id + "_activate"
                          ? "Activating…"
                          : "Set as Active Diet Plan"}
                      </button>
                    )}
                    <button
                      className="btn btn-ghost mdp-delete-btn"
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

export default MyDietPlans;
