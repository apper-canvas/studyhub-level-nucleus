import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import AssignmentRow from "@/components/molecules/AssignmentRow";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const AssignmentTable = ({ assignments, courses, onEdit, onDelete, onToggleStatus, onAdd }) => {
  const [filter, setFilter] = useState({ course: "", status: "", search: "" });
  const [sortBy, setSortBy] = useState({ field: "dueDate", direction: "asc" });

  const filteredAssignments = assignments
    .filter(assignment => {
      if (filter.course && assignment.courseId !== filter.course) return false;
      if (filter.status && assignment.status !== filter.status) return false;
      if (filter.search && !assignment.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const direction = sortBy.direction === "asc" ? 1 : -1;
      
      if (sortBy.field === "dueDate") {
        return direction * (new Date(a.dueDate) - new Date(b.dueDate));
      }
      
      if (sortBy.field === "title") {
        return direction * a.title.localeCompare(b.title);
      }
      
      if (sortBy.field === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return direction * (priorityOrder[a.priority] - priorityOrder[b.priority]);
      }
      
      return 0;
    });

  const handleSort = (field) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  if (assignments.length === 0) {
    return (
      <Empty
        title="No assignments yet"
        description="Add your first assignment to start tracking your coursework and deadlines"
        icon="FileText"
        actionLabel="Add Assignment"
        onAction={onAdd}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center">
            <ApperIcon name="FileText" className="h-5 w-5 mr-2 text-primary-600" />
            Assignments
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search assignments..."
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
            
            <Select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="w-full sm:w-32"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
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
                    onClick={() => handleSort("title")}
                    className="font-medium text-gray-900 p-0 h-auto hover:bg-transparent"
                  >
                    Assignment
                    <ApperIcon 
                      name={sortBy.field === "title" && sortBy.direction === "desc" ? "ChevronDown" : "ChevronUp"} 
                      className="ml-1 h-4 w-4" 
                    />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Course</th>
                <th className="px-6 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("dueDate")}
                    className="font-medium text-gray-900 p-0 h-auto hover:bg-transparent"
                  >
                    Due Date
                    <ApperIcon 
                      name={sortBy.field === "dueDate" && sortBy.direction === "desc" ? "ChevronDown" : "ChevronUp"} 
                      className="ml-1 h-4 w-4" 
                    />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("priority")}
                    className="font-medium text-gray-900 p-0 h-auto hover:bg-transparent"
                  >
                    Priority
                    <ApperIcon 
                      name={sortBy.field === "priority" && sortBy.direction === "desc" ? "ChevronDown" : "ChevronUp"} 
                      className="ml-1 h-4 w-4" 
                    />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => (
                <AssignmentRow
                  key={assignment.Id}
                  assignment={assignment}
                  course={courses.find(c => c.Id === assignment.courseId)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAssignments.length === 0 && (
          <div className="p-12 text-center">
            <ApperIcon name="Search" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentTable;