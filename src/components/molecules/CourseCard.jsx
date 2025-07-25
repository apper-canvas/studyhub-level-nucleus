import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const CourseCard = ({ course, onEdit, onDelete }) => {
  const gradeColor = course.currentGrade >= 90 ? "success" : 
                    course.currentGrade >= 80 ? "primary" : 
                    course.currentGrade >= 70 ? "warning" : "error";

  return (
    <Card className="group relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r"
        style={{ background: course.color }}
      />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ background: course.color }}
            />
            <div>
              <CardTitle className="text-lg">{course.name}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{course.code} • {course.credits} credits</p>
            </div>
          </div>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
            <button
              onClick={() => onEdit(course)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="Edit" className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(course.Id)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Grade</span>
          <Badge variant={gradeColor} className="font-semibold">
            {course.currentGrade}%
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{course.progress}%</span>
          </div>
          <Progress value={course.progress} variant="primary" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-600">
            <ApperIcon name="User" className="h-4 w-4" />
            <span>{course.professor}</span>
          </div>
          {course.nextAssignment && (
            <div className="flex items-center space-x-1 text-accent-600">
              <ApperIcon name="Clock" className="h-4 w-4" />
              <span>Due {format(new Date(course.nextAssignment), "MMM d")}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Schedule</span>
            <span className="font-medium">
              {course.schedule.map(s => `${s.day} ${s.time}`).join(", ")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;