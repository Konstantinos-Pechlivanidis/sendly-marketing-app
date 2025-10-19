import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Stat = forwardRef(({ 
  className,
  icon,
  label,
  value,
  delta,
  deltaType = "neutral",
  ...props 
}, ref) => {
  const deltaVariants = {
    positive: "text-positive",
    negative: "text-negative", 
    neutral: "text-ink-secondary",
  };

  const deltaIcons = {
    positive: "↗",
    negative: "↘",
    neutral: "→",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "bg-card rounded-2xl border border-white/20 p-6 shadow-card transition-all duration-200 hover:shadow-elevated",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
              {icon}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-ink-secondary">{label}</p>
            <p className="text-2xl font-bold text-ink">{value}</p>
          </div>
        </div>
        {delta && (
          <div className={cn(
            "flex items-center space-x-1 text-sm font-medium",
            deltaVariants[deltaType]
          )}>
            <span>{deltaIcons[deltaType]}</span>
            <span>{delta}</span>
          </div>
        )}
      </div>
    </div>
  );
});

Stat.displayName = "Stat";

export { Stat };
