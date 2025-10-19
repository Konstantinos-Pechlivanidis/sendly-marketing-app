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
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    neutral: 'bg-neutral/10 text-neutral-700',
    positive: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    negative: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
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

