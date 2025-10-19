import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Section = forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <section
      ref={ref}
      className={cn(
        "max-w-7xl mx-auto px-4 lg:px-6 space-y-6",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
});

Section.displayName = "Section";

const SectionHeader = forwardRef(({ 
  className,
  title,
  description,
  action,
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        {title && (
          <h2 className="text-2xl font-bold text-ink">{title}</h2>
        )}
        {description && (
          <p className="text-ink-secondary">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex items-center space-x-3">
          {action}
        </div>
      )}
      {children}
    </div>
  );
});

SectionHeader.displayName = "SectionHeader";

const SectionContent = forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "space-y-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

SectionContent.displayName = "SectionContent";

export { Section, SectionHeader, SectionContent };
