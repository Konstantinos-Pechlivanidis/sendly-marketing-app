import { createContext, useContext, useState } from "react";
import { cn } from "../../utils/cn";

const TabsContext = createContext();

const Tabs = ({ defaultValue, value, onValueChange, className, ...props }) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;
  
  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)} {...props} />
    </TabsContext.Provider>
  );
};

const TabsList = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};

const TabsTrigger = ({ className, value, ...props }) => {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isSelected = selectedValue === value;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors-opacity-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-surface text-deep shadow-sm"
          : "text-muted hover:text-deep",
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    />
  );
};

const TabsContent = ({ className, value, ...props }) => {
  const { value: selectedValue } = useContext(TabsContext);
  
  if (selectedValue !== value) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
      {...props}
    />
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
