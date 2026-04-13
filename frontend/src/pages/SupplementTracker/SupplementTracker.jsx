import React, { useState, useEffect, useCallback } from 'react';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import {
  RiCapsuleLine, RiAddLine, RiCloseLine, RiDeleteBinLine,
  RiCalendarLine, RiTimeLine, RiCheckLine, RiRefreshLine
} from 'react-icons/ri';
import api from '../../utils/api';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import { todayISO, formatDate } from '../../utils/helpers';
import './SupplementTracker.css';

const BLANK = { name:'', quantity:'', time:'', notes:'' };
const COMMON = [
  'Whey Protein','Creatine','BCAA','Pre-Workout','Multivitamin',
  'Fish Oil','Vitamin D','Magnesium','Caffeine','Casein Protein',
  'Glutamine','Zinc','Vitamin C','Omega-3','Collagen'
];

const TIMES_OF_DAY = [
  { label:'Morning', value:'07:00' },
  { label:'Pre-Workout', value:'17:00' },
  { label:'Post-Workout', value:'19:00' },
  { label:'Night', value:'22:00' },
];

const SupplementTracker = () => {
  const [supplements,setSupplements] = useState([]);
  const [form,setForm] = useState(BLANK);
  const [filterDate,setFilterDate] = useState(todayISO());
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [showForm,setShowForm] = useState(false);
  const [error,setError] = useState('');
  const [success,setSuccess] = useState('');

  const fetchSupplements = useCallback(async () => {
    setLoading(true);
    try { const {data}=await api.get(`/supplements?date=${filterDate}`); setSupplements(data.supplements||[]); }
    catch { setError('Failed to load supplements.'); }
    finally { setLoading(false); }
  },[filterDate]);

  useEffect(()=>{ fetchSupplements(); },[fetchSupplements]);

  const update = f => e => setForm(p=>({...p,[f]:e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.post('/supplements',{...form,date:filterDate});
      setSuccess('Supplement logged!'); setForm(BLANK); setShowForm(false); fetchSupplements();
    } catch(err){ setError(err.response?.data?.message||'Failed to log supplement.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/supplements/${id}`); setSuccess('Removed.'); fetchSupplements(); }
    catch { setError('Failed to delete.'); }
  };

  const sortedSupps = [...supplements].sort((a,b)=>a.time.localeCompare(b.time));

  return (
    <div className="page-layout">
      <Sidebar/>
      <MobileHeader/>
      <main className="page-content">
        <div className="page-header">
          <div><h1 className="page-title">Supplements</h1><p className="page-subtitle">Log your daily supplement stack and timing.</p></div>
        </div>

        {error&&<div className="error-message" style={{marginBottom:14}}>{error}</div>}
        {success&&<div className="success-message" style={{marginBottom:14}}>{success}</div>}

        <div className="supp-toolbar">
          <div className="form-group">
            <label className="form-label"><RiCalendarLine size={11}/> Date</label>
            <input className="form-input" type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)}/>
          </div>
          <button className="btn btn-accent" onClick={()=>{setShowForm(!showForm);setForm(BLANK);}}>
            {showForm?<><RiCloseLine size={15}/> Cancel</>:<><RiAddLine size={15}/> Log Supplement</>}
          </button>
        </div>

        {showForm&&(
          <div className="card supp-form-card">
            <h3 className="supp-form-title"><RiCapsuleLine size={16}/> Log Supplement</h3>

            <div className="supp-quick-label">Quick Select</div>
            <div className="supp-quick-chips">
              {COMMON.map(s=>(
                <button key={s} type="button"
                  className={`supp-chip ${form.name===s?'supp-chip--active':''}`}
                  onClick={()=>setForm(p=>({...p,name:s}))}>
                  <RiCapsuleLine size={11}/>{s}
                </button>
              ))}
            </div>

            <div className="supp-time-presets">
              {TIMES_OF_DAY.map(t=>(
                <button key={t.value} type="button"
                  className={`supp-time-btn ${form.time===t.value?'supp-time-btn--active':''}`}
                  onClick={()=>setForm(p=>({...p,time:t.value}))}>
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="supp-form">
              <div className="supp-form-grid">
                <div className="form-group supp-form-name">
                  <label className="form-label">Supplement Name *</label>
                  <input className="form-input" value={form.name} onChange={update('name')} placeholder="e.g. Whey Protein" required/>
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity *</label>
                  <input className="form-input" value={form.quantity} onChange={update('quantity')} placeholder="1 scoop / 2 tabs" required/>
                </div>
                <div className="form-group">
                  <label className="form-label"><RiTimeLine size={11}/> Time *</label>
                  <input className="form-input" type="time" value={form.time} onChange={update('time')} required/>
                </div>
                <div className="form-group supp-form-notes">
                  <label className="form-label">Notes</label>
                  <input className="form-input" value={form.notes} onChange={update('notes')} placeholder="Optional…"/>
                </div>
              </div>
              <div className="supp-form-actions">
                <button type="button" className="btn btn-ghost" onClick={()=>setShowForm(false)}><RiCloseLine size={14}/> Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving?<><RiRefreshLine size={14} className="spin"/> Logging…</>:<><RiCheckLine size={14}/> Log Supplement</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {supplements.length>0&&(
          <div className="supp-count-row">
            <div className="supp-count-num">{supplements.length}</div>
            <div className="supp-count-label">supplement{supplements.length!==1?'s':''} on {formatDate(filterDate)}</div>
          </div>
        )}

        <div className="supp-list">
          {loading?<div className="dash-loading">Loading…</div>
          :sortedSupps.length===0?(
            <div className="empty-state"><RiCapsuleLine size={28} className="empty-state-icon"/><div className="empty-state-text">No supplements logged for {formatDate(filterDate)}.</div></div>
          ):sortedSupps.map(s=>(
            <div key={s._id} className="supp-item">
              <div className="supp-item-time">
                <RiTimeLine size={13}/>{s.time}
              </div>
              <div className="supp-item-icon"><RiCapsuleLine size={20}/></div>
              <div className="supp-item-info">
                <div className="supp-item-name">{s.name}</div>
                <div className="supp-item-qty">{s.quantity}</div>
                {s.notes&&<div className="supp-item-notes">{s.notes}</div>}
              </div>
              <button className="btn btn-danger supp-del-btn" onClick={()=>handleDelete(s._id)}><RiDeleteBinLine size={13}/></button>
            </div>
          ))}
        </div>
        <Footer/>
      </main>
    </div>
  );
};

export default SupplementTracker;
