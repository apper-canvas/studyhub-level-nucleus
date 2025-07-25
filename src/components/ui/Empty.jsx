import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  icon = "BookOpen",
  actionLabel = "Add Item",
  onAction 
}) => {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 p-4">
          <ApperIcon name={icon} className="h-12 w-12 text-gradient" />
        </div>
        <h3 className="mb-2 font-display text-xl font-semibold text-gray-900">
          {title}
        </h3>
        <p className="mb-6 text-gray-600 max-w-sm">{description}</p>
        {onAction && (
          <Button onClick={onAction} variant="primary" size="lg">
            <ApperIcon name="Plus" className="mr-2 h-5 w-5" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Empty;