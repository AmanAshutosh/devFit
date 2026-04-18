import React, { useState, useEffect, useCallback } from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import {
  RiUser3Line,
  RiMailLine,
  RiScales3Line,
  RiBodyScanLine,
  RiDownload2Line,
  RiBellLine,
  RiNotificationOffLine,
  RiCheckLine,
  RiEditLine,
  RiSaveLine,
  RiLogoutBoxRLine,
  RiFireLine,
  RiCalendarLine,
  RiPhoneLine,
  RiCalendarCheckLine,
  RiSmartphoneLine,
  RiDeleteBinLine,
} from "react-icons/ri";

// Generate an .ics calendar file with daily alarm at gym time
const downloadCalendarEvent = (gymTime, userName = "You") => {
  if (!gymTime) return;
  const [hh, mm] = gymTime.split(":").map(Number);
  const now = new Date();
  // Build DTSTART as today at gym time (local → UTC offset)
  const pad = (n) => String(n).padStart(2, "0");
  const dtBase = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const dtTime = `${pad(hh)}${pad(mm)}00`;
  // End 1 hour later
  const endHh = (hh + 1) % 24;
  const dtEnd = `${dtBase}T${pad(endHh)}${pad(mm)}00`;
  const dtStart = `${dtBase}T${dtTime}`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//devFit//Workout Reminder//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    "RRULE:FREQ=DAILY",
    "SUMMARY:💪 devFit — Workout Time",
    `DESCRIPTION:Hi ${userName}! Time to crush your workout. Open devFit to log your session.`,
    "LOCATION:Gym",
    "BEGIN:VALARM",
    "TRIGGER:-PT0M",
    "ACTION:DISPLAY",
    "DESCRIPTION:💪 devFit — Gym Time!",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "devfit-workout-reminder.ics";
  a.click();
  URL.revokeObjectURL(url);
};
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import { calculateBMI, getBMICategory } from "../../utils/helpers";
import { exportFullReport } from "../../utils/exportExcel";
import XPProgressBar from "../../components/XPProgressBar/XPProgressBar";
import "./Profile.css";

