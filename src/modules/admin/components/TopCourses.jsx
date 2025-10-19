// import { Card, CardContent, CardHeader } from "@/components/ui/card";

const courses = [
  {
    id: 1,
    title: "Hình học không gian",
    price: "$2500",
    sales: "1247 Sale",
    color: "bg-yellow-400",
  },
  {
    id: 2,
    title: "Đại số", 
    price: "$1450",
    sales: "285 Sale",
    color: "bg-blue-600",
  },
  {
    id: 3,
    title: "Tiếng Anh",
    price: "$5240", 
    sales: "2269 Sale",
    color: "bg-red-400",
  },
];

export default function TopCourses() {
  return (
    <div className="shadow-lg border-0 rounded-xl p-6 bg-white">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Khóa học hàng đầu</h3>
          <button className="text-sm text-gray-400 hover:text-gray-600">
            Tất cả
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md border border-gray-100"
          >
            {/* Course Icon */}
            <div className={`w-12 h-11 ${course.color} rounded-xl flex-shrink-0`}>
              {course.id === 3 && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">E</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Course Info */}
            <div className="flex-1">
              <h4 className="text-base font-bold text-gray-900">
                {course.title}
              </h4>
            </div>
            
            {/* Price and Sales */}
            <div className="text-right">
              <div className="text-base font-bold text-purple-600">
                {course.price}
              </div>
              <div className="text-xs text-gray-500">
                {course.sales}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
