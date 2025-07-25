import React from "react";
import CourseCard from "@/components/molecules/CourseCard";
import Empty from "@/components/ui/Empty";

const CourseGrid = ({ courses, onEdit, onDelete, onAdd }) => {
  if (courses.length === 0) {
    return (
      <Empty
        title="No courses yet"
        description="Start by adding your first course to begin tracking your academic progress"
        icon="BookOpen"
        actionLabel="Add Course"
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.Id}
          course={course}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CourseGrid;