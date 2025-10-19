import { forwardRef } from "react";
import { Button } from "./Button";
import { cn } from "../../utils/cn";

const ActionButton = forwardRef(({ 
  className,
  variant = "primary",
  children,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-hover active:scale-98 shadow-sm hover:shadow-md",
    secondary: "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 active:scale-98",
    danger: "bg-red-600 text-white hover:bg-red-700 active:scale-98 shadow-sm hover:shadow-md",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-98",
  };

  return (
    <Button
      ref={ref}
      className={cn(
        "px-6 py-3 font-medium transition-all duration-200 focus:ring-2 focus:ring-brand/50 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

ActionButton.displayName = "ActionButton";

const ActionGroup = forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center space-x-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

ActionGroup.displayName = "ActionGroup";

export { ActionButton, ActionGroup };
