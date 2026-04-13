import React, { useState, useEffect, useCallback } from 'react';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import {
  RiLeafLine, RiAddLine, RiCloseLine, RiDeleteBinLine,
  RiCalendarLine, RiSearchLine, RiFireLine, RiRefreshLine,
  RiCheckLine, RiInformationLine, RiArrowDownSLine, RiArrowUpSLine,
  RiEditLine,
} from 'react-icons/ri';
import api from '../../utils/api';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import { todayISO } from '../../utils/helpers';
import './DietTracker.css';

const MEAL_TIMES = ['morning','breakfast','lunch','snack','dinner','night'];
const MEAL_ICONS = { morning:'🌅', breakfast:'🍳', lunch:'🥙', snack:'🍎', dinner:'🍽️', night:'🌙' };
const BLANK = { foodName:'', mealTime:'breakfast', quantity:100, unit:'g', calories:'', protein:'', carbs:'', fats:'' };

// Nutrition DB per 100g — macros + key micros (USDA FoodData Central values)
// micros: fiber(g), sodium(mg), potassium(mg), calcium(mg), iron(mg), vitC(mg)
const FOOD_DB = {
  'rice':          { calories:130, protein:2.7,  carbs:28,  fats:0.3,  fiber:0.4, sodium:1,   potassium:35,  calcium:10,  iron:0.2,  vitC:0   },
  'brown rice':    { calories:111, protein:2.6,  carbs:23,  fats:0.9,  fiber:1.8, sodium:5,   potassium:79,  calcium:10,  iron:0.5,  vitC:0   },
  'dal':           { calories:116, protein:9,    carbs:20,  fats:0.4,  fiber:7.9, sodium:2,   potassium:369, calcium:19,  iron:3.3,  vitC:1.5 },
  'chicken breast':{ calories:165, protein:31,   carbs:0,   fats:3.6,  fiber:0,   sodium:74,  potassium:256, calcium:15,  iron:1.0,  vitC:0   },
  'chicken':       { calories:165, protein:31,   carbs:0,   fats:3.6,  fiber:0,   sodium:74,  potassium:256, calcium:15,  iron:1.0,  vitC:0   },
  'egg':           { calories:155, protein:13,   carbs:1.1, fats:11,   fiber:0,   sodium:124, potassium:138, calcium:56,  iron:1.8,  vitC:0   },
  'egg white':     { calories:52,  protein:11,   carbs:0.7, fats:0.2,  fiber:0,   sodium:166, potassium:163, calcium:7,   iron:0.1,  vitC:0   },
  'chapati':       { calories:297, protein:9.9,  carbs:52,  fats:6.2,  fiber:4.2, sodium:246, potassium:190, calcium:24,  iron:3.9,  vitC:0   },
  'roti':          { calories:297, protein:9.9,  carbs:52,  fats:6.2,  fiber:4.2, sodium:246, potassium:190, calcium:24,  iron:3.9,  vitC:0   },
  'banana':        { calories:89,  protein:1.1,  carbs:23,  fats:0.3,  fiber:2.6, sodium:1,   potassium:358, calcium:5,   iron:0.3,  vitC:8.7 },
  'apple':         { calories:52,  protein:0.3,  carbs:14,  fats:0.2,  fiber:2.4, sodium:1,   potassium:107, calcium:6,   iron:0.1,  vitC:4.6 },
  'milk':          { calories:61,  protein:3.2,  carbs:4.8, fats:3.3,  fiber:0,   sodium:43,  potassium:150, calcium:113, iron:0.0,  vitC:0   },
  'paneer':        { calories:265, protein:18,   carbs:1.2, fats:20,   fiber:0,   sodium:21,  potassium:62,  calcium:480, iron:0.6,  vitC:0   },
  'oats':          { calories:389, protein:16.9, carbs:66,  fats:6.9,  fiber:10.6,sodium:2,   potassium:429, calcium:54,  iron:4.7,  vitC:0   },
  'whey protein':  { calories:400, protein:80,   carbs:7,   fats:6,    fiber:0,   sodium:200, potassium:500, calcium:600, iron:1.0,  vitC:0   },
  'sweet potato':  { calories:86,  protein:1.6,  carbs:20,  fats:0.1,  fiber:3.0, sodium:55,  potassium:337, calcium:30,  iron:0.6,  vitC:2.4 },
  'broccoli':      { calories:34,  protein:2.8,  carbs:7,   fats:0.4,  fiber:2.6, sodium:33,  potassium:316, calcium:47,  iron:0.7,  vitC:89.2},
  'almonds':       { calories:579, protein:21,   carbs:22,  fats:50,   fiber:12.5,sodium:1,   potassium:733, calcium:264, iron:3.7,  vitC:0   },
  'salmon':        { calories:208, protein:20,   carbs:0,   fats:13,   fiber:0,   sodium:59,  potassium:363, calcium:12,  iron:0.8,  vitC:0   },
  'bread':         { calories:265, protein:9,    carbs:49,  fats:3.2,  fiber:2.7, sodium:491, potassium:115, calcium:260, iron:3.6,  vitC:0   },
  'curd':          { calories:98,  protein:11,   carbs:3.4, fats:4.3,  fiber:0,   sodium:364, potassium:141, calcium:121, iron:0.1,  vitC:0   },
  'idli':          { calories:58,  protein:2,    carbs:12,  fats:0.4,  fiber:0.9, sodium:142, potassium:44,  calcium:12,  iron:0.5,  vitC:0   },
  'dosa':          { calories:133, protein:3.4,  carbs:25,  fats:2.7,  fiber:1.5, sodium:210, potassium:80,  calcium:15,  iron:0.8,  vitC:0   },
  'peanut butter': { calories:588, protein:25,   carbs:20,  fats:50,   fiber:6,   sodium:447, potassium:558, calcium:49,  iron:1.9,  vitC:0   },
  'tuna':          { calories:116, protein:26,   carbs:0,   fats:1,    fiber:0,   sodium:50,  potassium:252, calcium:10,  iron:1.3,  vitC:0   },
  'spinach':       { calories:23,  protein:2.9,  carbs:3.6, fats:0.4,  fiber:2.2, sodium:79,  potassium:558, calcium:99,  iron:2.7,  vitC:28.1},
  'orange':        { calories:47,  protein:0.9,  carbs:12,  fats:0.1,  fiber:2.4, sodium:0,   potassium:181, calcium:40,  iron:0.1,  vitC:53.2},
  'potato':        { calories:77,  protein:2,    carbs:17,  fats:0.1,  fiber:2.2, sodium:6,   potassium:421, calcium:12,  iron:0.8,  vitC:19.7},
  'pasta':         { calories:131, protein:5,    carbs:25,  fats:1.1,  fiber:1.8, sodium:6,   potassium:44,  calcium:7,   iron:0.5,  vitC:0   },
  'greek yogurt':  { calories:59,  protein:10,   carbs:3.6, fats:0.4,  fiber:0,   sodium:36,  potassium:141, calcium:110, iron:0.1,  vitC:0   },
  'peanuts':       { calories:567, protein:26,   carbs:16,  fats:49,   fiber:8.5, sodium:18,  potassium:705, calcium:92,  iron:4.6,  vitC:0   },
  'mango':         { calories:60,  protein:0.8,  carbs:15,  fats:0.4,  fiber:1.6, sodium:1,   potassium:168, calcium:11,  iron:0.2,  vitC:36.4},
  'watermelon':    { calories:30,  protein:0.6,  carbs:8,   fats:0.2,  fiber:0.4, sodium:1,   potassium:112, calcium:7,   iron:0.2,  vitC:8.1 },
  'cashews':       { calories:553, protein:18,   carbs:30,  fats:44,   fiber:3.3, sodium:12,  potassium:660, calcium:37,  iron:6.7,  vitC:0.5 },
  'cottage cheese':{ calories:98,  protein:11,   carbs:3.4, fats:4.3,  fiber:0,   sodium:364, potassium:141, calcium:83,  iron:0.2,  vitC:0   },
  'tofu':          { calories:76,  protein:8,    carbs:1.9, fats:4.8,  fiber:0.3, sodium:7,   potassium:121, calcium:350, iron:5.4,  vitC:0.1 },
  'lentils':       { calories:116, protein:9,    carbs:20,  fats:0.4,  fiber:7.9, sodium:2,   potassium:369, calcium:19,  iron:3.3,  vitC:1.5 },
  'avocado':       { calories:160, protein:2,    carbs:9,   fats:15,   fiber:6.7, sodium:7,   potassium:485, calcium:12,  iron:0.6,  vitC:10  },
  'olive oil':     { calories:884, protein:0,    carbs:0,   fats:100,  fiber:0,   sodium:2,   potassium:1,   calcium:1,   iron:0.6,  vitC:0   },
  'butter':        { calories:717, protein:0.9,  carbs:0.1, fats:81,   fiber:0,   sodium:714, potassium:24,  calcium:24,  iron:0.0,  vitC:0   },
  'cheese':        { calories:402, protein:25,   carbs:1.3, fats:33,   fiber:0,   sodium:653, potassium:98,  calcium:721, iron:0.7,  vitC:0   },
  'corn':          { calories:86,  protein:3.3,  carbs:19,  fats:1.4,  fiber:2.7, sodium:15,  potassium:270, calcium:2,   iron:0.5,  vitC:6.8 },
  'beans':         { calories:127, protein:8.7,  carbs:23,  fats:0.5,  fiber:6.4, sodium:2,   potassium:403, calcium:28,  iron:2.9,  vitC:0   },
  'beef':          { calories:250, protein:26,   carbs:0,   fats:15,   fiber:0,   sodium:66,  potassium:318, calcium:18,  iron:2.6,  vitC:0   },
  'mutton':        { calories:258, protein:25,   carbs:0,   fats:17,   fiber:0,   sodium:72,  potassium:310, calcium:17,  iron:2.3,  vitC:0   },
  'fish':          { calories:136, protein:28,   carbs:0,   fats:2.4,  fiber:0,   sodium:86,  potassium:502, calcium:25,  iron:0.7,  vitC:0   },
  'shrimp':        { calories:99,  protein:24,   carbs:0.2, fats:0.3,  fiber:0,   sodium:111, potassium:259, calcium:70,  iron:2.4,  vitC:0   },
  'coconut':       { calories:354, protein:3.3,  carbs:15,  fats:33,   fiber:9,   sodium:20,  potassium:356, calcium:14,  iron:2.4,  vitC:3.3 },
  'honey':         { calories:304, protein:0.3,  carbs:82,  fats:0,    fiber:0.2, sodium:4,   potassium:52,  calcium:6,   iron:0.4,  vitC:0.5 },
};

