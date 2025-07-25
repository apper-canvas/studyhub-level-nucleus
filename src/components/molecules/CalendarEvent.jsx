import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const CalendarEvent = ({ event, onEdit, onDelete }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case "assignment": return "FileText";
      case "exam": return "BookOpen";
      case "class": return "Clock";
      default: return "Calendar";
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case "assignment": return "primary";
      case "exam": return "error";
      case "class": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="group p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 bg-white">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`mt-0.5 p-1.5 rounded-full ${
            event.type === "assignment" ? "bg-primary-100 text-primary-600" :
            event.type === "exam" ? "bg-red-100 text-red-600" :
            "bg-secondary-100 text-secondary-600"
          }`}>
            <ApperIcon name={getEventIcon(event.type)} className="h-3 w-3" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{event.courseName}</p>
            
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <ApperIcon name="Clock" className="h-3 w-3" />
                <span>{format(new Date(event.date), "h:mm a")}</span>
              </div>
              <Badge variant={getEventColor(event.type)} className="text-xs">
                {event.type}
              </Badge>
            </div>
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 ml-2">
          {onEdit && (
            <button
              onClick={() => onEdit(event)}
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="Edit" className="h-3 w-3" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(event.id)}
              className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"
            >
              <ApperIcon name="Trash2" className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarEvent;