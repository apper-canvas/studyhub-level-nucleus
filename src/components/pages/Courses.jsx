import React, { useState, useEffect } from "react";
import CourseGrid from "@/components/organisms/CourseGrid";
import CourseForm from "@/components/organisms/CourseForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses. Please try again.");
      console.error("Courses loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSaveCourse = async (courseData) => {
    try {
      if (editingCourse) {
        const updatedCourse = await courseService.update(editingCourse.Id, courseData);
        setCourses(prev => prev.map(c => c.Id === editingCourse.Id ? updatedCourse : c));
        toast.success("Course updated successfully!");
      } else {
        const newCourse = await courseService.create(courseData);
        setCourses(prev => [...prev, newCourse]);
        toast.success("Course added successfully!");
      }
      
      setShowForm(false);
      setEditingCourse(null);
    } catch (err) {
      toast.error("Failed to save course. Please try again.");
      console.error("Course save error:", err);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    try {
      await courseService.delete(courseId);
      setCourses(prev => prev.filter(c => c.Id !== courseId));
      toast.success("Course deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete course. Please try again.");
      console.error("Course delete error:", err);
    }
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  if (showForm) {
    return (
      <div>
        <div className="mb-6">
          <Button 
            onClick={handleCancelForm}
            variant="outline"
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
        
        <CourseForm
          course={editingCourse}
          onSave={handleSaveCourse}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient">Courses</h1>
          <p className="text-gray-600 mt-2">
            Manage your academic courses and track progress
          </p>
        </div>
        
        <Button onClick={handleAddCourse} variant="primary" size="lg">
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          Add Course
        </Button>
      </div>

      <CourseGrid
        courses={courses}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
        onAdd={handleAddCourse}
      />
    </div>
  );
};

export default Courses;