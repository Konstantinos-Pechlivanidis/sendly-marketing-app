import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const FormSection = forwardRef(({ 
  className, 
  title, 
  description, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-6", className)}
      {...props}
    >
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
});
FormSection.displayName = "FormSection";

const FormField = forwardRef(({ 
  className, 
  label, 
  error, 
  required, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});
FormField.displayName = "FormField";

const FormGroup = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});
FormGroup.displayName = "FormGroup";

const FormActions = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-end space-x-3 pt-6 border-t border-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
});
FormActions.displayName = "FormActions";

export { FormSection, FormField, FormGroup, FormActions };
