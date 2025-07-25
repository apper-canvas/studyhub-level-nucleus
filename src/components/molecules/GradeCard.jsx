import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import ApperIcon from "@/components/ApperIcon";

const GradeCard = ({ course, assignments = [] }) => {
  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 65) return "D";
    return "F";
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "primary";
    if (percentage >= 70) return "warning";
    return "error";
  };

  const courseAssignments = assignments.filter(a => a.courseId === course.Id);
  const gradedAssignments = courseAssignments.filter(a => a.grade !== null);
  
  const categoryBreakdown = gradedAssignments.reduce((acc, assignment) => {
    if (!acc[assignment.category]) {
      acc[assignment.category] = { total: 0, earned: 0, count: 0 };
    }
    acc[assignment.category].total += assignment.weight;
    acc[assignment.category].earned += (assignment.grade * assignment.weight) / 100;
    acc[assignment.category].count += 1;
    return acc;
  }, {});

  return (
    <Card className="overflow-hidden">
      <div 
        className="h-1 w-full bg-gradient-to-r"
        style={{ background: course.color }}
      />
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ background: course.color }}
            />
            <div>
              <CardTitle className="text-lg">{course.name}</CardTitle>
              <p className="text-sm text-gray-600">{course.code} • {course.credits} Credits</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold font-display text-gradient">
              {getLetterGrade(course.currentGrade)}
            </div>
            <Badge variant={getGradeColor(course.currentGrade)} className="mt-1">
              {course.currentGrade}%
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{course.currentGrade}%</span>
          </div>
          <Progress value={course.currentGrade} variant={getGradeColor(course.currentGrade)} />
        </div>

        {Object.entries(categoryBreakdown).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center">
              <ApperIcon name="BarChart3" className="h-4 w-4 mr-2" />
              Grade Breakdown
            </h4>
            <div className="space-y-2">
              {Object.entries(categoryBreakdown).map(([category, data]) => {
                const percentage = data.total > 0 ? (data.earned / data.total) * 100 : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{category}</span>
                      <span className="font-medium">{Math.round(percentage)}%</span>
                    </div>
                    <Progress value={percentage} variant="secondary" className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Assignments</span>
              <p className="font-medium">{courseAssignments.length}</p>
            </div>
            <div>
              <span className="text-gray-600">Graded</span>
              <p className="font-medium">{gradedAssignments.length}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeCard;