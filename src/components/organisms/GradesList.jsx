import React from "react";
import GradeCard from "@/components/molecules/GradeCard";
import Empty from "@/components/ui/Empty";

const GradesList = ({ courses, assignments }) => {
  if (courses.length === 0) {
    return (
      <Empty
        title="No courses to grade"
        description="Add courses and assignments to start tracking your academic performance"
        icon="BarChart3"
        actionLabel="Add Course"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <GradeCard
            key={course.Id}
            course={course}
            assignments={assignments}
          />
        ))}
      </div>
    </div>
  );
};

export default GradesList;