'use client';
import { useState, useEffect } from 'react';
import { coachAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function Coach() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await coachAPI.getSuggestions();
      setSuggestions(res.data.suggestions);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>AI Fitness Coach</h1>
        <p>Your personalized recommendations based on your {user?.fitnessGoal?.replace('_', ' ')} goal and biometrics.</p>
      </div>

      {(!user?.height || !user?.weight || !user?.age) ? (
        <div className="card empty-state" style={{ background: 'var(--gradient-card)' }}>
          <div className="empty-icon">⚠️</div>
          <h3>Incomplete Profile</h3>
          <p>Please complete your profile (Height, Weight, Age) to receive accurate AI Coach recommendations.</p>
          <Link href="/profile" className="btn btn-primary" style={{ marginTop: 16 }}>Complete Profile</Link>
        </div>
      ) : (
        <div className="grid-2">
          {suggestions.map((suggestion, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', gap: 20 }}>
              <div style={{ 
                width: 64, height: 64, borderRadius: 'var(--radius-md)', 
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 
              }}>
                {suggestion.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="card-title" style={{ color: 'var(--accent-primary)', marginBottom: 4 }}>
                  {suggestion.title}
                </h3>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                  {suggestion.value} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>{suggestion.unit}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {suggestion.description}
                </p>
                {suggestion.type === 'calories' && (
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => {
                    import('@/lib/api').then(({ authAPI }) => {
                      authAPI.updateProfile({ dailyCalorieTarget: suggestion.value })
                        .then(() => alert('Successfully updated daily calorie target!'));
                    });
                  }}>Apply to Profile Target</button>
                )}
                {suggestion.type === 'protein' && (
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => {
                    import('@/lib/api').then(({ authAPI }) => {
                      authAPI.updateProfile({ dailyProteinTarget: suggestion.value })
                        .then(() => alert('Successfully updated daily protein target!'));
                    });
                  }}>Apply to Profile Target</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
