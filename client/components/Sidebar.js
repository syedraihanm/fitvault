'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Logo } from '@/components/ui/Logo';

export default function Sidebar({ isOpen, onClose, isAdmin }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Workouts', path: '/workouts', icon: '💪' },
    { name: 'Programs', path: '/programs', icon: '📋' },
    { name: 'Nutrition', path: '/nutrition', icon: '🥗' },
    { name: 'Progress', path: '/progress', icon: '📈' },
    { name: 'AI Coach', path: '/coach', icon: '🤖' },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: '⚙️' });
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sidebar-logo p-0 mb-8 mt-2 ml-2">
          <Logo size="md" />
        </div>
        {isOpen && (
          <button className="hamburger" onClick={onClose} style={{ marginBottom: 32 }}>✕</button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <Link 
            key={item.path} 
            href={item.path}
            onClick={() => isOpen && onClose()}
            className={`nav-item ${pathname.includes(item.path) ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link 
          href="/profile" 
          onClick={() => isOpen && onClose()}
          className={`nav-item ${pathname.includes('/profile') ? 'active' : ''}`}
          style={{ marginBottom: 8 }}
        >
          <span className="nav-icon">👤</span>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Settings</span>
          </div>
        </Link>
        <button onClick={logout} className="nav-item" style={{ color: 'var(--accent-secondary)' }}>
          <span className="nav-icon">🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
