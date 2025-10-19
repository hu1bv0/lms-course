// import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const calendarDays = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 31, 1, 2, 3, 4],
];

export default function CalendarWidget() {
  return (
    <div className="shadow-lg border-0 rounded-xl p-6 bg-white">
      <div className="pb-4">
        <h3 className="text-xl font-bold text-gray-900 text-center">Lịch</h3>
      </div>
      
      <div>
        <div className="bg-white rounded-lg p-4">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-6">
            <div size="icon" className="w-6 h-6 bg-gray-100 rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </div>
            
            <h4 className="text-sm font-bold text-gray-900">July 2025</h4>
            
            <div size="icon" className="w-6 h-6 bg-gray-100 rounded-full">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-gray-500 font-medium p-1"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="space-y-1">
            {calendarDays.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => {
                  const isToday = weekIndex === 2 && dayIndex === 5; // 20th
                  const isOtherMonth = (weekIndex === 4 && dayIndex > 2);
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`
                        text-center p-2 text-sm relative
                        ${isToday 
                          ? "text-white" 
                          : isOtherMonth 
                            ? "text-gray-400" 
                            : "text-gray-900"
                        }
                      `}
                    >
                      {isToday && (
                        <div className="absolute inset-0 w-8 h-8 mx-auto rounded-full bg-gradient-to-b from-purple-500 via-gray-300 to-blue-600"></div>
                      )}
                      <span className="relative z-10 font-medium">{day}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
