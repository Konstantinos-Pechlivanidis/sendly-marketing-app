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
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px] min-w-[44px]";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-600 active:scale-98 active:bg-primary-700 disabled:bg-primary-300 shadow-sm hover:shadow-md",
    secondary: "bg-secondary text-white hover:bg-secondary-600 active:scale-98 active:bg-secondary-700 disabled:bg-secondary-300 shadow-sm hover:shadow-md",
    danger: "bg-danger text-white hover:bg-danger-600 active:scale-98 active:bg-danger-700 disabled:bg-danger-300 shadow-sm hover:shadow-md",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white active:scale-98 active:bg-primary-700 disabled:border-primary-300 disabled:text-primary-300",
    ghost: "text-primary hover:bg-primary/10 active:scale-98 active:bg-primary/20 disabled:text-primary-300",
    link: "text-primary underline-offset-4 hover:underline disabled:text-primary-300",
    neutral: "bg-neutral text-white hover:bg-neutral-600 active:scale-98 active:bg-neutral-700 disabled:bg-neutral-300 shadow-sm hover:shadow-md",
    accent: "bg-accent text-white hover:bg-accent-600 active:scale-98 active:bg-accent-700 disabled:bg-accent-300 shadow-sm hover:shadow-md"
  };
  
  const sizes = {
    sm: "h-9 px-3 text-sm rounded-md",
    md: "h-11 px-4 text-sm rounded-lg",
    lg: "h-12 px-6 text-base rounded-lg",
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
