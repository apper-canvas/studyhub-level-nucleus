import React from "react";
import StatsCard from "@/components/molecules/StatsCard";

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Current GPA"
        value={stats.gpa.toFixed(2)}
        icon="Award"
        color="primary"
        trend={stats.gpaChange}
      />
      
      <StatsCard
        title="Active Courses"
        value={stats.activeCourses}
        icon="BookOpen"
        color="secondary"
      />
      
      <StatsCard
        title="Pending Assignments"
        value={stats.pendingAssignments}
        icon="FileText"
        color="accent"
      />
      
      <StatsCard
        title="Upcoming Deadlines"
        value={stats.upcomingDeadlines}
        icon="Clock"
        color="warning"
      />
    </div>
  );
};

export default DashboardStats;