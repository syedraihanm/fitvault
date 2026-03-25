'use client';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';

export default function AuthLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;
  if (user) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo flex flex-col items-center justify-center">
          <Logo size="lg" className="justify-center mb-2" />
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Unleash your potential</p>
        </div>
        {children}
      </div>
    </div>
  );
}
