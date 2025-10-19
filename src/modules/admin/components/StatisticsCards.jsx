// import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Video, DollarSign } from "lucide-react";

const stats = [
  {
    title: "22K",
    subtitle: "Tổng lượng người dùng",
    icon: Users,
    bgColor: "bg-purple-500",
  },
  {
    title: "1520", 
    subtitle: "Khóa học",
    icon: BookOpen,
    bgColor: "bg-green-600",
  },
  {
    title: "6000",
    subtitle: "Tổng video", 
    icon: Video,
    bgColor: "bg-red-400",
  },
  {
    title: "$70500",
    subtitle: "Thu nhập",
    icon: DollarSign,
    bgColor: "bg-purple-700",
  },
];

export default function StatisticsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="shadow-lg border-0 rounded-xl">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div className={`w-20 h-19 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-8 h-20 text-white" />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                  {stat.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {stat.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
