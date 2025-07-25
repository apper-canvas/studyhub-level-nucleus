import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const StudentTable = ({ students, courses, onEdit, onDelete, onAdd }) => {
  const [filter, setFilter] = useState({ course: "", search: "" });
  const [sortBy, setSortBy] = useState({ field: "name", direction: "asc" });

  const filteredStudents = students
    .filter(student => {
      if (filter.course && student.courseId !== parseInt(filter.course)) return false;
      if (filter.search && !student.name.toLowerCase().includes(filter.search.toLowerCase()) && 
          !student.studentId.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const direction = sortBy.direction === "asc" ? 1 : -1;
      
      if (sortBy.field === "name") {
        return direction * a.name.localeCompare(b.name);
      }
      
      if (sortBy.field === "studentId") {
        return direction * a.studentId.localeCompare(b.studentId);
      }
      
      if (sortBy.field === "grade") {
        const gradeA = a.grade || 0;
        const gradeB = b.grade || 0;
        return direction * (gradeA - gradeB);
      }
      
      return 0;
    });

  const handleSort = (field) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const getGradeColor = (grade) => {
    if (!grade) return "gray";
    if (grade >= 90) return "green";
    if (grade >= 80) return "blue";
    if (grade >= 70) return "yellow";
    return "red";
  };

  const getGradeLetter = (grade) => {
    if (!grade) return "N/A";
    if (grade >= 97) return "A+";
    if (grade >= 93) return "A";
    if (grade >= 90) return "A-";
    if (grade >= 87) return "B+";
    if (grade >= 83) return "B";
    if (grade >= 80) return "B-";
    if (grade >= 77) return "C+";
    if (grade >= 73) return "C";
    if (grade >= 70) return "C-";
    if (grade >= 67) return "D+";
    if (grade >= 65) return "D";
    return "F";
  };

  if (students.length === 0) {
    return (
      <Empty
        title="No students yet"
        description="Add your first student to start tracking academic records and performance"
        icon="User"
        actionLabel="Add Student"
        onAction={onAdd}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center">
            <ApperIcon name="Users" className="h-5 w-5 mr-2 text-primary-600" />
            Students
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search students..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-full sm:w-64"
            />
            
            <Select
              value={filter.course}
              onChange={(e) => setFilter(prev => ({ ...prev, course: e.target.value }))}
              className="w-full sm:w-40"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.Id} value={course.Id}>
                  {course.code}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("name")}
                    className="font-medium text-gray-900 p-0 h-auto hover:bg-transparent"
                  >
                    Name
                    <ApperIcon 
                      name={sortBy.field === "name" && sortBy.direction === "desc" ? "ChevronDown" : "ChevronUp"} 
                      className="ml-1 h-4 w-4" 
                    />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("studentId")}
                    className="font-medium text-gray-900 p-0 h-auto hover:bg-transparent"
                  >
                    Student ID
                    <ApperIcon 
                      name={sortBy.field === "studentId" && sortBy.direction === "desc" ? "ChevronDown" : "ChevronUp"} 
                      className="ml-1 h-4 w-4" 
                    />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Course</th>
                <th className="px-6 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("grade")}
                    className="font-medium text-gray-900 p-0 h-auto hover:bg-transparent"
                  >
                    Grade
                    <ApperIcon 
                      name={sortBy.field === "grade" && sortBy.direction === "desc" ? "ChevronDown" : "ChevronUp"} 
                      className="ml-1 h-4 w-4" 
                    />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => {
                const course = courses.find(c => c.Id === student.courseId);
                
                return (
                  <tr key={student.Id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                          {student.tags && (
                            <div className="text-xs text-gray-500 mt-1">
                              {student.tags}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-mono">
                        {student.studentId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {course ? (
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: course.color }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {course.code}
                            </div>
                            <div className="text-xs text-gray-500">
                              {course.name}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No course assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student.grade !== null ? (
                        <div className="flex items-center space-x-2">
                          <Badge color={getGradeColor(student.grade)}>
                            {getGradeLetter(student.grade)}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {student.grade}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No grade</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Button
                          onClick={() => onEdit(student)}
                          variant="ghost"
                          size="sm"
                          className="text-primary-600 hover:text-primary-800"
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          onClick={() => onDelete(student.Id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                        >
                          <ApperIcon name="Trash" className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="p-12 text-center">
            <ApperIcon name="Search" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentTable;