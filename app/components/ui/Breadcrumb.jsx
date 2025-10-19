import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Breadcrumb = forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <nav
      ref={ref}
      className={cn(
        "flex items-center space-x-2 text-sm text-gray-600",
        className
      )}
      aria-label="Breadcrumb"
      {...props}
    >
      {children}
    </nav>
  );
});

Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbItem = forwardRef(({ 
  className,
  href,
  children,
  isLast = false,
  ...props 
}, ref) => {
  if (isLast) {
    return (
      <span
        ref={ref}
        className={cn(
          "text-gray-900 font-medium",
          className
        )}
        aria-current="page"
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "text-gray-600 hover:text-gray-900 transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
});

BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbSeparator = forwardRef(({ 
  className,
  ...props 
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "text-gray-400",
        className
      )}
      {...props}
    >
      /
    </span>
  );
});

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator };
