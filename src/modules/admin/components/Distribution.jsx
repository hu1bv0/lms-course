// import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

const locations = [
  { name: "Hồ Chí Minh", percentage: "50%", color: "bg-purple-500" },
  { name: "Mỹ Tho", percentage: "23%", color: "bg-green-700" },
  { name: "Vũng Tàu", percentage: "15%", color: "bg-red-600" },
  { name: "Hà Giang", percentage: "80%", color: "bg-yellow-500" },
  { name: "Seoul", percentage: "90%", color: "bg-cyan-400" },
];

export default function Distribution() {
  return (
    <div className="shadow-lg border-0 rounded-xl p-6 bg-white">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Phân bổ</h3>
          <button className="text-gray-600 hover:text-gray-900">
            <MoreHorizontal className="w-5 h-5 rotate-90" />
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* World Map Representation */}
        <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Simplified world map using SVG paths */}
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Continents as simplified shapes */}
            {/* North America */}
            <path
              d="M50 60 L120 60 L140 80 L130 120 L80 110 L60 90 Z"
              fill="#374151"
            />
            
            {/* South America */}
            <path
              d="M90 130 L110 130 L115 180 L95 190 L85 160 Z"
              fill="#374151"
            />
            
            {/* Europe */}
            <path
              d="M160 50 L190 50 L195 80 L185 90 L155 85 Z"
              fill="#374151"
            />
            
            {/* Africa */}
            <path
              d="M160 90 L190 90 L195 150 L175 160 L155 140 Z"
              fill="#374151"
            />
            
            {/* Asia */}
            <path
              d="M200 40 L320 40 L340 60 L350 100 L320 120 L280 100 L250 80 L200 70 Z"
              fill="#374151"
            />
            
            {/* Australia */}
            <path
              d="M280 140 L320 140 L325 160 L310 165 L285 155 Z"
              fill="#374151"
            />
            
            {/* Location markers */}
            <circle cx="280" cy="80" r="4" fill="#ef4444" />
            <circle cx="120" cy="100" r="4" fill="#10b981" />
            <circle cx="180" cy="70" r="4" fill="#8b5cf6" />
          </svg>
        </div>
        
        {/* Location Legend */}
        <div className="space-y-2">
          {locations.map((location, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${location.color}`}></div>
              <span className="text-xs font-bold text-gray-900">
                {location.name} {location.percentage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
