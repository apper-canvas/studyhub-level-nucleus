import React, { useState, useEffect } from "react";
import DashboardStats from "@/components/organisms/DashboardStats";
import CourseGrid from "@/components/organisms/CourseGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { useNavigate } from "react-router-dom";
import { format, isAfter, isBefore, addDays } from "date-fns";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);
      
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate dashboard statistics
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const weightedGradeSum = courses.reduce((sum, course) => 
    sum + (course.currentGrade * course.credits), 0
  );
  const gpa = totalCredits > 0 ? (weightedGradeSum / totalCredits / 100) * 4.0 : 0;
  
  const pendingAssignments = assignments.filter(a => a.status === "pending").length;
  const upcomingDeadlines = assignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    const weekFromNow = addDays(new Date(), 7);
    return a.status === "pending" && isAfter(dueDate, new Date()) && isBefore(dueDate, weekFromNow);
  }).length;

  const stats = {
    gpa,
    gpaChange: 2.1, // Mock trend data
    activeCourses: courses.length,
    pendingAssignments,
    upcomingDeadlines
  };

  // Get recent assignments
  const recentAssignments = assignments
    .filter(a => a.status === "pending")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 rounded-xl p-6 border border-primary-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display text-gradient mb-2">
              Welcome to StudyHub
            </h1>
            <p className="text-gray-600 text-lg">
              Track your academic progress and stay organized
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button onClick={() => navigate("/courses")} variant="primary">
              <ApperIcon name="BookOpen" className="h-4 w-4 mr-2" />
              Manage Courses
            </Button>
            <Button onClick={() => navigate("/assignments")} variant="secondary">
              <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
              View Assignments
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <DashboardStats stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Courses */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display text-gray-900">
              Active Courses
            </h2>
            <Button 
              onClick={() => navigate("/courses")}
              variant="outline"
              size="sm"
            >
              View All
              <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <CourseGrid 
            courses={courses.slice(0, 6)} 
            onEdit={() => navigate("/courses")}
            onDelete={() => navigate("/courses")}
            onAdd={() => navigate("/courses")}
          />
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Upcoming Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="Clock" className="h-5 w-5 mr-2 text-accent-600" />
                Upcoming Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAssignments.length > 0 ? (
                <div className="space-y-4">
                  {recentAssignments.map((assignment) => {
                    const course = courses.find(c => c.Id === assignment.courseId);
                    const dueDate = new Date(assignment.dueDate);
                    const isUrgent = isBefore(dueDate, addDays(new Date(), 2));
                    
                    return (
                      <div 
                        key={assignment.Id} 
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div 
                          className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                          style={{ background: course?.color || "#6366f1" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {assignment.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {course?.code || "Unknown Course"}
                          </p>
                          <p className={`text-xs font-medium ${
                            isUrgent ? "text-red-600" : "text-gray-600"
                          }`}>
                            Due {format(dueDate, "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <Button 
                    onClick={() => navigate("/assignments")}
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    View All Assignments
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="CheckCircle" className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">All caught up!</p>
                  <p className="text-sm text-gray-500">No pending assignments</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="Zap" className="h-5 w-5 mr-2 text-primary-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate("/courses")}
                variant="outline" 
                className="w-full justify-start"
              >
                <ApperIcon name="Plus" className="h-4 w-4 mr-3" />
                Add New Course
              </Button>
              <Button 
                onClick={() => navigate("/assignments")}
                variant="outline" 
                className="w-full justify-start"
              >
                <ApperIcon name="FileText" className="h-4 w-4 mr-3" />
                Create Assignment
              </Button>
              <Button 
                onClick={() => navigate("/grades")}
                variant="outline" 
                className="w-full justify-start"
              >
                <ApperIcon name="BarChart3" className="h-4 w-4 mr-3" />
                View Grades
              </Button>
              <Button 
                onClick={() => navigate("/calendar")}
                variant="outline" 
                className="w-full justify-start"
              >
                <ApperIcon name="Calendar" className="h-4 w-4 mr-3" />
                Open Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;