import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default", 
  interactive = false,
  translucent = false, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-card border border-white/20 shadow-card",
    elevated: "bg-card border border-white/20 shadow-elevated",
    glass: "glass-surface border border-white/20 shadow-glass",
    outline: "bg-transparent border border-ink-tertiary shadow-none",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl transition-all duration-200",
        variants[variant],
        interactive && "cursor-pointer hover:-translate-y-1 hover:shadow-elevated",
        translucent && "glass-surface",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

const CardHeader = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2 p-6", className)}
      {...props}
    />
  );
});

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("text-h3 text-ink font-semibold leading-tight tracking-tight", className)}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-ink-secondary leading-normal", className)}
      {...props}
    />
  );
});

CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
});

CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-between p-6 pt-0", className)}
      {...props}
    />
  );
});

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