const lookupNutrition = (foodName, quantity=100) => {
  const key = foodName.toLowerCase().trim();
  const entry = Object.entries(FOOD_DB).find(([k]) => key === k || key.includes(k) || k.includes(key));
  if (!entry) return null;
  const [,per100] = entry;
  const f = Number(quantity)/100;
  return {
    calories:  Math.round(per100.calories  * f),
    protein:   parseFloat((per100.protein  * f).toFixed(1)),
    carbs:     parseFloat((per100.carbs    * f).toFixed(1)),
    fats:      parseFloat((per100.fats     * f).toFixed(1)),
  };
};

// Estimate micros for a list of logged entries by matching food names
const estimateMicros = (entries = []) => {
  const sum = { fiber:0, sodium:0, potassium:0, calcium:0, iron:0, vitC:0 };
  entries.forEach(e => {
    const key = (e.foodName||'').toLowerCase().trim();
    const match = Object.entries(FOOD_DB).find(([k]) => key === k || key.includes(k) || k.includes(key));
    if (!match) return;
    const per100 = match[1];
    const f = (e.quantity||100) / 100;
    sum.fiber     += (per100.fiber     ||0) * f;
    sum.sodium    += (per100.sodium    ||0) * f;
    sum.potassium += (per100.potassium ||0) * f;
    sum.calcium   += (per100.calcium   ||0) * f;
    sum.iron      += (per100.iron      ||0) * f;
    sum.vitC      += (per100.vitC      ||0) * f;
  });
  return {
    fiber:     parseFloat(sum.fiber.toFixed(1)),
    sodium:    Math.round(sum.sodium),
    potassium: Math.round(sum.potassium),
    calcium:   Math.round(sum.calcium),
    iron:      parseFloat(sum.iron.toFixed(1)),
    vitC:      parseFloat(sum.vitC.toFixed(1)),
  };
};

