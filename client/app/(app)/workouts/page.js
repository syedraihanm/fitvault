'use client';
import { useState, useEffect } from 'react';
import { workoutAPI, exerciseAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Workouts() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [exercises, setExercises] = useState([]);
  
  // New Workout State
  const [newWorkout, setNewWorkout] = useState({ name: '', startTime: new Date().toISOString() });
  const [activeExercises, setActiveExercises] = useState([]);

  useEffect(() => {
    fetchSessions();
    fetchExercises();
  }, []);

  // Keyboard Shortcuts for Power Users
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key.toLowerCase() === 'n' && !showModal) {
        e.preventDefault();
        setShowModal(true);
      }
      if (e.key === 'Escape' && showModal) {
        e.preventDefault();
        setShowModal(false);
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && showModal && activeExercises.length > 0) {
        e.preventDefault();
        handleSaveWorkout();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, activeExercises, newWorkout]);

  const fetchSessions = async () => {
    try {
      const res = await workoutAPI.getSessions();
      setSessions(res.data.sessions);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchExercises = async () => {
    try {
      const res = await exerciseAPI.getAll({ limit: 100 });
      setExercises(res.data.exercises);
    } catch (err) { console.error(err); }
  };

  const addExerciseToWorkout = (exercise) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
    
    let lastSets = [{ setNumber: 1, reps: 10, weight: 0, isWarmup: false }];
    // Smart Defaults: Find last time this exercise was performed
    for (const session of sessions) {
      const pastEx = session.exercises.find(e => e.exercise === exercise._id);
      if (pastEx && pastEx.sets.length > 0) {
        lastSets = pastEx.sets.map(s => ({ setNumber: s.setNumber, reps: s.reps, weight: s.weight, isWarmup: s.isWarmup }));
        break;
      }
    }

    setActiveExercises([...activeExercises, {
      exercise: exercise._id,
      exerciseName: exercise.name,
      sets: lastSets,
      caloriesBurned: exercise.caloriesPerMinute * 10
    }]);
  };

  const addSet = (exerciseIndex) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
    const updated = [...activeExercises];
    const prevSet = updated[exerciseIndex].sets[updated[exerciseIndex].sets.length - 1];
    updated[exerciseIndex].sets.push({
      setNumber: updated[exerciseIndex].sets.length + 1,
      reps: prevSet ? prevSet.reps : 10,
      weight: prevSet ? prevSet.weight : 0,
      isWarmup: false
    });
    setActiveExercises(updated);
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updated = [...activeExercises];
    updated[exerciseIndex].sets[setIndex][field] = Number(value);
    setActiveExercises(updated);
  };

  const removeSet = (exerciseIndex, setIndex) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10, 30, 10]);
    const updated = [...activeExercises];
    updated[exerciseIndex].sets.splice(setIndex, 1);
    // Renumber
    updated[exerciseIndex].sets.forEach((set, i) => set.setNumber = i + 1);
    setActiveExercises(updated);
  };

  const removeExercise = (index) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10, 30, 10]);
    setActiveExercises(activeExercises.filter((_, i) => i !== index));
  };

  const handleSaveWorkout = async () => {
    try {
      const payload = {
        name: newWorkout.name || 'Evening Workout',
        startTime: newWorkout.startTime,
        endTime: new Date().toISOString(),
        exercises: activeExercises,
        isCompleted: true
      };
      await workoutAPI.create(payload);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([50, 100, 50]);
      setShowModal(false);
      setActiveExercises([]);
      setNewWorkout({ name: '', startTime: new Date().toISOString() });
      fetchSessions();
    } catch (err) { console.error(err); alert('Failed to save workout'); }
  };

  if (loading) return (
    <div className="fade-in space-y-6">
      <Skeleton className="h-12 w-64 bg-[var(--bg-card)]" />
      <div className="grid-2 mt-6">
        <Skeleton className="h-[200px] w-full rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-color)]" />
        <Skeleton className="h-[200px] w-full rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-color)]" />
      </div>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Workout History</h1>
          <p>Track your sessions and beat your records.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <span style={{ fontSize: 18, marginRight: 8 }}>+</span> Log Workout
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="empty-state card flex flex-col items-center justify-center border-dashed border-2 bg-[var(--bg-secondary)] py-16">
          <div className="empty-icon text-5xl mb-4">📍</div>
          <h3 className="text-xl font-[var(--font-heading)] font-semibold text-white">No Workouts Yet</h3>
          <p className="text-[var(--text-secondary)] mb-6 text-center max-w-sm">Start your fitness journey by logging your first workout today.</p>
          <Button onClick={() => setShowModal(true)}>Log Workout</Button>
        </div>
      ) : (
        <div className="grid-2">
          {sessions.map(session => (
            <div key={session._id} className="card">
              <div className="card-header" style={{ marginBottom: 12 }}>
                <div>
                  <h3 className="card-title">{session.name}</h3>
                  <div className="card-subtitle">{new Date(session.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="badge badge-primary">{session.duration} min</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{session.totalVolume.toLocaleString()} kg vol</div>
                </div>
              </div>
              
              <div style={{ padding: '12px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                {session.exercises.slice(0, 3).map((ex, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>{ex.sets.length}x {ex.exerciseName}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {Math.max(...ex.sets.map(s => s.weight))} kg max
                    </span>
                  </div>
                ))}
                {session.exercises.length > 3 && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>+ {session.exercises.length - 3} more exercises</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Workout Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 800 }}>
            <div className="modal-header">
              <h2 className="modal-title">Log Workout</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label className="form-label">Workout Name</label>
              <input type="text" className="form-input" placeholder="e.g. Pull Day, Leg Day" 
                value={newWorkout.name} onChange={e => setNewWorkout({...newWorkout, name: e.target.value})} 
              />
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <select className="form-select" onChange={e => {
                const ex = exercises.find(x => x._id === e.target.value);
                if (ex) addExerciseToWorkout(ex);
                e.target.value = "";
              }}>
                <option value="">+ Add Exercise...</option>
                {exercises.map(ex => <option key={ex._id} value={ex._id}>{ex.name}</option>)}
              </select>
            </div>

            {/* Active Exercises List */}
            {activeExercises.map((ae, idx) => (
              <div key={idx} className="card" style={{ marginBottom: 16, padding: 16, background: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 16, color: 'var(--accent-primary)' }}>{ae.exerciseName}</h3>
                  <button className="btn-icon" onClick={() => removeExercise(idx)} style={{ color: 'var(--text-muted)' }}>✕</button>
                </div>
                
                <table style={{ width: '100%', marginBottom: 16 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 40, padding: '8px 4px' }}>Set</th>
                      <th style={{ padding: '8px 4px' }}>kg</th>
                      <th style={{ padding: '8px 4px' }}>Reps</th>
                      <th style={{ width: 40, padding: '8px 4px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ae.sets.map((set, sIdx) => (
                      <tr key={sIdx}>
                        <td style={{ padding: '4px' }}><div className="badge flex justify-center w-full" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>{set.setNumber}</div></td>
                        <td style={{ padding: '4px' }}>
                          <input type="number" inputMode="decimal" className="form-input text-center font-bold" style={{ padding: '10px' }}
                            value={set.weight} onChange={e => updateSet(idx, sIdx, 'weight', e.target.value)} />
                        </td>
                        <td style={{ padding: '4px' }}>
                          <input type="number" inputMode="decimal" className="form-input text-center font-bold" style={{ padding: '10px' }}
                            value={set.reps} onChange={e => updateSet(idx, sIdx, 'reps', e.target.value)} />
                        </td>
                        <td style={{ padding: '4px', textAlign: 'center' }}>
                          <Button variant="ghost" size="icon" onClick={() => removeSet(idx, sIdx)} className="text-[var(--text-muted)] hover:text-[var(--accent-secondary)]">✕</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button variant="secondary" size="sm" onClick={() => addSet(idx)} className="w-full mt-2 border-dashed tracking-widest">+ ADD SET</Button>
              </div>
            ))}

            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSaveWorkout} disabled={activeExercises.length === 0}>
                Complete Workout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
