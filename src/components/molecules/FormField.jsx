import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  type = "text", 
  options = [], 
  className,
  required = false,
  children,
  ...props 
}) => {
  const renderInput = () => {
    // If children are provided, render them (used by StudentForm)
    if (children) {
      return children;
    }

    // Fallback to internal rendering based on type (backward compatibility)
    if (type === "select") {
      return (
        <Select {...props} className={cn(error && "border-red-500 focus:border-red-500 focus:ring-red-500/20")}>
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }

    if (type === "textarea") {
      return (
        <textarea
          {...props}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          )}
        />
      );
    }

    return (
      <Input
        type={type}
        {...props}
        className={cn(error && "border-red-500 focus:border-red-500 focus:ring-red-500/20")}
      />
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;