const MacroRing = ({ label, value, max, color }) => {
  const pct = Math.min(100,(value/max)*100);
  const r=28, circ=2*Math.PI*r;
  return (
    <div className="diet-ring-wrap">
      <svg width="70" height="70" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r={r} fill="none" stroke="var(--border-light)" strokeWidth="5"/>
        <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
          strokeLinecap="round" transform="rotate(-90 35 35)"
          style={{transition:'stroke-dashoffset 0.6s ease'}}/>
        <text x="35" y="39" textAnchor="middle" fontSize="11" fontWeight="700"
          fill="var(--text-primary)" fontFamily="'JetBrains Mono',monospace">{value}</text>
      </svg>
      <div className="diet-ring-label">{label}</div>
    </div>
  );
};

const DietTracker = () => {
  const [diet,setDiet] = useState(null);
  const [form,setForm] = useState(BLANK);
  const [filterDate,setFilterDate] = useState(todayISO());
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [showForm,setShowForm] = useState(false);
  const [error,setError] = useState('');
  const [success,setSuccess] = useState('');
  const [autoFilled,setAutoFilled] = useState(false);
  const [suggestions,setSuggestions] = useState([]);

  const fetchDiet = useCallback(async () => {
    setLoading(true);
    try { const {data}=await api.get(`/diet?date=${filterDate}`); setDiet(data.diet); }
    catch { setError('Failed to load diet log.'); }
    finally { setLoading(false); }
  },[filterDate]);

  useEffect(()=>{ fetchDiet(); },[fetchDiet]);

  const update = (field) => (e) => {
    const val = e.target.value;
    setForm(p => {
      const next = {...p,[field]:val};
      if(field==='foodName'||field==='quantity'){
        setAutoFilled(false);
        if(field==='foodName'){
          const q=val.toLowerCase();
          setSuggestions(q.length>1?Object.keys(FOOD_DB).filter(k=>k.includes(q)||q.includes(k)).slice(0,6):[]);
        }
        const name = field==='foodName'?val:next.foodName;
        const qty  = field==='quantity'?Number(val):Number(next.quantity);
        if(name&&qty){ const lk=lookupNutrition(name,qty); if(lk){setAutoFilled(true);return{...next,...lk};} }
      }
      return next;
    });
  };

  const applySuggestion = (name) => {
    const qty=Number(form.quantity)||100;
    const lk=lookupNutrition(name,qty);
    setForm(p=>({...p,foodName:name,...(lk||{})}));
    setAutoFilled(!!lk); setSuggestions([]);
  };

  const handleAdd = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const {data}=await api.post('/diet/entry',{...form,date:filterDate,quantity:Number(form.quantity)||0,calories:Number(form.calories)||0,protein:Number(form.protein)||0,carbs:Number(form.carbs)||0,fats:Number(form.fats)||0});
      setDiet(data.diet); setForm(BLANK); setShowForm(false); setAutoFilled(false); setSuggestions([]);
      setSuccess('Food entry added!');
    } catch(err){ setError(err.response?.data?.message||'Failed to add entry.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (entryId) => {
    try { const {data}=await api.delete(`/diet/entry/${entryId}?date=${filterDate}`); setDiet(data.diet); }
    catch { setError('Failed to remove entry.'); }
  };

  const [showMicros, setShowMicros] = useState(false);
  const totals = diet||{totalCalories:0,totalProtein:0,totalCarbs:0,totalFats:0};
  const calorieGoal=2200;
  const micros = estimateMicros(diet?.entries||[]);
  const grouped=MEAL_TIMES.reduce((acc,mt)=>{
    const entries=diet?.entries?.filter(e=>e.mealTime===mt)||[];
    if(entries.length>0) acc[mt]=entries; return acc;
  },{});

  return (
    <div className="page-layout">
      <Sidebar/>
      <MobileHeader/>
      <main className="page-content">
        <div className="page-header">
          <div><h1 className="page-title">Diet Tracker</h1><p className="page-subtitle">Log meals · auto-analyse macros.</p></div>
        </div>

        {error&&<div className="error-message" style={{marginBottom:14}}>{error}</div>}
        {success&&<div className="success-message" style={{marginBottom:14}}>{success}</div>}

        <div className="diet-toolbar">
          <div className="form-group">
            <label className="form-label"><RiCalendarLine size={11}/> Date</label>
            <input className="form-input" type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)}/>
          </div>
          <button className="btn btn-accent" onClick={()=>{setShowForm(!showForm);setForm(BLANK);setAutoFilled(false);setSuggestions([]);}}>
            {showForm?<><RiCloseLine size={15}/> Cancel</>:<><RiAddLine size={15}/> Add Food</>}
          </button>
        </div>

        {/* Macro Summary Card */}
        <div className="card diet-summary">
          <div className="diet-cal-block">
            <div className="diet-cal-num">{totals.totalCalories}</div>
            <div className="diet-cal-label">kcal today</div>
            <div className="diet-cal-bar-wrap"><div className="diet-cal-bar" style={{width:`${Math.min(100,(totals.totalCalories/calorieGoal)*100)}%`}}/></div>
            <div className="diet-cal-goal">{calorieGoal} kcal goal</div>
          </div>
          <div className="diet-rings">
            <MacroRing label="Protein" value={totals.totalProtein} max={150} color="#3b82f6"/>
            <MacroRing label="Carbs"   value={totals.totalCarbs}   max={300} color="#f59e0b"/>
            <MacroRing label="Fats"    value={totals.totalFats}    max={80}  color="#ef4444"/>
          </div>
        </div>

        {/* Add Food Form */}
        {showForm&&(
          <div className="card diet-form-card">
            <h3 className="diet-form-title"><RiLeafLine size={16}/> Add Food Entry</h3>
            <div className="diet-auto-note"><RiInformationLine size={13}/> Type any food name — macros auto-fill from our 50+ food database.</div>
            <form onSubmit={handleAdd}>
              <div className="diet-top-fields">
                <div className="form-group" style={{flex:2,position:'relative'}}>
                  <label className="form-label">Food Name *</label>
                  <div className="diet-food-wrap">
                    <RiSearchLine size={14} className="diet-food-icon"/>
                    <input className="diet-food-input" value={form.foodName} onChange={update('foodName')} placeholder="e.g. Chicken Breast, Rice, Egg…" required autoComplete="off"/>
                    {autoFilled&&<span className="diet-auto-badge"><RiCheckLine size={10}/> Auto</span>}
                  </div>
                  {suggestions.length>0&&(
                    <div className="diet-suggestions">
                      {suggestions.map(s=>(
                        <button key={s} type="button" className="diet-suggestion-item" onClick={()=>applySuggestion(s)}>
                          {s.charAt(0).toUpperCase()+s.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Meal Time</label>
                  <select className="form-select" value={form.mealTime} onChange={update('mealTime')}>
                    {MEAL_TIMES.map(m=><option key={m} value={m}>{MEAL_ICONS[m]} {m.charAt(0).toUpperCase()+m.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input className="form-input" type="number" value={form.quantity} onChange={update('quantity')} placeholder="100" min="0"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <select className="form-select" value={form.unit} onChange={update('unit')}>
                    {['g','ml','pcs','cup','tbsp'].map(u=><option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="diet-macros-grid">
                {[['Calories','calories','kcal'],['Protein','protein','g'],['Carbs','carbs','g'],['Fats','fats','g']].map(([l,f,u])=>(
                  <div key={f} className={`diet-macro-field ${autoFilled?'diet-macro-field--auto':''}`}>
                    <label className="form-label">{l}</label>
                    <div className="diet-macro-wrap">
                      <input className="form-input" type="number" value={form[f]} onChange={update(f)} placeholder="0" min="0" step="0.1"/>
                      <span className="diet-macro-unit">{u}</span>
                    </div>
                  </div>
                ))}
              </div>

              {autoFilled&&(
                <div className="diet-autofill-info"><RiCheckLine size={12}/> Macros auto-filled. Edit any value if needed.</div>
              )}
              <div className="diet-form-actions">
                <button type="button" className="btn btn-ghost" onClick={()=>{setShowForm(false);setSuggestions([]);}}><RiCloseLine size={14}/> Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving?<><RiRefreshLine size={14} className="spin"/> Adding…</>:<><RiCheckLine size={14}/> Add Food</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Meal Log */}
        <div className="diet-meals">
          {loading?<div className="dash-loading">Loading diet log…</div>
          :Object.keys(grouped).length===0?(
            <div className="empty-state"><RiLeafLine size={28} className="empty-state-icon"/><div className="empty-state-text">No meals logged. Add food above.</div></div>
          ):Object.entries(grouped).map(([mealTime,entries])=>{
            const mealCals=entries.reduce((s,e)=>s+(e.calories||0),0);
            return(
              <div key={mealTime} className="diet-meal-group">
                <div className="diet-meal-header">
                  <span className="diet-meal-emoji">{MEAL_ICONS[mealTime]}</span>
                  <span className="diet-meal-name">{mealTime.charAt(0).toUpperCase()+mealTime.slice(1)}</span>
                  <span className="diet-meal-cals"><RiFireLine size={12}/>{mealCals} kcal</span>
                </div>
                {entries.map(entry=>(
                  <div key={entry._id} className="diet-entry">
                    <div className="diet-entry-left">
                      <div className="diet-entry-name">{entry.foodName}</div>
                      <div className="diet-entry-qty">{entry.quantity}{entry.unit}</div>
                    </div>
                    <div className="diet-entry-macros">
                      <span className="diet-mpill diet-mpill-cal"><RiFireLine size={10}/>{entry.calories}</span>
                      <span className="diet-mpill diet-mpill-p">P {entry.protein}g</span>
                      <span className="diet-mpill diet-mpill-c">C {entry.carbs}g</span>
                      <span className="diet-mpill diet-mpill-f">F {entry.fats}g</span>
                    </div>
                    <button className="btn btn-danger diet-del-btn" onClick={()=>handleDelete(entry._id)}><RiDeleteBinLine size={13}/></button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        {/* Estimated Micronutrients */}
        <div className="diet-micros-card card">
          <button className="diet-micros-toggle" onClick={()=>setShowMicros(v=>!v)}>
            <span className="diet-micros-toggle-left">
              <RiLeafLine size={14}/> Estimated Micronutrients
              <span className="diet-micros-note">approx. based on logged foods</span>
            </span>
            {showMicros ? <RiArrowUpSLine size={18}/> : <RiArrowDownSLine size={18}/>}
          </button>
          {showMicros && (
            <>
              <div className="diet-micros-grid">
                {[
                  { label:'Fiber',     val:micros.fiber,     unit:'g',  dv:30,   color:'#22c55e' },
                  { label:'Sodium',    val:micros.sodium,    unit:'mg', dv:2300, color:'#f59e0b' },
                  { label:'Potassium', val:micros.potassium, unit:'mg', dv:4700, color:'#a78bfa' },
                  { label:'Calcium',   val:micros.calcium,   unit:'mg', dv:1000, color:'#60a5fa' },
                  { label:'Iron',      val:micros.iron,      unit:'mg', dv:18,   color:'#f87171' },
                  { label:'Vitamin C', val:micros.vitC,      unit:'mg', dv:90,   color:'#fb923c' },
                ].map(m=>(
                  <div key={m.label} className="diet-micro-item">
                    <div className="diet-micro-header">
                      <span className="diet-micro-label">{m.label}</span>
                      <span className="diet-micro-val" style={{color:m.color}}>
                        {m.val}<span className="diet-micro-unit">{m.unit}</span>
                      </span>
                    </div>
                    <div className="diet-micro-bar-wrap">
                      <div className="diet-micro-bar" style={{
                        width:`${Math.min(100,(m.val/m.dv)*100)}%`,
                        background: m.color,
                      }}/>
                    </div>
                    <div className="diet-micro-dv">{Math.round((m.val/m.dv)*100)}% of {m.dv}{m.unit} daily value</div>
                  </div>
                ))}
              </div>
              <div className="diet-micros-disclaimer">
                <RiInformationLine size={13}/>
                These are <strong>approximate general values</strong> based on typical food composition (USDA data).
                Actual micronutrient content varies by brand, preparation method, and freshness.
                <span className="diet-micros-edit"><RiEditLine size={11}/> Adjust manually if your foods differ.</span>
              </div>
            </>
          )}
        </div>

        <Footer/>
      </main>
    </div>
  );
};

export default DietTracker;
