import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { AuthContext } from "../../App";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Button
      onClick={logout}
      variant="ghost"
      size="sm"
      className="text-gray-600 hover:text-gray-900 p-1"
      title="Logout"
    >
      <ApperIcon name="LogOut" className="h-4 w-4" />
    </Button>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

const navigationItems = [
    { name: "Dashboard", href: "/", icon: "Home" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "FileText" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Grades", href: "/grades", icon: "BarChart3" },
    { name: "Calendar", href: "/calendar", icon: "Calendar" },
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        )}
      >
        <ApperIcon name={item.icon} className="h-5 w-5" />
        <span>{item.name}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display text-gradient">StudyHub</h1>
                  <p className="text-sm text-gray-600">Academic Management</p>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 px-4 space-y-2">
              {navigationItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>

<div className="flex-shrink-0 px-4 mt-8">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                      <ApperIcon name="User" className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Student Dashboard</p>
                      <p className="text-xs text-gray-600">Manage your academic life</p>
                    </div>
                  </div>
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between flex-shrink-0 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold font-display text-gradient">StudyHub</h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;