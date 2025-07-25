import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold font-display text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your academic journey efficiently
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl px-4 py-2">
            <ApperIcon name="Calendar" className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">
              {new Date().toLocaleDateString("en-US", { 
                weekday: "long",
                month: "long", 
                day: "numeric" 
              })}
            </span>
          </div>
          
          <Button variant="primary" size="sm" className="hidden sm:flex">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;