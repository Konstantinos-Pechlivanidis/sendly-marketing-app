import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors-opacity-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active disabled:bg-primary-disabled",
    secondary: "bg-secondary text-white hover:bg-secondary-hover active:bg-secondary-active disabled:bg-secondary-disabled",
    danger: "bg-danger text-white hover:bg-danger-hover active:bg-danger-active disabled:bg-danger-disabled",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white active:bg-primary-active disabled:border-primary-disabled disabled:text-primary-disabled",
    ghost: "text-primary hover:bg-primary/10 active:bg-primary/20 disabled:text-primary-disabled",
    link: "text-primary underline-offset-4 hover:underline disabled:text-primary-disabled"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-sm rounded-lg",
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
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
