import React, { useState, useEffect } from 'react';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import {
  RiLineChartLine, RiBarChart2Line, RiFireLine,
  RiCalendarCheckLine, RiWeightLine, RiScales3Line,
  RiTrophyLine, RiTimeLine
} from 'react-icons/ri';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from 'recharts';
import api from '../../utils/api';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import './Analytics.css';

const RANGES = [
  { label:'7D', value:7 },
  { label:'30D', value:30 },
  { label:'90D', value:90 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map(p=>(
        <div key={p.dataKey} className="chart-tooltip-row" style={{color:p.color}}>
          <span>{p.name}</span><strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const StatBox = ({ icon: Icon, label, value, color, sub }) => (
  <div className="analytics-stat-box">
    <div className="analytics-stat-icon" style={{color}}><Icon size={22}/></div>
    <div className="analytics-stat-val">{value}</div>
    <div className="analytics-stat-label">{label}</div>
    {sub&&<div className="analytics-stat-sub">{sub}</div>}
  </div>
);

const Analytics = () => {
  const [data,setData] = useState(null);
  const [range,setRange] = useState(30);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    setLoading(true);
    api.get(`/analytics/overview?days=${range}`)
      .then(({data})=>setData(data))
      .catch(console.error)
      .finally(()=>setLoading(false));
  },[range]);

  const workoutData = data?.workoutDays?.map(d=>({
    date: d._id.slice(5),
    sets: d.totalSets,
    exercises: d.exercises?.length||0,
  }))||[];

  const calorieData = data?.calorieHistory?.map(d=>({
    date: new Date(d.date).toLocaleDateString('en-IN',{month:'short',day:'numeric'}),
    calories: d.totalCalories,
    protein: d.totalProtein,
    carbs: d.totalCarbs,
    fats: d.totalFats,
  }))||[];

  const totalSets = workoutData.reduce((s,d)=>s+d.sets,0);
  const avgCalories = calorieData.length>0 ? Math.round(calorieData.reduce((s,d)=>s+d.calories,0)/calorieData.length) : 0;

  return (
    <div className="page-layout">
      <Sidebar/>
      <MobileHeader/>
      <main className="page-content">
        <div className="page-header">
          <div><h1 className="page-title">Analytics</h1><p className="page-subtitle">Your fitness journey from day one to today.</p></div>
          <div className="analytics-range">
            {RANGES.map(r=>(
              <button key={r.value} className={`analytics-range-btn ${range===r.value?'analytics-range-btn--active':''}`} onClick={()=>setRange(r.value)}>{r.label}</button>
            ))}
          </div>
        </div>

        {loading?(
          <div className="dash-loading">Loading analytics…</div>
        ):(
          <>
            {/* Stat boxes */}
            <div className="analytics-stats">
              <StatBox icon={RiFireLine}          label="Day Streak"       value={`${data?.streak??0}d`}          color="#f59e0b" sub="keep going!"/>
              <StatBox icon={RiCalendarCheckLine} label="Active Days"      value={data?.workoutDays?.length??0}   color="#3b82f6" sub={`in ${range} days`}/>
              <StatBox icon={RiWeightLine}      label="Total Exercises"  value={data?.totalExercises??0}        color="var(--accent-dark)" sub="all time"/>
              <StatBox icon={RiTrophyLine}        label="Total Sets"       value={totalSets}                      color="#8b5cf6" sub={`in ${range} days`}/>
              <StatBox icon={RiScales3Line}       label="Weight"           value={data?.currentWeight?`${data.currentWeight}kg`:'—'} color="#ef4444"/>
              <StatBox icon={RiTimeLine}          label="Avg Calories"     value={avgCalories?`${avgCalories}`:'—'} color="#14b8a6" sub="kcal/day"/>
            </div>

            {/* Workout Consistency */}
            <div className="card analytics-chart-card">
              <div className="analytics-chart-head">
                <div>
                  <h2 className="analytics-chart-title"><RiBarChart2Line size={16}/> Workout Consistency</h2>
                  <p className="analytics-chart-sub">Total sets logged per active day</p>
                </div>
                <div className="analytics-chart-badge">{workoutData.length} active days</div>
              </div>
              {workoutData.length===0?(
                <div className="analytics-empty"><RiWeightLine size={28}/><p>No workout data yet.</p></div>
              ):(
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={workoutData} margin={{top:8,right:4,left:-24,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false}/>
                    <XAxis dataKey="date" tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="sets" name="Sets" fill="var(--text-primary)" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Calorie History */}
            <div className="card analytics-chart-card">
              <div className="analytics-chart-head">
                <div>
                  <h2 className="analytics-chart-title"><RiLineChartLine size={16}/> Calorie & Macro Intake</h2>
                  <p className="analytics-chart-sub">Daily nutrition breakdown</p>
                </div>
                <div className="analytics-chart-badge">{calorieData.length} days logged</div>
              </div>
              {calorieData.length===0?(
                <div className="analytics-empty"><RiLineChartLine size={28}/><p>No diet data yet.</p></div>
              ):(
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={calorieData} margin={{top:8,right:4,left:-24,bottom:0}}>
                    <defs>
                      <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--text-primary)" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="var(--text-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false}/>
                    <XAxis dataKey="date" tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend wrapperStyle={{fontSize:'11px',paddingTop:10}}/>
                    <Area type="monotone" dataKey="calories" name="Calories" stroke="var(--text-primary)" fill="url(#calGrad)" strokeWidth={2} dot={false}/>
                    <Line type="monotone" dataKey="protein" name="Protein(g)" stroke="#3b82f6" strokeWidth={1.5} dot={false}/>
                    <Line type="monotone" dataKey="carbs" name="Carbs(g)" stroke="#f59e0b" strokeWidth={1.5} dot={false}/>
                    <Line type="monotone" dataKey="fats" name="Fats(g)" stroke="#ef4444" strokeWidth={1.5} dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {data?.memberSince&&(
              <div className="analytics-since">
                <RiCalendarCheckLine size={14}/>
                Tracking since <strong>{new Date(data.memberSince).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</strong>
              </div>
            )}
          </>
        )}
        <Footer/>
      </main>
    </div>
  );
};

export default Analytics;
