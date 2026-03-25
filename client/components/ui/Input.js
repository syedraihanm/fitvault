import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(({
  label,
  error,
  className,
  containerClassName,
  ...props
}, ref) => {
  return (
    <div className={cn('form-group mb-4 w-full', containerClassName)}>
      {label && (
        <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-[var(--text-primary)] text-sm transition-colors duration-200',
          'focus:outline-none focus:border-[var(--accent-primary)] focus:shadow-[0_0_0_3px_rgba(204,255,0,0.15)]',
          'placeholder-[var(--text-muted)]',
          error && 'border-[var(--accent-secondary)] focus:border-[var(--accent-secondary)] focus:shadow-[0_0_0_3px_rgba(255,51,102,0.15)]',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-[var(--accent-secondary)] text-xs mt-1 block">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
