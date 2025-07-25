import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatsCard = ({ title, value, icon, trend, color = "primary" }) => {
  const colorVariants = {
    primary: "text-primary-600 bg-primary-100",
    secondary: "text-secondary-600 bg-secondary-100",
    accent: "text-accent-600 bg-accent-100",
    success: "text-green-600 bg-green-100",
    warning: "text-yellow-600 bg-yellow-100",
    error: "text-red-600 bg-red-100",
  };

  return (
    <Card className="hover:shadow-elevated transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold font-display text-gradient">{value}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                <ApperIcon 
                  name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
                  className={cn(
                    "h-4 w-4",
                    trend > 0 ? "text-green-500" : "text-red-500"
                  )}
                />
                <span className={cn(
                  "text-sm font-medium",
                  trend > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {Math.abs(trend)}%
                </span>
              </div>
            )}
          </div>
          <div className={cn("rounded-full p-3", colorVariants[color])}>
            <ApperIcon name={icon} className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;