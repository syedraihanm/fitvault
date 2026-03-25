'use client';
import { useState, useEffect } from 'react';
import { progressAPI } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Progress() {
  const [logs, setLogs] = useState([]);
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Weight Log Modal
  const [showModal, setShowModal] = useState(false);
  const [weight, setWeight] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logsRes, prsRes] = await Promise.all([
        progressAPI.getLogs(),
        progressAPI.getPRs()
      ]);
      setLogs(logsRes.data.logs.filter(l => l.weight)); // Only logs with weight for chart
      setPrs(prsRes.data.records);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleLogWeight = async (e) => {
    e.preventDefault();
    try {
      await progressAPI.createLog({ date: new Date().toISOString(), weight: Number(weight) });
      setShowModal(false);
      setWeight('');
      fetchData();
    } catch (err) { console.error(err); alert('Failed to log weight'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  const chartData = logs.map(l => ({
    date: new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: l.weight
  }));

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Progress & Charts</h1>
          <p>Visualize your transformation over time.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Log Weight</button>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <div className="card-header">
          <h3 className="card-title">Body Weight (kg)</h3>
        </div>
        <div style={{ height: 400 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--accent-primary)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="weight" stroke="var(--accent-primary)" strokeWidth={4} dot={{ r: 6, fill: 'var(--bg-card)', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">No weight data available to chart</div>
          )}
        </div>
      </div>

      <div className="page-header">
        <h1>Personal Records</h1>
        <p>Your heaviest lifts automatically tracked from workouts.</p>
      </div>

      <div className="grid-3">
        {prs.length === 0 ? (
          <div className="empty-state card" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon">🏆</div>
            <h3>No Records Yet</h3>
            <p>Complete workouts to automatically track your PRs here.</p>
          </div>
        ) : (
          prs.map(pr => (
            <div key={pr._id} className="stat-card purple" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{pr.exerciseName}</div>
                <div className="badge badge-primary">{pr.exercise?.category}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                <div>
                  <div className="stat-label" style={{ color: 'var(--accent-primary)' }}>1RM Max Weight</div>
                  <div className="stat-value">{pr.maxWeight} <span style={{ fontSize: 14 }}>kg</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="stat-label">Best Set</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{pr.bestSet?.weight}kg × {pr.bestSet?.reps}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h2 className="modal-title">Log Body Weight</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleLogWeight}>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input type="number" step="0.1" className="form-input" value={weight} onChange={e => setWeight(e.target.value)} required autoFocus />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Record</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
