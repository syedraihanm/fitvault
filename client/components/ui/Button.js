import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading,
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'btn';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-icon',
  };

  const sizes = {
    sm: 'btn-sm',
    md: '',
    lg: 'w-full',
    icon: '',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="spinner" style={{ width: '20px', height: '20px', borderTopColor: variant === 'primary' ? '#000' : 'var(--accent-primary)', borderWidth: '2px' }} /> : children}
    </button>
  );
});

Button.displayName = 'Button';
