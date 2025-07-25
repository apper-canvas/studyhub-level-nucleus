import React from "react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format, isToday, isTomorrow, isPast } from "date-fns";

const AssignmentRow = ({ assignment, course, onEdit, onDelete, onToggleStatus }) => {
  const formatDueDate = (date) => {
    const dueDate = new Date(date);
    if (isToday(dueDate)) return "Today";
    if (isTomorrow(dueDate)) return "Tomorrow";
    return format(dueDate, "MMM d, yyyy");
  };

  const getDueDateColor = (date, status) => {
    if (status === "completed") return "text-green-600";
    const dueDate = new Date(date);
    if (isPast(dueDate)) return "text-red-600";
    if (isToday(dueDate) || isTomorrow(dueDate)) return "text-accent-600";
    return "text-gray-600";
  };

  const priorityColors = {
    high: "error",
    medium: "warning", 
    low: "success"
  };

  return (
    <tr className="group hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onToggleStatus(assignment.Id)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
              assignment.status === "completed"
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-green-400"
            }`}
          >
            {assignment.status === "completed" && (
              <ApperIcon name="Check" className="h-3 w-3" />
            )}
          </button>
          <div>
            <div className="font-medium text-gray-900">{assignment.title}</div>
            {assignment.grade !== null && (
              <div className="text-sm text-gray-500">
                Grade: {assignment.grade}% ({assignment.weight}% weight)
              </div>
            )}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: course?.color || "#6366f1" }}
          />
          <span className="text-sm font-medium text-gray-900">
            {course?.code || "Unknown"}
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={`text-sm font-medium ${getDueDateColor(assignment.dueDate, assignment.status)}`}>
          {formatDueDate(assignment.dueDate)}
        </span>
      </td>

      <td className="px-6 py-4">
        <Badge variant={priorityColors[assignment.priority]}>
          {assignment.priority}
        </Badge>
      </td>

      <td className="px-6 py-4">
        <Badge variant={assignment.status === "completed" ? "success" : "warning"}>
          {assignment.status}
        </Badge>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(assignment)}
            className="h-8 w-8 p-0"
          >
            <ApperIcon name="Edit" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(assignment.Id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default AssignmentRow;