const Profile = () => {
  const { user, refreshUser, logout } = useAuth();
  const [form, setForm] = useState({
    name: "",
    age: "",
    username: "",
    weight: "",
    heightFeet: "",
    heightInches: "",
    gymTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notifStatus, setNotifStatus] = useState(
    Notification?.permission || "default",
  );

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        age: user.age || "",
        username: user.username || "",
        weight: user.weight || "",
        heightFeet: user.heightFeet || "",
        heightInches: user.heightInches ?? "",
        gymTime: user.gymTime || "",
      });
    }
    setNotifStatus(Notification?.permission || "default");
  }, [user]);

  const bmi = calculateBMI(form.weight, form.heightFeet, form.heightInches);
  const bmiInfo = getBMICategory(bmi);

  const update = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.put("/user/profile", {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        heightFeet: form.heightFeet ? Number(form.heightFeet) : undefined,
        heightInches:
          form.heightInches !== "" ? Number(form.heightInches) : undefined,
      });
      await refreshUser();
      setSuccess("Profile saved successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const [exRes, suppRes, dietRes] = await Promise.all([
        api.get("/exercise/export"),
        api.get("/supplements?date=" + new Date().toISOString().split("T")[0]),
        api.get("/diet/history"),
      ]);
      exportFullReport(
        exRes.data.exercises || [],
        suppRes.data.supplements || [],
        dietRes.data.history || [],
        user,
      );
      setSuccess("Report exported successfully!");
    } catch {
      setError("Failed to export report.");
    } finally {
      setExporting(false);
    }
  };

  const handleResetProgress = async () => {
    if (
      !window.confirm(
        "This will permanently delete ALL your exercises, diet logs, supplements, and gym plans. Your streak will also reset.\n\nThis cannot be undone. Continue?",
      )
    )
      return;
    setResetting(true);
    setError("");
    setSuccess("");
    try {
      await api.delete("/user/reset-progress");
      await refreshUser(); // sync AuthContext + localStorage so streak shows 1 immediately
      setSuccess("All progress has been reset.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset progress.");
    } finally {
      setResetting(false);
    }
  };

  const handleEnableNotifications = useCallback(async () => {
    if (!("Notification" in window)) {
      setError("This browser does not support notifications.");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotifStatus(permission);
      if (permission === "granted") {
        await api.put("/user/profile", { notificationsEnabled: true });
        await refreshUser();
        // Send a test notification
        new Notification("devFit 💪", {
          body: "Notifications enabled! We'll remind you at your gym time.",
          icon: "/logo192.png",
        });
        setSuccess(
          "Notifications enabled! You'll get reminders at " +
            (form.gymTime || "your set gym time") +
            ".",
        );
      } else {
        setError(
          "Notification permission denied. Please allow notifications in your browser settings.",
        );
      }
    } catch (err) {
      setError("Failed to enable notifications: " + err.message);
    }
  }, [form.gymTime, refreshUser]);

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Profile</h1>
            <p className="page-subtitle">
              Manage your personal info and body stats.
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

        {/* FitXP Level-Up Bar */}
        {user?.totalFitXP !== undefined && (
          <div style={{ marginBottom: 20 }}>
            <XPProgressBar totalFitXP={user.totalFitXP || 0} />
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="profile-grid">
            {/* Personal Info */}
            <div className="card profile-card">
              <h2 className="profile-card-title">
                <RiUser3Line size={16} /> Personal Info
              </h2>
              <div className="profile-uid-row">
                <span className="profile-uid-label">User ID</span>
                <span className="profile-uid-val">
                  @{user?.username || "—"}
                </span>
              </div>
              <div className="profile-fields">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <RiUser3Line size={15} />
                    </span>
                    <input
                      className="auth-input"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <RiMailLine size={15} />
                    </span>
                    <input
                      className="auth-input"
                      value={user?.email || ""}
                      disabled
                      style={{ opacity: 0.5, cursor: "not-allowed" }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <div className="auth-input-wrap">
                    <span
                      className="auth-input-icon"
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                      }}
                    >
                      @
                    </span>
                    <input
                      className="auth-input"
                      value={form.username}
                      onChange={update("username")}
                      placeholder="unique_handle"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <RiCalendarLine size={15} />
                    </span>
                    <input
                      className="auth-input"
                      type="number"
                      value={form.age}
                      onChange={update("age")}
                      placeholder="25"
                      min="10"
                      max="120"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Body Measurements */}
            <div className="card profile-card">
              <h2 className="profile-card-title">
                <RiBodyScanLine size={16} /> Body Measurements
              </h2>
              {bmi && (
                <div className="profile-bmi-box">
                  <div
                    className="profile-bmi-num"
                    style={{ color: bmiInfo.color }}
                  >
                    {bmi}
                  </div>
                  <div className="profile-bmi-cat">
                    {bmiInfo.label} ·{" "}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {bmiInfo.range}
                    </span>
                  </div>
                  <div className="profile-bmi-track">
                    <div
                      className="profile-bmi-fill"
                      style={{
                        width: `${Math.min(100, (bmi / 40) * 100)}%`,
                        background: bmiInfo.color,
                      }}
                    />
                  </div>
                  <div className="profile-bmi-scale">
                    <span>Under</span>
                    <span>Normal</span>
                    <span>Over</span>
                    <span>Obese</span>
                  </div>
                </div>
              )}
              <div className="profile-fields">
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <RiScales3Line size={15} />
                    </span>
                    <input
                      className="auth-input"
                      type="number"
                      value={form.weight}
                      onChange={update("weight")}
                      placeholder="70"
                      min="20"
                      max="500"
                      step="0.1"
                    />
                  </div>
                </div>
                <div className="profile-height-row">
                  <div className="form-group">
                    <label className="form-label">Feet</label>
                    <input
                      className="form-input"
                      type="number"
                      value={form.heightFeet}
                      onChange={update("heightFeet")}
                      placeholder="5"
                      min="1"
                      max="9"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Inches</label>
                    <input
                      className="form-input"
                      type="number"
                      value={form.heightInches}
                      onChange={update("heightInches")}
                      placeholder="10"
                      min="0"
                      max="11"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gym Settings & Notifications */}
            <div className="card profile-card">
              <h2 className="profile-card-title">
                <RiBellLine size={16} /> Gym & Notifications
              </h2>
              <div className="profile-fields">
                <div className="form-group">
                  <label className="form-label">Daily Gym Reminder Time</label>
                  <input
                    className="form-input"
                    type="time"
                    value={form.gymTime}
                    onChange={update("gymTime")}
                  />
                  {form.gymTime && (
                    <p className="profile-notif-hint" style={{ marginTop: 4 }}>
                      Reminder set for <strong>{form.gymTime}</strong> every
                      day.
                    </p>
                  )}
                </div>

                {/* Browser notification */}
                <div className="profile-notif-status">
                  {notifStatus === "granted" ? (
                    <div className="profile-notif-granted">
                      <RiCheckLine size={14} /> Browser notifications enabled
                    </div>
                  ) : notifStatus === "denied" ? (
                    <div className="profile-notif-denied">
                      <RiNotificationOffLine size={14} /> Blocked in browser
                      settings
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-ghost profile-notif-btn"
                      onClick={handleEnableNotifications}
                    >
                      <RiBellLine size={15} /> Enable Browser Notifications
                    </button>
                  )}
                </div>
                {notifStatus === "denied" && (
                  <p className="profile-notif-hint">
                    To enable: click the 🔒 lock icon in your address bar →
                    Notifications → Allow.
                  </p>
                )}

                {/* Calendar export */}
                <div className="profile-calendar-section">
                  <div className="profile-calendar-title">
                    <RiCalendarCheckLine size={14} /> Add to Phone Calendar
                  </div>
                  <p className="profile-calendar-desc">
                    Download a recurring calendar event that triggers an alarm
                    at your gym time — works on iPhone (Apple Calendar), Android
                    (Google Calendar), and all desktop calendars.
                  </p>
                  <div className="profile-calendar-btns">
                    <button
                      type="button"
                      className="btn btn-accent profile-cal-btn"
                      disabled={!form.gymTime}
                      onClick={() =>
                        downloadCalendarEvent(form.gymTime, user?.name)
                      }
                    >
                      <RiCalendarCheckLine size={14} />
                      <span>Download .ics Calendar Event</span>
                    </button>
                    <div className="profile-cal-platforms">
                      <span>
                        <RiSmartphoneLine size={11} /> iPhone → tap to open in
                        Calendar
                      </span>
                      <span>
                        <RiSmartphoneLine size={11} /> Android → opens Google
                        Calendar
                      </span>
                    </div>
                  </div>
                  {!form.gymTime && (
                    <p className="profile-notif-hint">
                      Set a gym time above first.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Export & Account */}
            <div className="card profile-card">
              <h2 className="profile-card-title">
                <RiDownload2Line size={16} /> Data Export
              </h2>
              <p className="profile-export-desc">
                Download your full fitness report: exercises, supplements, diet
                history, and BMI — all in one Excel file.
              </p>
              <button
                type="button"
                className="btn btn-ghost profile-export-btn"
                onClick={handleExport}
                disabled={exporting}
              >
                <RiDownload2Line size={15} />
                {exporting ? "Exporting…" : "Export Full Report (.xlsx)"}
              </button>
              <div className="divider" />
              <div className="profile-account-rows">
                <div className="profile-info-row">
                  <span className="profile-info-label">Member since</span>
                  <span className="profile-info-val">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Streak</span>
                  <span className="profile-info-val">
                    <RiFireLine size={12} /> {user?.streak ?? 0} days
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <RiSaveLine size={15} />
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="card profile-danger-card">
            <h2 className="profile-card-title profile-danger-title">
              <RiDeleteBinLine size={16} /> Danger Zone
            </h2>
            <p className="profile-danger-desc">
              Permanently delete all your logged exercises, diet entries,
              supplements, and gym plans. Your account stays active but all
              progress is wiped. <strong>This cannot be undone.</strong>
            </p>
            <button
              type="button"
              className="btn profile-reset-btn"
              onClick={handleResetProgress}
              disabled={resetting}
            >
              <RiDeleteBinLine size={15} />
              {resetting ? "Resetting…" : "Reset All Progress"}
            </button>
          </div>
        </form>

        <Footer />
      </main>
    </div>
  );
};

export default Profile;
