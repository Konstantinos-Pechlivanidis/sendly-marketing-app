import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-muted text-ink-secondary',
    primary: 'bg-brand/10 text-brand',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    neutral: 'bg-neutral/10 text-neutral-700',
    positive: 'bg-positive/10 text-positive',
    warning: 'bg-warning/10 text-warning',
    negative: 'bg-negative/10 text-negative',
    success: 'bg-positive/10 text-positive',
    danger: 'bg-negative/10 text-negative',
    info: 'bg-brand/10 text-brand',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span 
      ref={ref}
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-colors duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export { Badge };
export default Badge;

