import React, { useState, useEffect } from "react";
import StudentTable from "@/components/organisms/StudentTable";
import StudentForm from "@/components/organisms/StudentForm";
import Loading from "@/components/ui/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
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
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
    setShowDetails(false);
    setSelectedStudent(null);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetails(true);
    setShowForm(false);
  };

  const handleEditFromDetails = () => {
    setEditingStudent(selectedStudent);
    setShowForm(true);
    setShowDetails(false);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

// Student Details View
  if (showDetails && selectedStudent) {
    const studentCourse = courses.find(c => c.Id === selectedStudent.courseId);
    
    return (
      <div>
        <div className="mb-6">
          <Button 
            onClick={() => {
              setShowDetails(false);
              setSelectedStudent(null);
            }}
            variant="outline"
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {selectedStudent.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display text-gradient">{selectedStudent.name}</h1>
                <p className="text-gray-600 mt-1">Student Details</p>
              </div>
            </div>
            
            <Button onClick={handleEditFromDetails} variant="primary" size="lg">
              <ApperIcon name="Edit" className="h-5 w-5 mr-2" />
              Edit Student
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="User" className="h-5 w-5 mr-2 text-primary-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Admission Number</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedStudent.studentId || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-sm text-gray-900">
                    {selectedStudent.dateOfBirth 
                      ? new Date(selectedStudent.dateOfBirth).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-sm text-gray-900">{selectedStudent.gender || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nationality</label>
                  <p className="text-sm text-gray-900">{selectedStudent.nationality || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="text-sm text-gray-900">{selectedStudent.category || 'N/A'}</p>
                </div>
                {selectedStudent.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm text-gray-900 whitespace-pre-line">{selectedStudent.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="BookOpen" className="h-5 w-5 mr-2 text-primary-600" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Course</label>
                  {studentCourse ? (
                    <div className="flex items-center mt-1">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: studentCourse.color }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{studentCourse.code}</p>
                        <p className="text-xs text-gray-500">{studentCourse.name}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900">No course assigned</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Section</label>
                  <p className="text-sm text-gray-900">{selectedStudent.section || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Grade</label>
                  <p className="text-sm text-gray-900">
                    {selectedStudent.grade !== null ? `${selectedStudent.grade}%` : 'No grade assigned'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Enrollment Date</label>
                  <p className="text-sm text-gray-900">
                    {selectedStudent.enrollmentDate 
                      ? new Date(selectedStudent.enrollmentDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'N/A'
                    }
                  </p>
                </div>
                {selectedStudent.tags && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tags</label>
                    <p className="text-sm text-gray-900">{selectedStudent.tags}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="Phone" className="h-5 w-5 mr-2 text-primary-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Parent/Guardian Name</label>
                  <p className="text-sm text-gray-900">{selectedStudent.parentGuardianName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Number</label>
                  <p className="text-sm text-gray-900">{selectedStudent.contactNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                  <p className="text-sm text-gray-900">{selectedStudent.emailAddress || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Student Form View
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

  // Main Students List View
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient">Students</h1>
          <p className="text-gray-600 mt-2">
            Manage student records and track academic performance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={loadData} 
            variant="outline" 
            size="lg"
            disabled={loading}
          >
            <ApperIcon 
              name={loading ? "Loader2" : "RotateCcw"} 
              className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`} 
            />
            Refresh
          </Button>
          
          <Button onClick={handleAddStudent} variant="primary" size="lg">
            <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <StudentTable
        students={students}
        courses={courses}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
        onAdd={handleAddStudent}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default Students;