import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

export default function DashboardCharts({ charts }) {
  if (!charts) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Calories</CardTitle>
        </CardHeader>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts.weeklyCalories}>
              <defs>
                <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3366" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff3366" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} width={40} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                itemStyle={{ color: '#ff3366' }}
              />
              <Area type="monotone" dataKey="calories" stroke="#ff3366" strokeWidth={3} fillOpacity={1} fill="url(#colorCal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workout Consistency</CardTitle>
          <span className="badge" style={{ background: 'rgba(204, 255, 0, 0.15)', color: 'var(--accent-primary)' }}>Last 4 Weeks</span>
        </CardHeader>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.workoutFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} width={30} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'var(--bg-input)' }}
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              />
              <Bar dataKey="workouts" fill="url(#colorWorkout)" radius={[4, 4, 0, 0]}>
                <defs>
                  <linearGradient id="colorWorkout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ccff00" />
                    <stop offset="100%" stopColor="#00f0ff" />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
