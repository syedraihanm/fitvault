'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      // Redirect handled by layout
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-error" style={{ marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
      
      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      
      <Button type="submit" size="lg" isLoading={isLoading} className="mt-2">
        Sign In
      </Button>

      <div className="auth-footer">
        Don&apos;t have an account? <Link href="/register">Create one</Link><br/>
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Admin: admin@fitvault.com / admin123</p>
        </div>
      </div>
    </form>
  );
}
