import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const AppShell = forwardRef(({ 
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

AppShell.displayName = "AppShell";

const AppHeader = forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <header
      ref={ref}
      className={cn(
        "sticky top-0 z-50 glass-header border-b border-white/20",
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {children}
      </div>
    </header>
  );
});

AppHeader.displayName = "AppHeader";

const AppSidebar = forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <aside
      ref={ref}
      className={cn(
        "hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50",
        className
      )}
      {...props}
    >
      <div className="flex flex-col flex-grow bg-card/50 backdrop-blur-md border-r border-white/20 pt-16">
        {children}
      </div>
    </aside>
  );
});

AppSidebar.displayName = "AppSidebar";

const AppMain = forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "lg:pl-64 flex-1",
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {children}
      </div>
    </main>
  );
});

AppMain.displayName = "AppMain";

const AppContent = forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "space-y-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

AppContent.displayName = "AppContent";

export { AppShell, AppHeader, AppSidebar, AppMain, AppContent };
