import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const CTA = forwardRef(({ 
  className, 
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    primary: "bg-primary text-white shadow-lg",
    secondary: "bg-secondary text-white shadow-lg",
    accent: "bg-accent text-white shadow-lg",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-8 text-center transition-all duration-200 hover:shadow-lg",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
CTA.displayName = "CTA";

const CTATitle = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("text-xl font-semibold mb-2", className)}
      {...props}
    >
      {children}
    </h3>
  );
});
CTATitle.displayName = "CTATitle";

const CTADescription = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm opacity-90 mb-6", className)}
      {...props}
    >
      {children}
    </p>
  );
});
CTADescription.displayName = "CTADescription";

const CTAActions = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col sm:flex-row gap-3 justify-center", className)}
      {...props}
    >
      {children}
    </div>
  );
});
CTAActions.displayName = "CTAActions";

export { CTA, CTATitle, CTADescription, CTAActions };
