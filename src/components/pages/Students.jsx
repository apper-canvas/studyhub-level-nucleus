import React, { useState, useEffect } from "react";
import StudentTable from "@/components/organisms/StudentTable";
import StudentForm from "@/components/organisms/StudentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, coursesData] = await Promise.all([
        studentService.getAll(),
        courseService.getAll()
      ]);
      
      setStudents(studentsData);
      setCourses(coursesData);
    } catch (err) {
      setError("Failed to load students. Please try again.");
      console.error("Students loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveStudent = async (studentData) => {
    try {
      if (editingStudent) {
        const updatedStudent = await studentService.update(editingStudent.Id, studentData);
        setStudents(prev => prev.map(s => s.Id === editingStudent.Id ? updatedStudent : s));
        toast.success("Student updated successfully!");
      } else {
        const newStudent = await studentService.create(studentData);
        setStudents(prev => [...prev, newStudent]);
        toast.success("Student added successfully!");
      }
      
      setShowForm(false);
      setEditingStudent(null);
    } catch (err) {
      toast.error("Failed to save student. Please try again.");
      console.error("Student save error:", err);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await studentService.delete(studentId);
      setStudents(prev => prev.filter(s => s.Id !== studentId));
      toast.success("Student deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete student. Please try again.");
      console.error("Student delete error:", err);
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

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
            Back to Students
          </Button>
        </div>
        
        <StudentForm
          student={editingStudent}
          courses={courses}
          onSave={handleSaveStudent}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient">Students</h1>
          <p className="text-gray-600 mt-2">
            Manage student records and track academic performance
          </p>
        </div>
        
        <Button onClick={handleAddStudent} variant="primary" size="lg">
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          Add Student
        </Button>
      </div>

      <StudentTable
        students={students}
        courses={courses}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
        onAdd={handleAddStudent}
      />
    </div>
  );
};

export default Students;