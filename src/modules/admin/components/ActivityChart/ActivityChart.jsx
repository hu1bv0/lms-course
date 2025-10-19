// import { Button, Card, CardContent, CardHeader } from "@/mui/material";
import { Calendar, MoreHorizontal } from "lucide-react";

export default function ActivityChart() {
  // Sample data points for the chart
  const dataPoints1 = [
    { x: 5, y: 75 },
    { x: 20, y: 75 },
    { x: 35, y: 45 },
    { x: 50, y: 15 },
    { x: 65, y: 35 },
    { x: 80, y: 55 },
  ];
  
  const dataPoints2 = [
    { x: 5, y: 25 },
    { x: 20, y: 85 },
    { x: 35, y: 15 },
    { x: 50, y: 45 },
    { x: 65, y: 65 },
    { x: 80, y: 95 },
  ];

  return (
    <div className="shadow-lg border-0 rounded-xl p-6 bg-white">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Hoạt động</h3>
          <div className="flex items-center space-x-2">
            {/* Date Selector */}
            <div size="sm" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-bold">May 2025</span>
            </div>
            
            {/* More Options */}
            <div size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        {/* Chart Area */}
        <div className="relative h-64 bg-white">
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {/* Horizontal lines */}
            {[0, 20, 40, 60, 80, 100].map((y) => (
              <div
                key={y}
                className="absolute w-full border-t border-gray-100"
                style={{ top: `${y}%` }}
              />
            ))}
            
            {/* Vertical lines */}
            {[0, 16.67, 33.33, 50, 66.67, 83.33, 100].map((x) => (
              <div
                key={x}
                className="absolute h-full border-l border-gray-100"
                style={{ left: `${x}%` }}
              />
            ))}
          </div>
          
          {/* Chart Lines */}
          <svg className="absolute inset-0 w-full h-full">
            {/* Line 1 - Purple */}
            <polyline
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
              points={dataPoints1.map(p => `${p.x},${p.y}`).join(' ')}
            />
            
            {/* Line 2 - Pink */}
            <polyline
              fill="none"
              stroke="#EC4899"
              strokeWidth="2"
              points={dataPoints2.map(p => `${p.x},${p.y}`).join(' ')}
            />
            
            {/* Data Points */}
            {dataPoints1.map((point, index) => (
              <circle
                key={`point1-${index}`}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="white"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
            ))}
            
            {dataPoints2.map((point, index) => (
              <circle
                key={`point2-${index}`}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="white"
                stroke="#EC4899"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
        
        {/* X-axis Labels */}
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <span>01</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
          <span>25</span>
          <span>30</span>
        </div>
      </div>
    </div>
  );
}
