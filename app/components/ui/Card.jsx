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
    default: "bg-white border border-gray-200 shadow-md",
    elevated: "bg-white border border-gray-200 shadow-lg",
    glass: "bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl",
    outline: "bg-transparent border border-gray-300 shadow-none",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        variants[variant],
        interactive && "cursor-pointer hover:-translate-y-1 hover:shadow-lg",
        translucent && "bg-white/80 backdrop-blur-sm",
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
      className={cn("text-xl text-gray-900 font-semibold leading-tight", className)}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600 leading-normal", className)}
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
