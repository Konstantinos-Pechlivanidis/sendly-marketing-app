import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Hero = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <section
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/5",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="relative">
        {children}
      </div>
    </section>
  );
});
Hero.displayName = "Hero";

const HeroContent = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
});
HeroContent.displayName = "HeroContent";

const HeroTitle = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <h1
      ref={ref}
      className={cn(
        "text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
});
HeroTitle.displayName = "HeroTitle";

const HeroSubtitle = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "mt-6 text-lg leading-8 text-gray-600 max-w-2xl",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
});
HeroSubtitle.displayName = "HeroSubtitle";

const HeroActions = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-10 flex items-center gap-x-6", className)}
      {...props}
    >
      {children}
    </div>
  );
});
HeroActions.displayName = "HeroActions";

export { Hero, HeroContent, HeroTitle, HeroSubtitle, HeroActions };
