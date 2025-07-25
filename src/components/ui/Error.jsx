import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-3">
          <ApperIcon name="AlertCircle" className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="mb-2 font-display text-lg font-semibold text-gray-900">
          Oops! Something went wrong
        </h3>
        <p className="mb-6 text-sm text-gray-600">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Error;