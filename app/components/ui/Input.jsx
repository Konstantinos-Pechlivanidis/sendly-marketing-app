import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef(({ 
  className, 
  type, 
  variant = "default",
  error = false,
  ...props 
}, ref) => {
  const variants = {
    default: "border-gray-300 focus:border-primary focus:ring-primary",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500/20",
    success: "border-green-500 focus:border-green-500 focus:ring-green-500/20",
  };

  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        variants[error ? "error" : "default"],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

const Label = forwardRef(({ className, required = false, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-gray-900 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {props.children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
});

Label.displayName = "Label";

const Textarea = forwardRef(({ 
  className, 
  error = false,
  ...props 
}, ref) => {
  const variants = {
    default: "border-gray-300 focus:border-primary focus:ring-primary",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500/20",
    success: "border-green-500 focus:border-green-500 focus:ring-green-500/20",
  };

  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
        variants[error ? "error" : "default"],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

const Select = forwardRef(({ 
  className, 
  error = false,
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "border-gray-300 focus:border-primary focus:ring-primary",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500/20",
    success: "border-green-500 focus:border-green-500 focus:ring-green-500/20",
  };

  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
        variants[error ? "error" : "default"],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export { Input, Label, Textarea, Select };
