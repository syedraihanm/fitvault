'use client';
import { useState, useEffect } from 'react';
import { dashboardAPI, trackingAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

const DashboardCharts = dynamic(() => import('@/components/features/analytics/DashboardCharts'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <Skeleton className="h-[380px] w-full bg-[var(--bg-card)] border border-[var(--border-color)]" />
      <Skeleton className="h-[380px] w-full bg-[var(--bg-card)] border border-[var(--border-color)]" />
    </div>
  )
});

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardAPI.get();
      setData(res.data.dashboard);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogWater = async () => {
    try {
      await trackingAPI.logWater({ amount: 250 });
      fetchDashboard();
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="fade-in space-y-8">
      <div className="space-y-2 mb-8">
        <Skeleton className="h-8 w-64 bg-[var(--bg-card)]" />
        <Skeleton className="h-4 w-48 bg-[var(--bg-card)]" />
      </div>
      <div className="stat-grid">
        <Skeleton className="h-[140px] w-full rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-color)]" />
        <Skeleton className="h-[140px] w-full rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-color)]" />
        <Skeleton className="h-[140px] w-full rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-color)]" />
        <Skeleton className="h-[140px] w-full rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-color)]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Skeleton className="h-[380px] w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-lg)]" />
        <Skeleton className="h-[380px] w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-lg)]" />
      </div>
    </div>
  );
  if (!data) return <div className="empty-state">Failed to load dashboard</div>;

  const { nutrition, workout, water, steps, charts } = data;

  const getCalorieColor = () => {
    if (!nutrition.calorieTarget) return 'primary';
    const percent = (nutrition.calories / nutrition.calorieTarget) * 100;
    if (user?.fitnessGoal === 'weight_loss' && percent > 100) return 'fire';
    if (percent > 110) return 'fire';
    return 'green';
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Here&apos;s your daily fitness summary.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="stat-grid">
        <div className="stat-card fire">
          <div className="stat-icon">🔥</div>
          <div className="stat-label">Calories Eaten</div>
          <div className="stat-value">{nutrition.calories.toLocaleString()} <span style={{ fontSize: 14 }}>/ {nutrition.calorieTarget}</span></div>
          <div className="progress-bar">
            <div className={`progress-fill ${getCalorieColor()}`} style={{ width: `${Math.min(100, (nutrition.calories / (nutrition.calorieTarget || 2000)) * 100)}%` }}></div>
          </div>
          <div className="stat-sub" style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>P: {nutrition.protein}g</span>
            <span>C: {nutrition.carbs}g</span>
            <span>F: {nutrition.fats}g</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">💪</div>
          <div className="stat-label">Today&apos;s Workout</div>
          {workout ? (
            <>
              <div className="stat-value" style={{ fontSize: 20 }}>{workout.name}</div>
              <div className="stat-sub">{workout.exercises} exercises • {workout.duration} min</div>
              <div style={{ marginTop: 8, fontSize: 13, color: 'var(--accent-primary)' }}>{workout.caloriesBurned} kcal burned</div>
            </>
          ) : (
            <>
              <div className="stat-value" style={{ fontSize: 20, color: 'var(--text-muted)' }}>Rest Day</div>
              <div className="stat-sub">No workout logged yet</div>
              <Link href="/workouts" style={{ display: 'block', marginTop: 8 }}>
                <Button size="sm" className="w-full">Log Workout</Button>
              </Link>
            </>
          )}
        </div>

        <div className="stat-card cyan">
          <div className="stat-icon" style={{ display: 'flex', justifyContent: 'space-between' }}>
            💧 
            <Button variant="ghost" size="icon" className="hover:bg-[rgba(0,240,255,0.1)] text-[var(--accent-cyan)]" onClick={handleLogWater}>+</Button>
          </div>
          <div className="stat-label">Water Intake</div>
          <div className="stat-value">{water.glasses} <span style={{ fontSize: 14 }}>glasses</span></div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ background: 'var(--accent-cyan)', width: `${Math.min(100, (water.totalMl / (water.target || 2000)) * 100)}%` }}></div>
          </div>
          <div className="stat-sub" style={{ marginTop: 8 }}>{water.totalMl} ml / {water.target || 2000} ml</div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">👣</div>
          <div className="stat-label">Daily Steps</div>
          <div className="stat-value">{steps.count.toLocaleString()} <span style={{ fontSize: 14 }}>/ {(steps.target || 10000).toLocaleString()}</span></div>
          <div className="progress-bar">
            <div className="progress-fill green" style={{ width: `${Math.min(100, (steps.count / (steps.target || 10000)) * 100)}%` }}></div>
          </div>
          <div className="stat-sub" style={{ marginTop: 8 }}>{steps.calories} kcal burned</div>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts charts={charts} />
    </div>
  );
}
