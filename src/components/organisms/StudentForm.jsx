import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const StudentForm = ({ student, courses, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    courseId: "",
    grade: "",
    tags: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        studentId: student.studentId || "",
        courseId: student.courseId || "",
        grade: student.grade || "",
        tags: student.tags || ""
      });
    }
  }, [student]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Student name is required";
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    }

    if (formData.grade && (isNaN(formData.grade) || formData.grade < 0 || formData.grade > 100)) {
      newErrors.grade = "Grade must be a number between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const studentData = {
        ...formData,
        courseId: formData.courseId || null,
        grade: formData.grade ? parseFloat(formData.grade) : null
      };
      
      await onSave(studentData);
    } catch (error) {
      console.error("Error saving student:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="User" className="h-5 w-5 mr-2 text-primary-600" />
          {student ? "Edit Student" : "Add New Student"}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Student Name"
              error={errors.name}
              required
            >
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter student name"
                className={errors.name ? "border-red-500" : ""}
              />
            </FormField>

            <FormField
              label="Student ID"
              error={errors.studentId}
              required
            >
              <Input
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Enter student ID"
                className={errors.studentId ? "border-red-500" : ""}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Course"
              error={errors.courseId}
            >
              <Select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className={errors.courseId ? "border-red-500" : ""}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.Id} value={course.Id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Grade (%)"
              error={errors.grade}
            >
              <Input
                name="grade"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.grade}
                onChange={handleChange}
                placeholder="Enter grade (0-100)"
                className={errors.grade ? "border-red-500" : ""}
              />
            </FormField>
          </div>

          <FormField
            label="Tags"
            error={errors.tags}
          >
            <Input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags (comma separated)"
              className={errors.tags ? "border-red-500" : ""}
            />
          </FormField>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </div>
              ) : (
                <>
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  {student ? "Update Student" : "Add Student"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;