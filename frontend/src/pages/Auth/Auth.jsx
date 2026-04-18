import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import api from "../../utils/api";
import {
  RiUser3Line,
  RiMailLine,
  RiLockLine,
  RiPhoneLine,
  RiShieldCheckLine,
  RiWeightLine,
  RiArrowRightLine,
  RiRefreshLine,
  RiCheckLine,
} from "react-icons/ri";
import "./Auth.css";

const TABS = { LOGIN: "login", REGISTER: "register", OTP: "otp" };

const InputField = ({
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  minLength,
  maxLength,
  inputMode,
}) => (
  <div className="auth-input-wrap">
    <span className="auth-input-icon">
      <Icon size={16} />
    </span>
    <input
      className="auth-input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      inputMode={inputMode}
      autoComplete="off"
    />
  </div>
);

const Auth = () => {
  const [tab, setTab] = useState(TABS.LOGIN);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);
  const timerRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Start 60s countdown whenever OTP tab opens
  useEffect(() => {
    if (tab === TABS.OTP) {
      setResendTimer(60);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setResendTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [tab]);

  const update = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setError("");
  };

  const startResendTimer = () => {
    setResendTimer(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await api.post("/auth/resend-otp", {
        email: form.email,
      });
      setSuccess(data.message || "New OTP sent!");
      setResendAttempts((a) => a + 1);
      startResendTimer();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        mobile: form.mobile,
      });
      setSuccess("OTP sent to your email!");
      setTab(TABS.OTP);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel — hidden on mobile */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-brand-big">
            <RiWeightLine size={40} className="auth-brand-icon" />
            <span>
              dev<em>Fit</em>
            </span>
          </div>
          <h2 className="auth-tagline">
            Track. Train.
            <br />
            Transform.
          </h2>
          <p className="auth-sub">
            Your minimalist fitness companion — workouts, diet, supplements and
            analytics all in one place.
          </p>
          <div className="auth-features">
            {[
              { icon: RiWeightLine, label: "Workout Logging" },
              { icon: RiCheckLine, label: "Nutrition Tracking" },
              { icon: RiShieldCheckLine, label: "Progress Analytics" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="auth-feature-item">
                <span className="auth-feature-dot">
                  <Icon size={14} />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-right-top">
          <div className="auth-mobile-logo">
            dev<span>Fit</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="auth-card">
          {/* Tabs */}
          {tab !== TABS.OTP && (
            <div className="auth-tabs">
              <button
                className={`auth-tab ${tab === TABS.LOGIN ? "auth-tab--active" : ""}`}
                onClick={() => {
                  setTab(TABS.LOGIN);
                  setError("");
                  setSuccess("");
                }}
              >
                Sign In
              </button>
              <button
                className={`auth-tab ${tab === TABS.REGISTER ? "auth-tab--active" : ""}`}
                onClick={() => {
                  setTab(TABS.REGISTER);
                  setError("");
                  setSuccess("");
                }}
              >
                Create Account
              </button>
            </div>
          )}

          {tab === TABS.OTP && (
            <div className="auth-otp-header">
              <div className="auth-otp-icon-wrap">
                <RiMailLine size={28} />
              </div>
              <h3 className="auth-otp-title">Check your email</h3>
              <p className="auth-otp-desc">
                We sent a 6-digit OTP to
                <br />
                <strong>{form.email}</strong>
              </p>
            </div>
          )}

          {error && <div className="error-message auth-alert">{error}</div>}
          {success && (
            <div className="success-message auth-alert">{success}</div>
          )}

          {tab === TABS.LOGIN && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <InputField
                  icon={RiMailLine}
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <InputField
                  icon={RiLockLine}
                  type="password"
                  value={form.password}
                  onChange={update("password")}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                className="btn btn-primary auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RiRefreshLine size={15} className="spin" /> Signing in…
                  </>
                ) : (
                  <>
                    Sign In <RiArrowRightLine size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {tab === TABS.REGISTER && (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <InputField
                  icon={RiUser3Line}
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <InputField
                  icon={RiMailLine}
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div className="auth-phone-wrap">
                  <span className="auth-phone-icon">
                    <RiPhoneLine size={16} />
                  </span>
                  <span className="auth-phone-prefix">+91</span>
                  <input
                    className="auth-phone-input"
                    type="tel"
                    inputMode="numeric"
                    value={form.mobile}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setForm((p) => ({ ...p, mobile: digits }));
                      setError("");
                    }}
                    placeholder="98765 43210"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Enter a valid 10-digit mobile number"
                    autoComplete="tel"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <InputField
                  icon={RiLockLine}
                  type="password"
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
              </div>
              <button
                className="btn btn-primary auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RiRefreshLine size={15} className="spin" /> Creating…
                  </>
                ) : (
                  <>
                    Create Account <RiArrowRightLine size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {tab === TABS.OTP && (
            <form onSubmit={handleVerifyOTP} className="auth-form">
              <div className="form-group">
                <label className="form-label">Enter 6-digit OTP</label>
                <input
                  className="auth-otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.otp}
                  onChange={update("otp")}
                  placeholder="0  0  0  0  0  0"
                  required
                  autoFocus
                />
              </div>
              <button
                className="btn btn-primary auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RiRefreshLine size={15} className="spin" /> Verifying…
                  </>
                ) : (
                  <>
                    Verify & Continue <RiArrowRightLine size={15} />
                  </>
                )}
              </button>

              <div className="auth-resend-wrap">
                {resendAttempts < 3 ? (
                  resendTimer > 0 ? (
                    <p className="auth-resend-hint">
                      Resend OTP in <strong>{resendTimer}s</strong>
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="auth-resend-btn"
                      onClick={handleResendOTP}
                      disabled={loading}
                    >
                      <RiRefreshLine size={13} /> Resend OTP
                    </button>
                  )
                ) : (
                  <p className="auth-resend-hint auth-resend-hint--max">
                    Max resend attempts reached. Go back and register again.
                  </p>
                )}
              </div>

              <button
                type="button"
                className="auth-back-btn"
                onClick={() => {
                  setTab(TABS.REGISTER);
                  setSuccess("");
                  setResendAttempts(0);
                  clearInterval(timerRef.current);
                }}
              >
                ← Back to registration
              </button>
            </form>
          )}
        </div>

        <p className="auth-footer">
          Made with ♥ by <strong>Ashutosh</strong>
        </p>
      </div>
    </div>
  );
};

export default Auth;
