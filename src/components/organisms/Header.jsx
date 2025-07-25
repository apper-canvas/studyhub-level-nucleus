import React, { useContext } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Button
      onClick={logout}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2"
    >
      <ApperIcon name="LogOut" className="h-4 w-4" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
};

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
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;