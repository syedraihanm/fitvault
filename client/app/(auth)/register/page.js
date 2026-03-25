'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Register() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    height: '', weight: '', age: '', gender: 'male', fitnessGoal: 'maintenance'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    setIsLoading(true);
    try {
      await register({
        name: formData.name, email: formData.email, password: formData.password,
        height: Number(formData.height) || undefined,
        weight: Number(formData.weight) || undefined,
        age: Number(formData.age) || undefined,
        gender: formData.gender, fitnessGoal: formData.fitnessGoal
      });
      // Redirect handled by layout
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-error" style={{ marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
      
      <Input label="Full Name" type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
      
      <Input label="Email Address" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
      
      <div className="form-row">
        <Input label="Password" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required minLength={6} />
        <Input label="Confirm" type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
      </div>

      <div className="form-row">
        <Input label="Height (cm)" type="number" name="height" placeholder="175" value={formData.height} onChange={handleChange} />
        <Input label="Weight (kg)" type="number" name="weight" placeholder="70" value={formData.weight} onChange={handleChange} />
      </div>

      <div className="form-row">
        <div className="form-group mb-4 w-full">
          <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">Gender</label>
          <select className="form-select w-full" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <Input label="Age" type="number" name="age" placeholder="25" value={formData.age} onChange={handleChange} />
      </div>

      <div className="form-group mb-4 w-full">
        <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">Main Fitness Goal</label>
        <select className="form-select w-full" name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange}>
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="strength_improvement">Strength Improvement</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
      
      <Button type="submit" size="lg" isLoading={isLoading} className="mt-2 text-black">
        Create Account
      </Button>

      <div className="auth-footer">
        Already have an account? <Link href="/login">Sign In</Link>
      </div>
    </form>
  );
}
