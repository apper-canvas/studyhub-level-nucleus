import React, { useState, useEffect } from "react";
import AssignmentTable from "@/components/organisms/AssignmentTable";
import AssignmentForm from "@/components/organisms/AssignmentForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError("Failed to load assignments. Please try again.");
      console.error("Assignments loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveAssignment = async (assignmentData) => {
    try {
      if (editingAssignment) {
        const updatedAssignment = await assignmentService.update(editingAssignment.Id, assignmentData);
        setAssignments(prev => prev.map(a => a.Id === editingAssignment.Id ? updatedAssignment : a));
        toast.success("Assignment updated successfully!");
      } else {
        const newAssignment = await assignmentService.create(assignmentData);
        setAssignments(prev => [...prev, newAssignment]);
        toast.success("Assignment added successfully!");
      }
      
      setShowForm(false);
      setEditingAssignment(null);
    } catch (err) {
      toast.error("Failed to save assignment. Please try again.");
      console.error("Assignment save error:", err);
    }
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm("Are you sure you want to delete this assignment?")) {
      return;
    }

    try {
      await assignmentService.delete(assignmentId);
      setAssignments(prev => prev.filter(a => a.Id !== assignmentId));
      toast.success("Assignment deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete assignment. Please try again.");
      console.error("Assignment delete error:", err);
    }
  };

  const handleToggleStatus = async (assignmentId) => {
    try {
      const assignment = assignments.find(a => a.Id === assignmentId);
      const newStatus = assignment.status === "completed" ? "pending" : "completed";
      
      const updatedAssignment = await assignmentService.update(assignmentId, {
        ...assignment,
        status: newStatus
      });
      
      setAssignments(prev => prev.map(a => a.Id === assignmentId ? updatedAssignment : a));
      toast.success(`Assignment marked as ${newStatus}!`);
    } catch (err) {
      toast.error("Failed to update assignment status.");
      console.error("Assignment status update error:", err);
    }
  };

  const handleAddAssignment = () => {
    if (courses.length === 0) {
      toast.warning("Please add at least one course before creating assignments.");
      return;
    }
    setEditingAssignment(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAssignment(null);
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
            Back to Assignments
          </Button>
        </div>
        
        <AssignmentForm
          assignment={editingAssignment}
          courses={courses}
          onSave={handleSaveAssignment}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient">Assignments</h1>
          <p className="text-gray-600 mt-2">
            Track your coursework and manage deadlines
          </p>
        </div>
        
        <Button onClick={handleAddAssignment} variant="primary" size="lg">
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          Add Assignment
        </Button>
      </div>

      <AssignmentTable
        assignments={assignments}
        courses={courses}
        onEdit={handleEditAssignment}
        onDelete={handleDeleteAssignment}
        onToggleStatus={handleToggleStatus}
        onAdd={handleAddAssignment}
      />
    </div>
  );
};

export default Assignments;