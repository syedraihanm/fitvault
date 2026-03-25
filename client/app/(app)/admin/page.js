'use client';
import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers({ limit: 50 })
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDeleteUser = async (id, role) => {
    if (role === 'admin') return alert('Cannot delete admin user');
    if (!confirm('Permanently delete this user? This action cannot be undone.')) return;
    try {
      await adminAPI.deleteUser(id);
      fetchData();
    } catch (err) { console.error(err); alert('Failed to delete user'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Admin Control Panel</h1>
        <p>System overview and user management.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card purple">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{stats?.totalUsers}</div>
          <div className="stat-sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--accent-green)' }}>+{stats?.newUsersToday} today</span>
          </div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-label">Total Workouts</div>
          <div className="stat-value">{stats?.totalWorkouts}</div>
          <div className="stat-sub">Logged by users</div>
        </div>
        <div className="stat-card fire">
          <div className="stat-label">Total Exercises</div>
          <div className="stat-value">{stats?.totalExercises}</div>
          <div className="stat-sub">In main database</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Total Foods</div>
          <div className="stat-value">{stats?.totalFoods}</div>
          <div className="stat-sub">In main database</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 32 }}>
        <div className="card-header">
          <h3 className="card-title">User Management</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Goal</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-fire' : 'badge-primary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.fitnessGoal?.replace('_', ' ')}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.role !== 'admin' && (
                      <button 
                        className="btn-icon" 
                        style={{ color: 'var(--accent-secondary)' }}
                        onClick={() => handleDeleteUser(u._id, u.role)}
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
