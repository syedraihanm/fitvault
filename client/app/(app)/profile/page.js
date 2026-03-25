'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';

export default function Profile() {
  const { user, updateUser, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    height: user?.height || '',
    weight: user?.weight || '',
    age: user?.age || '',
    gender: user?.gender || 'male',
    fitnessGoal: user?.fitnessGoal || 'maintenance',
    activityLevel: user?.activityLevel || 'moderate',
    dailyCalorieTarget: user?.dailyCalorieTarget || 2000,
    dailyProteinTarget: user?.dailyProteinTarget || 150,
    dailyWaterTarget: user?.dailyWaterTarget || 2500,
    dailyStepTarget: user?.dailyStepTarget || 10000,
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePwdChange = (e) => setPwdData({ ...pwdData, [e.target.name]: e.target.value });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const { authAPI } = await import('@/lib/api');
      const payload = { ...formData };
      ['height', 'weight', 'age', 'dailyCalorieTarget', 'dailyProteinTarget', 'dailyWaterTarget', 'dailyStepTarget'].forEach(k => {
        if (payload[k]) payload[k] = Number(payload[k]);
      });
      const res = await authAPI.updateProfile(payload);
      updateUser(res.data.user);
      setSuccessMsg('Profile updated successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { console.error(err); alert('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      return setPwdMsg({ type: 'error', text: 'New passwords do not match' });
    }
    try {
      const { authAPI } = await import('@/lib/api');
      await authAPI.changePassword({ currentPassword: pwdData.currentPassword, newPassword: pwdData.newPassword });
      setPwdMsg({ type: 'success', text: 'Password updated successfully' });
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwdMsg({ type: '', text: '' }), 3000);
    } catch (err) { 
      setPwdMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    }
  };

  if (loading) return null;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Profile Settings</h1>
        <p>Manage your account, body metrics, and targets.</p>
      </div>

      <div className="grid-2">
        <form className="card" onSubmit={handleSaveProfile}>
          <div className="card-header">
            <h3 className="card-title">Personal Information & Goals</h3>
            {successMsg && <span className="badge badge-green">{successMsg}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input type="number" className="form-input" name="height" value={formData.height} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input type="number" className="form-input" name="weight" value={formData.weight} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="number" className="form-input" name="age" value={formData.age} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Main Goal</label>
              <select className="form-select" name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange}>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="strength_improvement">Strength Improvement</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Activity Level</label>
              <select className="form-select" name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate Activity</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>
          </div>

          <h4 style={{ marginTop: 24, marginBottom: 16, fontSize: 16, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>Daily Targets</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Calories (kcal)</label>
              <input type="number" className="form-input" name="dailyCalorieTarget" value={formData.dailyCalorieTarget} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Protein (g)</label>
              <input type="number" className="form-input" name="dailyProteinTarget" value={formData.dailyProteinTarget} onChange={handleChange} />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Water Intake (ml)</label>
              <input type="number" className="form-input" name="dailyWaterTarget" value={formData.dailyWaterTarget} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Steps Goal</label>
              <input type="number" className="form-input" name="dailyStepTarget" value={formData.dailyStepTarget} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>

        <form className="card" onSubmit={handleUpdatePassword} style={{ alignSelf: 'start' }}>
          <div className="card-header">
            <h3 className="card-title">Security</h3>
            {pwdMsg.text && (
              <span className={`badge ${pwdMsg.type === 'success' ? 'badge-green' : 'badge-fire'}`}>
                {pwdMsg.text}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input type="password" className="form-input" name="currentPassword" value={pwdData.currentPassword} onChange={handlePwdChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-input" name="newPassword" value={pwdData.newPassword} onChange={handlePwdChange} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input type="password" className="form-input" name="confirmPassword" value={pwdData.confirmPassword} onChange={handlePwdChange} required />
          </div>

          <button type="submit" className="btn btn-secondary">Update Password</button>
        </form>
      </div>
    </div>
  );
}
