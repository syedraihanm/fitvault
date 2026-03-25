'use client';
import { useState, useEffect } from 'react';
import { programAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function Programs() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [myPrograms, setMyPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browser'); // 'browser' | 'my'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        programAPI.getAll(),
        programAPI.getMy()
      ]);
      setPrograms(allRes.data.programs);
      setMyPrograms(myRes.data.programs);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleFollow = async (id) => {
    try {
      await programAPI.toggleFollow(id);
      fetchData();
    } catch (err) { console.error(err); alert('Failed to update program status'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  const displayPrograms = activeTab === 'browser' ? programs : myPrograms;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Workout Programs</h1>
        <p>Follow structured plans mapped perfectly for your goal.</p>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'browser' ? 'active' : ''}`} onClick={() => setActiveTab('browser')}>Program Browser</button>
        <button className={`tab ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>My Programs</button>
      </div>

      {displayPrograms.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📋</div>
          <h3>No Programs Found</h3>
          <p>{activeTab === 'my' ? 'You are not following any programs.' : 'No programs available in the database.'}</p>
        </div>
      ) : (
        <div className="grid-2">
          {displayPrograms.map(program => {
            const isFollowing = myPrograms.some(p => p._id === program._id);
            return (
              <div key={program._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 className="card-title" style={{ fontSize: 20, marginBottom: 4 }}>{program.name}</h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className="badge badge-primary">{program.category}</span>
                      <span className="badge" style={{ background: 'var(--bg-input)' }}>{program.difficulty}</span>
                    </div>
                  </div>
                  <button 
                    className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    onClick={() => toggleFollow(program._id)}
                  >
                    {isFollowing ? 'Following' : 'Follow Plan'}
                  </button>
                </div>
                
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, flex: 1 }}>
                  {program.description}
                </p>

                <div style={{ display: 'flex', gap: 16, borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                  <div>
                    <div className="stat-label">Frequency</div>
                    <div style={{ fontWeight: 600 }}>{program.daysPerWeek} days/week</div>
                  </div>
                  <div>
                    <div className="stat-label">Duration</div>
                    <div style={{ fontWeight: 600 }}>{program.duration}</div>
                  </div>
                  <div>
                    <div className="stat-label">Followers</div>
                    <div style={{ fontWeight: 600 }}>{program.followers?.length || 0}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
