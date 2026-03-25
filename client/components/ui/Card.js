import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Card = forwardRef(({ className, children, hoverable = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6 transition-all duration-300',
        hoverable && 'hover:border-[var(--border-glow)] hover:shadow-[var(--shadow-glow)] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex justify-between items-center mb-4', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3 className={cn('text-base font-semibold font-[var(--font-heading)]', className)} {...props}>
      {children}
    </h3>
  );
};
