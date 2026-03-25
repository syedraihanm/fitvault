import { cn } from '@/lib/utils';

export function Logo({ size = 'md', showText = true, className }) {
  const sizes = {
    sm: { icon: 16, box: 28, text: 'text-base' },
    md: { icon: 20, box: 36, text: 'text-xl' },
    lg: { icon: 32, box: 56, text: 'text-4xl' },
  };

  const current = sizes[size];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div 
        className="flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--gradient-primary)] text-black shadow-[var(--shadow-glow)]"
        style={{ width: current.box, height: current.box }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={current.icon} 
          height={current.icon} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* A sleek, dynamic lightning bolt representing performance and energy */}
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
        </svg>
      </div>
      {showText && (
        <span 
          className={cn(
            'font-[var(--font-heading)] font-black tracking-tight',
            current.text
          )}
          style={{ color: 'var(--text-primary)' }}
        >
          FitVault
        </span>
      )}
    </div>
  );
}
