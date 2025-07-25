import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CourseForm = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    credits: "",
    professor: "",
    color: "#6366f1",
    schedule: [{ day: "", time: "" }]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || "",
        code: course.code || "",
        credits: course.credits?.toString() || "",
        professor: course.professor || "",
        color: course.color || "#6366f1",
        schedule: course.schedule || [{ day: "", time: "" }]
      });
    }
  }, [course]);

  const courseColors = [
    "#6366f1", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444",
    "#3b82f6", "#f97316", "#84cc16", "#ec4899", "#14b8a6"
  ];

  const dayOptions = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const addScheduleSlot = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { day: "", time: "" }]
    }));
  };

  const removeScheduleSlot = (index) => {
    if (formData.schedule.length > 1) {
      const newSchedule = formData.schedule.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, schedule: newSchedule }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Course name is required";
    if (!formData.code.trim()) newErrors.code = "Course code is required";
    if (!formData.credits) newErrors.credits = "Credits are required";
    if (isNaN(formData.credits) || formData.credits <= 0) {
      newErrors.credits = "Credits must be a positive number";
    }
    if (!formData.professor.trim()) newErrors.professor = "Professor name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    const courseData = {
      ...formData,
      credits: parseInt(formData.credits),
      schedule: formData.schedule.filter(s => s.day && s.time),
      currentGrade: course?.currentGrade || 0,
      progress: course?.progress || 0,
      nextAssignment: course?.nextAssignment || null
    };

    onSave(courseData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="BookOpen" className="h-5 w-5 mr-2 text-primary-600" />
          {course ? "Edit Course" : "Add New Course"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Course Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              placeholder="e.g., Introduction to Computer Science"
              required
            />

            <FormField
              label="Course Code"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              error={errors.code}
              placeholder="e.g., CS 101"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Credits"
              type="number"
              value={formData.credits}
              onChange={(e) => handleInputChange("credits", e.target.value)}
              error={errors.credits}
              placeholder="3"
              min="1"
              max="6"
              required
            />

            <FormField
              label="Professor"
              value={formData.professor}
              onChange={(e) => handleInputChange("professor", e.target.value)}
              error={errors.professor}
              placeholder="Dr. Smith"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Course Color
            </label>
            <div className="flex flex-wrap gap-3">
              {courseColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange("color", color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    formData.color === color 
                      ? "border-gray-800 scale-110" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Class Schedule
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addScheduleSlot}
              >
                <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
                Add Time
              </Button>
            </div>

            <div className="space-y-3">
              {formData.schedule.map((slot, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <FormField
                      type="select"
                      value={slot.day}
                      onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
                      options={dayOptions}
                      placeholder="Select day"
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      type="time"
                      value={slot.time}
                      onChange={(e) => handleScheduleChange(index, "time", e.target.value)}
                    />
                  </div>
                  {formData.schedule.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeScheduleSlot(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <ApperIcon name="Save" className="h-4 w-4 mr-2" />
              {course ? "Update Course" : "Add Course"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseForm;