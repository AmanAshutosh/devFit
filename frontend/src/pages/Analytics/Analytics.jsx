import React, { useState, useEffect, useCallback, useRef } from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import {
  RiLineChartLine,
  RiBarChart2Line,
  RiFireLine,
  RiCalendarCheckLine,
  RiWeightLine,
  RiScales3Line,
  RiTrophyLine,
  RiTimeLine,
  RiMoonLine,
  RiDropLine,
  RiWalkLine,
  RiHeartPulseLine,
} from "react-icons/ri";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import api from "../../utils/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import "./Analytics.css";

const RANGES = [
  { label: "7D", value: 7 },
  { label: "30D", value: 30 },
  { label: "90D", value: 90 },
];

const MUSCLE_COLORS = {
  Chest: "#FF6B6B",
  Back: "#4D96FF",
  Shoulders: "#FFE66D",
  Biceps: "#06D6A0",
  Triceps: "#FB8500",
  Legs: "#8338EC",
  Glutes: "#FF006E",
  Core: "#A8DADC",
  Cardio: "#457B9D",
  "Full Body": "#F4A261",
};
const FALLBACK_COLORS = [
  "#FF6B6B",
  "#4D96FF",
  "#FFE66D",
  "#06D6A0",
  "#FB8500",
  "#8338EC",
  "#FF006E",
  "#A8DADC",
];
const getMuscleColor = (m, i) =>
  MUSCLE_COLORS[m] || FALLBACK_COLORS[i % FALLBACK_COLORS.length];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: p.color }} />
          <span>{p.name}</span>
          <strong style={{ color: p.color }}>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const StatBox = ({ icon: Icon, label, value, color, sub }) => (
  <div className="analytics-stat-box">
    <div className="analytics-stat-icon" style={{ color }}>
      <Icon size={22} />
    </div>
    <div className="analytics-stat-val">{value}</div>
    <div className="analytics-stat-label">{label}</div>
    {sub && <div className="analytics-stat-sub">{sub}</div>}
  </div>
);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [range, setRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const [visibleLines, setVisibleLines] = useState({});
  const intervalRef = useRef(null);

  const fetchData = useCallback(() => {
    api
      .get(`/analytics/overview?days=${range}`)
      .then(({ data: d }) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [range]);

  useEffect(() => {
    setLoading(true);
    fetchData();

    intervalRef.current = setInterval(fetchData, 30000);
    const onFocus = () => fetchData();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchData]);

  // ── Derived chart data ──────────────────────────────────────────────────────
  const workoutData =
    data?.workoutDays?.map((d) => ({
      date: d._id.slice(5),
      sets: d.totalSets,
      exercises: d.exercises?.length || 0,
    })) || [];

  const calorieData =
    data?.calorieHistory?.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
      calories: d.totalCalories,
      protein: d.totalProtein,
      carbs: d.totalCarbs,
      fats: d.totalFats,
    })) || [];

  // Health trend data (sleep h, water L, steps)
  const sleepChartData = (data?.sleepHistory || []).map((d) => ({
    date: d.date.slice(5),
    hours: d.hours,
  }));

  const waterChartData = (data?.waterHistory || []).map((d) => ({
    date: d.date.slice(5),
    L: Math.round((d.totalMl / 1000) * 10) / 10,
  }));

  const stepsChartData = (data?.stepsHistory || []).map((d) => ({
    date: d.date.slice(5),
    steps: d.steps,
  }));

  const hasHealthData =
    sleepChartData.length > 0 ||
    waterChartData.length > 0 ||
    stepsChartData.length > 0;

  // Muscle group multi-line data
  const allMuscles = [
    ...new Set(
      (data?.workoutDays || [])
        .flatMap((d) => d.muscleGroups || [])
        .filter(Boolean),
    ),
  ];

  const muscleChartData = (data?.workoutDays || []).map((d) => {
    const row = { date: d._id.slice(5) };
    (d.muscleGroups || []).filter(Boolean).forEach((mg) => {
      row[mg] = (row[mg] || 0) + 1;
    });
    return row;
  });

  useEffect(() => {
    if (!allMuscles.length) return;
    setVisibleLines((prev) => {
      const next = { ...prev };
      allMuscles.forEach((m) => {
        if (next[m] === undefined) next[m] = true;
      });
      return next;
    });
  }, [allMuscles.join(",")]); // eslint-disable-line

  const toggleLine = (muscle) =>
    setVisibleLines((prev) => ({ ...prev, [muscle]: !prev[muscle] }));

  const totalSets = workoutData.reduce((s, d) => s + d.sets, 0);
  const avgCalories =
    calorieData.length > 0
      ? Math.round(
          calorieData.reduce((s, d) => s + (d.calories || 0), 0) /
            calorieData.length,
        )
      : 0;

  return (
    <div className="page-layout">
      <Sidebar />
      <MobileHeader />
      <main className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Analytics</h1>
            <p className="page-subtitle">
              Your fitness journey from day one to today.
            </p>
          </div>
          <div className="analytics-range">
            {RANGES.map((r) => (
              <button
                key={r.value}
                className={`analytics-range-btn ${range === r.value ? "analytics-range-btn--active" : ""}`}
                onClick={() => setRange(r.value)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="dash-loading">Loading analytics…</div>
        ) : (
          <>
            {/* ── Stat boxes ────────────────────────────────────────────── */}
            <div className="analytics-stats">
              <StatBox
                icon={RiFireLine}
                label="Day Streak"
                value={`${data?.streak ?? 0}d`}
                color="#f59e0b"
                sub="keep going!"
              />
              <StatBox
                icon={RiCalendarCheckLine}
                label="Active Days"
                value={data?.workoutDays?.length ?? 0}
                color="#3b82f6"
                sub={`in ${range} days`}
              />
              <StatBox
                icon={RiWeightLine}
                label="Total Exercises"
                value={data?.totalExercises ?? 0}
                color="var(--accent-dark)"
                sub="all time"
              />
              <StatBox
                icon={RiTrophyLine}
                label="Total Sets"
                value={totalSets}
                color="#8b5cf6"
                sub={`in ${range} days`}
              />
              <StatBox
                icon={RiScales3Line}
                label="Weight"
                value={
                  data?.currentWeight ? `${data.currentWeight}kg` : "—"
                }
                color="#ef4444"
              />
              <StatBox
                icon={RiTimeLine}
                label="Avg Calories"
                value={avgCalories || "—"}
                color="#14b8a6"
                sub="kcal/day"
              />
              <StatBox
                icon={RiMoonLine}
                label="Avg Sleep"
                value={
                  data?.avgSleep != null ? `${data.avgSleep}h` : "—"
                }
                color="#a18cd1"
                sub={`over ${range} days`}
              />
              <StatBox
                icon={RiDropLine}
                label="Avg Water"
                value={
                  data?.avgWaterMl != null
                    ? `${(data.avgWaterMl / 1000).toFixed(1)}L`
                    : "—"
                }
                color="#4facfe"
                sub="per logged day"
              />
              <StatBox
                icon={RiWalkLine}
                label="Avg Steps"
                value={
                  data?.avgSteps != null
                    ? data.avgSteps.toLocaleString()
                    : "—"
                }
                color="#f093fb"
                sub="per logged day"
              />
            </div>

            {/* ── Weekly Progress: muscle group multi-line chart ─────────── */}
            <div className="card analytics-chart-card">
              <div className="analytics-chart-head">
                <div>
                  <h2 className="analytics-chart-title">
                    <RiLineChartLine size={16} /> Weekly Progress
                  </h2>
                  <p className="analytics-chart-sub">
                    Sets per muscle group · stepped line chart
                  </p>
                </div>
                <div className="analytics-chart-badge">
                  {allMuscles.length} muscle groups
                </div>
              </div>

              {allMuscles.length > 0 && (
                <div className="analytics-legend">
                  {allMuscles.map((m, i) => (
                    <button
                      key={m}
                      className={`analytics-legend-item ${visibleLines[m] ? "analytics-legend-item--active" : ""}`}
                      onClick={() => toggleLine(m)}
                    >
                      <span
                        className="analytics-legend-dot"
                        style={{
                          background: visibleLines[m]
                            ? getMuscleColor(m, i)
                            : "var(--border-light)",
                        }}
                      />
                      {m}
                    </button>
                  ))}
                </div>
              )}

              {muscleChartData.length === 0 ? (
                <div className="analytics-empty">
                  <RiWeightLine size={28} />
                  <p>No workout data yet.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart
                    data={muscleChartData}
                    margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-light)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {allMuscles.map((m, i) =>
                      visibleLines[m] ? (
                        <Line
                          key={m}
                          type="stepAfter"
                          dataKey={m}
                          name={m}
                          stroke={getMuscleColor(m, i)}
                          strokeWidth={2}
                          dot={{
                            r: 3,
                            fill: getMuscleColor(m, i),
                            strokeWidth: 0,
                          }}
                          activeDot={{ r: 5 }}
                          animationDuration={800}
                          animationEasing="ease-out"
                          connectNulls
                        />
                      ) : null,
                    )}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* ── Workout Consistency bar chart ──────────────────────────── */}
            <div className="card analytics-chart-card">
              <div className="analytics-chart-head">
                <div>
                  <h2 className="analytics-chart-title">
                    <RiBarChart2Line size={16} /> Workout Consistency
                  </h2>
                  <p className="analytics-chart-sub">
                    Total sets logged per active day
                  </p>
                </div>
                <div className="analytics-chart-badge">
                  {workoutData.length} active days
                </div>
              </div>
              {workoutData.length === 0 ? (
                <div className="analytics-empty">
                  <RiWeightLine size={28} />
                  <p>No workout data yet.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={workoutData}
                    margin={{ top: 8, right: 4, left: -24, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-light)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="sets"
                      name="Sets"
                      fill="var(--text-primary)"
                      radius={[4, 4, 0, 0]}
                      animationDuration={800}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* ── Calorie & Macro intake chart ───────────────────────────── */}
            <div className="card analytics-chart-card">
              <div className="analytics-chart-head">
                <div>
                  <h2 className="analytics-chart-title">
                    <RiLineChartLine size={16} /> Calorie & Macro Intake
                  </h2>
                  <p className="analytics-chart-sub">
                    Daily nutrition breakdown
                  </p>
                </div>
                <div className="analytics-chart-badge">
                  {calorieData.length} days logged
                </div>
              </div>

              <div className="analytics-legend">
                {[
                  {
                    key: "calories",
                    label: "Calories",
                    color: "var(--text-primary)",
                  },
                  { key: "protein", label: "Protein", color: "#3b82f6" },
                  { key: "carbs", label: "Carbs", color: "#f59e0b" },
                  { key: "fats", label: "Fats", color: "#ef4444" },
                ].map((l) => (
                  <span
                    key={l.key}
                    className="analytics-legend-item analytics-legend-item--active analytics-legend-item--static"
                  >
                    <span
                      className="analytics-legend-dot"
                      style={{ background: l.color }}
                    />
                    {l.label}
                  </span>
                ))}
              </div>

              {calorieData.length === 0 ? (
                <div className="analytics-empty">
                  <RiLineChartLine size={28} />
                  <p>No diet data yet.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart
                    data={calorieData}
                    margin={{ top: 8, right: 4, left: -24, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="calGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--text-primary)"
                          stopOpacity={0.12}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--text-primary)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-light)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="calories"
                      name="Calories"
                      stroke="var(--text-primary)"
                      fill="url(#calGrad)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                      animationDuration={800}
                      animationEasing="ease-out"
                    />
                    <Line
                      type="monotone"
                      dataKey="protein"
                      name="Protein(g)"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                      animationDuration={800}
                      animationEasing="ease-out"
                    />
                    <Line
                      type="monotone"
                      dataKey="carbs"
                      name="Carbs(g)"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#f59e0b", strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                      animationDuration={800}
                      animationEasing="ease-out"
                    />
                    <Line
                      type="monotone"
                      dataKey="fats"
                      name="Fats(g)"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#ef4444", strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                      animationDuration={800}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* ── Health Trends: Sleep / Water / Steps ───────────────────── */}
            {hasHealthData && (
              <div className="card analytics-chart-card">
                <div className="analytics-chart-head">
                  <div>
                    <h2 className="analytics-chart-title">
                      <RiHeartPulseLine size={16} /> Health Trends
                    </h2>
                    <p className="analytics-chart-sub">
                      Sleep · Water · Steps over the period
                    </p>
                  </div>
                </div>

                <div className="analytics-health-grid">
                  {/* Sleep */}
                  <div className="analytics-health-panel">
                    <div
                      className="analytics-health-panel-title"
                      style={{ color: "#a18cd1" }}
                    >
                      <RiMoonLine size={13} /> Sleep (hours)
                    </div>
                    {sleepChartData.length === 0 ? (
                      <div
                        className="analytics-empty"
                        style={{ padding: "20px 0" }}
                      >
                        <p style={{ fontSize: "0.78rem" }}>No sleep data</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={140}>
                        <AreaChart
                          data={sleepChartData}
                          margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="sleepGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#a18cd1"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#a18cd1"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--border-light)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 9, fill: "var(--text-muted)" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            domain={[0, 12]}
                            tick={{ fontSize: 9, fill: "var(--text-muted)" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="hours"
                            name="Sleep (h)"
                            stroke="#a18cd1"
                            fill="url(#sleepGrad)"
                            strokeWidth={2}
                            dot={{ r: 2, fill: "#a18cd1", strokeWidth: 0 }}
                            activeDot={{ r: 4 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Water */}
                  <div className="analytics-health-panel">
                    <div
                      className="analytics-health-panel-title"
                      style={{ color: "#4facfe" }}
                    >
                      <RiDropLine size={13} /> Water (L)
                    </div>
                    {waterChartData.length === 0 ? (
                      <div
                        className="analytics-empty"
                        style={{ padding: "20px 0" }}
                      >
                        <p style={{ fontSize: "0.78rem" }}>No water data</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={140}>
                        <AreaChart
                          data={waterChartData}
                          margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="waterGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#4facfe"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#4facfe"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--border-light)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 9, fill: "var(--text-muted)" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 9, fill: "var(--text-muted)" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="L"
                            name="Water (L)"
                            stroke="#4facfe"
                            fill="url(#waterGrad)"
                            strokeWidth={2}
                            dot={{ r: 2, fill: "#4facfe", strokeWidth: 0 }}
                            activeDot={{ r: 4 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Steps */}
                  <div className="analytics-health-panel">
                    <div
                      className="analytics-health-panel-title"
                      style={{ color: "#f093fb" }}
                    >
                      <RiWalkLine size={13} /> Steps
                    </div>
                    {stepsChartData.length === 0 ? (
                      <div
                        className="analytics-empty"
                        style={{ padding: "20px 0" }}
                      >
                        <p style={{ fontSize: "0.78rem" }}>No steps data</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={140}>
                        <BarChart
                          data={stepsChartData}
                          margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--border-light)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 9, fill: "var(--text-muted)" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 9, fill: "var(--text-muted)" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar
                            dataKey="steps"
                            name="Steps"
                            fill="#f093fb"
                            radius={[3, 3, 0, 0]}
                            animationDuration={600}
                            animationEasing="ease-out"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            )}

            {data?.memberSince && (
              <div className="analytics-since">
                <RiCalendarCheckLine size={14} />
                Tracking since{" "}
                <strong>
                  {new Date(data.memberSince).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </div>
            )}
          </>
        )}
        <Footer />
      </main>
    </div>
  );
};

export default Analytics;
