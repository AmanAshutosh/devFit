import React, { useEffect, useState } from 'react';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import { Link } from 'react-router-dom';
import {
  RiWeightLine, RiCalendarCheckLine, RiLineChartLine,
  RiLeafLine, RiCapsuleLine, RiYoutubeLine, RiUserLine,
  RiFireLine, RiHeartPulseLine, RiScales3Line, RiArrowRightLine,
  RiTrophyLine, RiBodyScanLine
} from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import { formatDate, getBMICategory, calculateBMI } from '../../utils/helpers';
import './Dashboard.css';

const StatCard = ({ icon: Icon, label, value, sub, dark }) => (
  <div className={`dash-stat ${dark ? 'dash-stat--dark' : ''}`}>
    <div className="dash-stat-icon"><Icon size={20} /></div>
    <div className="dash-stat-value">{value}</div>
    <div className="dash-stat-label">{label}</div>
    {sub && <div className="dash-stat-sub">{sub}</div>}
  </div>
);

const QuickBtn = ({ to, icon: Icon, label }) => (
  <Link to={to} className="dash-quick-btn">
    <span className="dash-quick-icon"><Icon size={20} /></span>
    <span className="dash-quick-label">{label}</span>
    <RiArrowRightLine size={14} className="dash-quick-arrow" />
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [todayExercises, setTodayExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    Promise.all([
      api.get('/analytics/overview?days=30'),
      api.get(`/exercise?date=${today}&limit=5`),
    ])
      .then(([a, e]) => { setAnalytics(a.data); setTodayExercises(e.data.exercises || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const bmi = user ? calculateBMI(user.weight, user.heightFeet, user.heightInches) : null;
  const bmiInfo = bmi ? getBMICategory(bmi) : null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="page-title">{greeting},<br className="dash-break" /> {user?.name?.split(' ')[0]}</h1>
            <p className="page-subtitle">{formatDate(new Date())} · Let's make it count.</p>
          </div>
          {user?.streak > 0 && (
            <div className="dash-streak-pill">
              <RiFireLine size={16} />
              <span>{user.streak}d streak</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="dash-stats">
          <StatCard icon={RiWeightLine}  label="Total Exercises" value={analytics?.totalExercises ?? '—'} sub="all time" />
          <StatCard icon={RiCalendarCheckLine} label="Active Days" value={analytics?.workoutDays?.length ?? '—'} sub="this month" />
          <StatCard icon={RiScales3Line}   label="BMI" value={bmi ?? '—'} sub={bmiInfo?.label || 'add measurements'} />
          <StatCard icon={RiFireLine}      label="Streak" value={`${user?.streak ?? 0}d`} sub="keep it up!" dark />
        </div>

        {/* Body chips */}
        {(user?.weight || user?.heightFeet) && (
          <div className="dash-body-row">
            {user.weight && (
              <div className="dash-body-chip">
                <RiBodyScanLine size={14} />
                <span>{user.weight} kg</span>
              </div>
            )}
            {user.heightFeet && (
              <div className="dash-body-chip">
                <RiHeartPulseLine size={14} />
                <span>{user.heightFeet}'{user.heightInches || 0}"</span>
              </div>
            )}
            {bmi && (
              <div className="dash-body-chip" style={{ borderColor: bmiInfo.color, color: bmiInfo.color }}>
                <RiScales3Line size={14} />
                <span>BMI {bmi} · {bmiInfo.label}</span>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <section className="dash-section">
          <h2 className="dash-section-title">Quick Actions</h2>
          <div className="dash-quick-grid">
            <QuickBtn to="/exercises"    icon={RiWeightLine}      label="Log Workout" />
            <QuickBtn to="/diet"         icon={RiLeafLine}          label="Track Meal" />
            <QuickBtn to="/supplements"  icon={RiCapsuleLine}       label="Log Supplement" />
            <QuickBtn to="/analytics"    icon={RiLineChartLine}     label="Analytics" />
            <QuickBtn to="/gym-plan"     icon={RiCalendarCheckLine} label="My Plan" />
            <QuickBtn to="/profile"      icon={RiUserLine}          label="Profile" />
          </div>
        </section>

        {/* Today's Workouts */}
        <section className="dash-section">
          <div className="dash-section-head">
            <h2 className="dash-section-title">Today's Exercises</h2>
            <Link to="/exercises" className="dash-see-all">See all <RiArrowRightLine size={13} /></Link>
          </div>
          {loading ? (
            <div className="dash-loading">Loading workout data…</div>
          ) : todayExercises.length === 0 ? (
            <div className="dash-empty-card">
              <RiWeightLine size={28} className="dash-empty-icon" />
              <p>No exercises logged today.</p>
              <Link to="/exercises" className="btn btn-accent" style={{ marginTop: 12, fontSize: '0.85rem' }}>
                Log your first set
              </Link>
            </div>
          ) : (
            <div className="dash-ex-list">
              {todayExercises.map((ex) => (
                <div key={ex._id} className="dash-ex-item">
                  <div className="dash-ex-left">
                    <RiWeightLine size={16} className="dash-ex-icon" />
                    <div>
                      <div className="dash-ex-name">{ex.name}</div>
                      {ex.muscleGroup && <span className="badge badge-info">{ex.muscleGroup}</span>}
                    </div>
                  </div>
                  <div className="dash-ex-meta">
                    {ex.sets}×{ex.reps}{ex.weight ? ` @ ${ex.weight}kg` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;
