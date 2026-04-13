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

const QUOTES = [
  { text: "The only bad workout is the one that didn't happen.", author: null },
  { text: "Push yourself, because no one else is going to do it for you.", author: null },
  { text: "Your body can stand almost anything. It's your mind you have to convince.", author: null },
  { text: "Success starts with self-discipline.", author: null },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: null },
  { text: "Don't stop when you're tired. Stop when you're done.", author: null },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: null },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "It never gets easier, you just get stronger.", author: null },
  { text: "Train insane or remain the same.", author: null },
  { text: "Strive for progress, not perfection.", author: null },
  { text: "The hard days are the best days because that's when champions are made.", author: "Gabby Douglas" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "A one hour workout is 4% of your day. No excuses.", author: null },
  { text: "Sweat is just fat crying.", author: null },
  { text: "Every champion was once a contender who refused to give up.", author: "Rocky Balboa" },
  { text: "Be stronger than your strongest excuse.", author: null },
  { text: "Your only limit is you.", author: null },
  { text: "Fitness is not about being better than someone else. It's about being better than you used to be.", author: null },
  { text: "The body achieves what the mind believes.", author: null },
  { text: "Discipline is doing what needs to be done even when you don't want to.", author: null },
  { text: "No matter how slow you go, you're still lapping everyone on the couch.", author: null },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "Results happen over time, not overnight. Work hard, stay consistent.", author: null },
  { text: "What seems impossible today will become your warm-up tomorrow.", author: null },
  { text: "The difference between try and triumph is a little umph.", author: null },
  { text: "Hustle for that muscle.", author: null },
  { text: "Your health is an investment, not an expense.", author: null },
  { text: "Motivation gets you started. Habit keeps you going.", author: null },
  { text: "If you're tired of starting over, stop giving up.", author: null },
  { text: "Believe in yourself and all that you are.", author: "Christian D. Larson" },
  { text: "You are one workout away from a good mood.", author: null },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Your future self is watching you right now through memories.", author: "Aubrey de Grey" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "Don't wish for a good body, work for it.", author: null },
  { text: "It's not about perfect. It's about effort.", author: "Jillian Michaels" },
  { text: "The gym is not a place of punishment — it's a place of growth.", author: null },
  { text: "Run when you can, walk if you have to, crawl if you must; just never give up.", author: "Dean Karnazes" },
  { text: "Strong is the new beautiful.", author: null },
  { text: "Fall in love with taking care of your body.", author: null },
  { text: "One workout at a time. One rep at a time. One day at a time.", author: null },
  { text: "Sore today, strong tomorrow.", author: null },
  { text: "Work hard in silence, let success be your noise.", author: "Frank Ocean" },
  { text: "Be the best version of yourself.", author: null },
  { text: "You can feel sore tomorrow or you can feel sorry tomorrow. Choose wisely.", author: null },
  { text: "Strength doesn't come from what you can do. It comes from overcoming things you couldn't.", author: "Rikki Rogers" },
  { text: "Push harder than yesterday if you want a different tomorrow.", author: null },
  { text: "Once you see results, it becomes an addiction.", author: null },
  { text: "Good things come to those who sweat.", author: null },
  { text: "Excuses don't burn calories.", author: null },
  { text: "You've survived 100% of your worst days so far.", author: null },
  { text: "Every rep counts. Every set matters. Every session is progress.", author: null },
  { text: "The clock is ticking. Are you becoming the person you want to be?", author: "Greg Plitt" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { text: "Fitness is a journey, not a destination.", author: null },
  { text: "Abs are built in the kitchen, sculpted in the gym.", author: null },
  { text: "Your goals don't care how you feel.", author: null },
  { text: "Today I will do what others won't, so tomorrow I can do what others can't.", author: "Jerry Rice" },
];

const GRADIENTS = [
  { bg: 'linear-gradient(135deg,#667eea,#764ba2)', text: '#fff' },
  { bg: 'linear-gradient(135deg,#f093fb,#f5576c)', text: '#fff' },
  { bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', text: '#fff' },
  { bg: 'linear-gradient(135deg,#43e97b,#38f9d7)', text: '#1a3a2a' },
  { bg: 'linear-gradient(135deg,#fa709a,#fee140)', text: '#3a1a00' },
  { bg: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', text: '#2a1040' },
  { bg: 'linear-gradient(135deg,#ff9a9e,#fad0c4)', text: '#3a0a10' },
  { bg: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)', text: '#0a1a40' },
  { bg: 'linear-gradient(135deg,#d4fc79,#96e6a1)', text: '#1a3a1a' },
  { bg: 'linear-gradient(135deg,#f6d365,#fda085)', text: '#3a1a00' },
  { bg: 'linear-gradient(135deg,#89f7fe,#66a6ff)', text: '#0a1040' },
  { bg: 'linear-gradient(135deg,#fddb92,#d1fdff)', text: '#1a2a3a' },
];

const getDailyIndex = (arr) => {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  return dayOfYear % arr.length;
};

const QuoteCard = () => {
  const quote = QUOTES[getDailyIndex(QUOTES)];
  const grad  = GRADIENTS[getDailyIndex(GRADIENTS)];
  return (
    <div className="dash-quote-card" style={{ background: grad.bg, color: grad.text }}>
      <div className="dash-quote-mark" style={{ color: grad.text }}>"</div>
      <p className="dash-quote-text">{quote.text}</p>
      {quote.author && <p className="dash-quote-author" style={{ color: grad.text }}>— {quote.author}</p>}
    </div>
  );
};

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

        {/* Daily quote — mobile only */}
        <section className="dash-section dash-mobile-only">
          <QuoteCard />
        </section>

        {/* Quick Actions — desktop only */}
        <section className="dash-section dash-desktop-only">
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
