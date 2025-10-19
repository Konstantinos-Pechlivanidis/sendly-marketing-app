import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  loading = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none touch-target";
  
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-hover active:scale-98 active:bg-brand-active disabled:bg-brand-disabled shadow-sm hover:shadow-md",
    secondary: "bg-secondary text-white hover:bg-secondary-hover active:scale-98 active:bg-secondary-active disabled:bg-secondary-disabled shadow-sm hover:shadow-md",
    danger: "bg-negative text-white hover:bg-negative-hover active:scale-98 active:bg-negative-active disabled:bg-negative-disabled shadow-sm hover:shadow-md",
    outline: "border border-brand text-brand hover:bg-brand hover:text-white active:scale-98 active:bg-brand-active disabled:border-brand-disabled disabled:text-brand-disabled",
    ghost: "text-brand hover:bg-brand/10 active:scale-98 active:bg-brand/20 disabled:text-brand-disabled",
    link: "text-brand underline-offset-4 hover:underline disabled:text-brand-disabled",
    neutral: "bg-neutral text-white hover:bg-neutral-hover active:scale-98 active:bg-neutral-active disabled:bg-neutral-disabled shadow-sm hover:shadow-md",
    accent: "bg-accent text-white hover:bg-accent-hover active:scale-98 active:bg-accent-active disabled:bg-accent-disabled shadow-sm hover:shadow-md"
  };
  
  const sizes = {
    sm: "h-9 px-3 text-sm rounded-lg",
    md: "h-11 px-4 text-sm rounded-xl",
    lg: "h-12 px-6 text-base rounded-xl",
    xl: "h-14 px-8 text-lg rounded-2xl"
  };
  
  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
