import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const PageLayout = forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "min-h-screen bg-gradient-to-br from-[#F7F9F8] to-[#EAF5F3]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

PageLayout.displayName = "PageLayout";

const PageHeader = forwardRef(({ 
  className,
  title,
  subtitle,
  actions,
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-10",
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {title && (
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-3">
              {actions}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
});

PageHeader.displayName = "PageHeader";

const PageContent = forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "max-w-7xl mx-auto px-4 lg:px-6 py-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

PageContent.displayName = "PageContent";

const PageSection = forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <section
      ref={ref}
      className={cn(
        "space-y-6",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
});

PageSection.displayName = "PageSection";

export { PageLayout, PageHeader, PageContent, PageSection };
