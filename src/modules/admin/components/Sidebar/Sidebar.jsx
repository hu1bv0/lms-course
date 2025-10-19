import { Link } from "react-router-dom";
import { ENDPOINTS } from "../../../../routes/endPoints";
import { 
  BookOpen, 
  Users, 
  CreditCard, 
  MessageCircle, 
  Calendar as CalendarIcon, 
  GraduationCap,
  Settings,
  LogOut,
  LayoutGrid
} from "lucide-react";
const menuItems = [
  { icon: LayoutGrid, label: "Bảng điều khiển", active: true },
  { icon: BookOpen, label: "Khóa học" },
  { icon: Users, label: "Học sinh" },
  { icon: CreditCard, label: "Giao dịch" },
  { icon: MessageCircle, label: "Chat" },
  { icon: CalendarIcon, label: "Lịch" },
  { icon: GraduationCap, label: "Lớp Học" },
  { icon: Settings, label: "Cài đặt" },
];

export default function Sidebar() {
  return (
    <div className="sticky flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-80 bg-blue-600 text-white flex flex-col shadow-xl rounded-xl">
        {/* Logo */}
        <div className="p-6 border-b border-blue-500">
          <div className="flex items-center justify-center space-x-3">
            {/* Logo Icon */}
            <h1 className="text-4xl font-bold">Learnly</h1>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    item.active 
                      ? "bg-blue-700 text-white" 
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-lg font-semibold">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout */}
        <div className="p-4 border-t border-blue-500">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-blue-100 hover:bg-blue-700 hover:text-white rounded-lg transition-colors">
            <Link to={ENDPOINTS.INDEX} >
            <LogOut className="w-5 h-5" />
            <span className="text-lg font-semibold">Đăng xuất</span>
            </Link>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      {/* <div className="flex-1 flex flex-col">
        {children}
      </div> */}
    </div>
  );

};