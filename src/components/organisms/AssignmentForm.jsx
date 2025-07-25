import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { format } from "date-fns";

const AssignmentForm = ({ assignment, courses, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    dueDate: "",
    dueTime: "",
    priority: "medium",
    status: "pending",
    category: "assignment",
    weight: "",
    description: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (assignment) {
      const dueDate = new Date(assignment.dueDate);
      setFormData({
        title: assignment.title || "",
        courseId: assignment.courseId || "",
        dueDate: format(dueDate, "yyyy-MM-dd"),
        dueTime: format(dueDate, "HH:mm"),
        priority: assignment.priority || "medium",
        status: assignment.status || "pending",
        category: assignment.category || "assignment",
        weight: assignment.weight?.toString() || "",
        description: assignment.description || ""
      });
    }
  }, [assignment]);

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" }
  ];

  const categoryOptions = [
    { value: "assignment", label: "Assignment" },
    { value: "quiz", label: "Quiz" },
    { value: "exam", label: "Exam" },
    { value: "project", label: "Project" },
    { value: "homework", label: "Homework" }
  ];

  const courseOptions = courses.map(course => ({
    value: course.Id,
    label: `${course.code} - ${course.name}`
  }));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Assignment title is required";
    if (!formData.courseId) newErrors.courseId = "Please select a course";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (!formData.dueTime) newErrors.dueTime = "Due time is required";
    if (!formData.weight) newErrors.weight = "Weight percentage is required";
    if (isNaN(formData.weight) || formData.weight <= 0 || formData.weight > 100) {
      newErrors.weight = "Weight must be between 1 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);

    const assignmentData = {
      ...formData,
      dueDate: dueDateTime.toISOString(),
      weight: parseFloat(formData.weight),
      grade: assignment?.grade || null
    };

    onSave(assignmentData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="FileText" className="h-5 w-5 mr-2 text-primary-600" />
          {assignment ? "Edit Assignment" : "Add New Assignment"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Assignment Title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            error={errors.title}
            placeholder="e.g., Midterm Exam, Chapter 5 Homework"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Course"
              type="select"
              value={formData.courseId}
              onChange={(e) => handleInputChange("courseId", e.target.value)}
              options={courseOptions}
              error={errors.courseId}
              required
            />

            <FormField
              label="Category"
              type="select"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              options={categoryOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              error={errors.dueDate}
              required
            />

            <FormField
              label="Due Time"
              type="time"
              value={formData.dueTime}
              onChange={(e) => handleInputChange("dueTime", e.target.value)}
              error={errors.dueTime}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Priority"
              type="select"
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              options={priorityOptions}
            />

            <FormField
              label="Status"
              type="select"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              options={statusOptions}
            />

            <FormField
              label="Weight (%)"
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              error={errors.weight}
              placeholder="15"
              min="1"
              max="100"
              required
            />
          </div>

          <FormField
            label="Description (Optional)"
            type="textarea"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Additional notes about this assignment..."
          />

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <ApperIcon name="Save" className="h-4 w-4 mr-2" />
              {assignment ? "Update Assignment" : "Add Assignment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssignmentForm;