import {
  ArrowLeft,
  Bell,
  GraduationCap,
  Users,
  LogOut,
  Settings,
  HelpCircle,
  BookOpen,
  BarChart3,
  User,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuItems = [
    { icon: User, label: "Trang cá nhân" },
    { icon: Users, label: "Liên hệ của tôi" },
    { icon: BookOpen, label: "Hỗ trợ dữ liệu" },
    { icon: HelpCircle, label: "Trợ giúp & hỗ trợ" },
    { icon: Settings, label: "Cài đặt" },
    { icon: BarChart3, label: "Hoạt động" },
  ];

  return (
    <header className="border-b border-gray-300/50 bg-white h-[88px] flex items-center px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-700"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={3} />
          <span className="text-xl font-medium">Quay lại</span>
        </button>

        <div className="w-px h-9 bg-gray-300/30 mx-4"></div>

        <div className="flex items-center gap-3">
          <GraduationCap className="w-9 h-9 text-blue-600" strokeWidth={2.67} />
          <h1 className="text-2xl font-bold text-black">Learnly</h1>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Bell className="w-6 h-6 text-black" />
        <div className="relative flex items-center gap-3 bg-gray-200/95 rounded-full px-4 py-2 shadow-lg">
          {/* Avatar */}
          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" strokeWidth={2.17} />
          </div>

          {/* Button toggle dropdown */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-gray-800"
          >
            <span className="text-xl font-medium">Bùi Minh Hiếu</span>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              strokeWidth={3}
            />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    BM
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Bùi Minh Hiếu</h4>
                    <p className="text-xs text-gray-500">Hạng cấp</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                {menuItems.map((item, i) => (
                  <button
                    key={i}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
