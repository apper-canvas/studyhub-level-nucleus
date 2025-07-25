import React, { useState, useEffect } from "react";
import Calendar from "@/components/organisms/Calendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      
      // Convert assignments to calendar events
      const assignmentEvents = assignmentsData.map(assignment => {
        const course = coursesData.find(c => c.Id === assignment.courseId);
        return {
          id: assignment.Id,
          title: assignment.title,
          date: assignment.dueDate,
          type: assignment.category === "exam" ? "exam" : "assignment",
          courseName: course ? `${course.code} - ${course.name}` : "Unknown Course",
          courseId: assignment.courseId,
          priority: assignment.priority,
          status: assignment.status
        };
      });

      // Add class schedule events
      const classEvents = [];
      coursesData.forEach(course => {
        course.schedule.forEach(scheduleItem => {
          // Generate recurring class events for the current month
          const today = new Date();
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          
          for (let date = startOfMonth; date <= endOfMonth; date.setDate(date.getDate() + 1)) {
            const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
            if (dayName === scheduleItem.day) {
              const [hours, minutes] = scheduleItem.time.split(":");
              const eventDate = new Date(date);
              eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
              
              classEvents.push({
                id: `class-${course.Id}-${date.getTime()}`,
                title: `${course.code} Class`,
                date: eventDate.toISOString(),
                type: "class",
                courseName: course.name,
                courseId: course.Id
              });
            }
          }
        });
      });

      setEvents([...assignmentEvents, ...classEvents]);
    } catch (err) {
      setError("Failed to load calendar data. Please try again.");
      console.error("Calendar loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-gradient">Academic Calendar</h1>
        <p className="text-gray-600 mt-2">
          View your class schedule, assignments, and important dates
        </p>
      </div>

      <Calendar 
        events={events}
        onEventEdit={() => {}} // Could navigate to edit forms
        onEventDelete={() => {}} // Could handle event deletion
      />
    </div>
  );
};

export default CalendarPage;