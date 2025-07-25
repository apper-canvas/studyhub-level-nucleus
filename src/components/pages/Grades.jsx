import React, { useState, useEffect } from "react";
import GradesList from "@/components/organisms/GradesList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import StatsCard from "@/components/molecules/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError("Failed to load grades data. Please try again.");
      console.error("Grades loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate overall statistics
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const weightedGradeSum = courses.reduce((sum, course) => 
    sum + (course.currentGrade * course.credits), 0
  );
  const overallGPA = totalCredits > 0 ? (weightedGradeSum / totalCredits / 100) * 4.0 : 0;
  
  const gradedAssignments = assignments.filter(a => a.grade !== null);
  const averageAssignmentGrade = gradedAssignments.length > 0 
    ? gradedAssignments.reduce((sum, a) => sum + a.grade, 0) / gradedAssignments.length 
    : 0;

  const completedAssignments = assignments.filter(a => a.status === "completed").length;
  const completionRate = assignments.length > 0 
    ? (completedAssignments / assignments.length) * 100 
    : 0;

  // Grade distribution
  const gradeDistribution = courses.reduce((acc, course) => {
    const letterGrade = getLetterGrade(course.currentGrade);
    acc[letterGrade] = (acc[letterGrade] || 0) + 1;
    return acc;
  }, {});

  function getLetterGrade(percentage) {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 65) return "D";
    return "F";
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient">Grades Overview</h1>
          <p className="text-gray-600 mt-2">
            Track your academic performance across all courses
          </p>
        </div>
      </div>

      {/* Grade Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Overall GPA"
          value={overallGPA.toFixed(2)}
          icon="Award"
          color="primary"
        />
        
        <StatsCard
          title="Average Grade"
          value={`${averageAssignmentGrade.toFixed(1)}%`}
          icon="TrendingUp"
          color="success"
        />
        
        <StatsCard
          title="Completion Rate"
          value={`${completionRate.toFixed(0)}%`}
          icon="CheckCircle"
          color="secondary"
        />
        
        <StatsCard
          title="Total Credits"
          value={totalCredits}
          icon="BookOpen"
          color="accent"
        />
      </div>

      {/* Grade Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="PieChart" className="h-5 w-5 mr-2 text-primary-600" />
            Grade Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="text-center">
                <div className="text-2xl font-bold font-display text-gradient mb-1">
                  {count}
                </div>
                <div className="text-sm text-gray-600">Grade {grade}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Grades */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-display text-gray-900">
            Course Grades
          </h2>
        </div>
        
        <GradesList courses={courses} assignments={assignments} />
      </div>
    </div>
  );
};

export default Grades;