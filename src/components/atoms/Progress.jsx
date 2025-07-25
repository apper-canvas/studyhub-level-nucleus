import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Progress = forwardRef(({ className, value = 0, max = 100, variant = "primary", ...props }, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600",
    success: "bg-gradient-to-r from-green-500 to-green-600",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    error: "bg-gradient-to-r from-red-500 to-red-600",
  };

  return (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-300 ease-out", variants[variant])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;