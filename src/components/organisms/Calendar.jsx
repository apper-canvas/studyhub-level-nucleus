import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import CalendarEvent from "@/components/molecules/CalendarEvent";
import ApperIcon from "@/components/ApperIcon";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from "date-fns";

const Calendar = ({ events = [], onEventEdit, onEventDelete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month or week

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const dayEvents = events.filter(event => 
        isSameDay(new Date(event.date), cloneDay)
      );

      days.push(
        <div
          key={day}
          className={`min-h-[120px] border border-gray-200 p-2 ${
            !isSameMonth(day, monthStart) 
              ? "bg-gray-50 text-gray-400" 
              : "bg-white hover:bg-gray-50"
          } ${isToday(day) ? "bg-primary-50 border-primary-200" : ""}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              isToday(day) ? "text-primary-600" : ""
            }`}>
              {format(day, dateFormat)}
            </span>
            {isToday(day) && (
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            )}
          </div>
          
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event, index) => (
              <div
                key={index}
                className={`text-xs p-1 rounded truncate ${
                  event.type === "assignment" ? "bg-primary-100 text-primary-700" :
                  event.type === "exam" ? "bg-red-100 text-red-700" :
                  "bg-secondary-100 text-secondary-700"
                }`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const todayEvents = events.filter(event => 
    isSameDay(new Date(event.date), new Date())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <ApperIcon name="Calendar" className="h-5 w-5 mr-2 text-primary-600" />
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevMonth}
                  >
                    <ApperIcon name="ChevronLeft" className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextMonth}
                  >
                    <ApperIcon name="ChevronRight" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              {rows}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today&apos;s Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {todayEvents.length > 0 ? (
                <div className="space-y-3">
                  {todayEvents.map((event, index) => (
                    <CalendarEvent
                      key={index}
                      event={event}
                      onEdit={onEventEdit}
                      onDelete={onEventDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Calendar" className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No events today</p>
                  <p className="text-sm text-gray-500">Enjoy your free time!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events
                  .filter(event => new Date(event.date) > new Date())
                  .slice(0, 5)
                  .map((event, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className={`w-3 h-3 rounded-full ${
                        event.type === "assignment" ? "bg-primary-500" :
                        event.type === "exam" ? "bg-red-500" :
                        "bg-secondary-500"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {format(new Date(event.date), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;