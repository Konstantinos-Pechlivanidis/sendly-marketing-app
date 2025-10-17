import { clsx } from "clsx";

/**
 * Utility function for combining class names with conditional logic
 * Combines clsx functionality for conditional classes
 */
export function cn(...inputs) {
  return clsx(inputs);
}
