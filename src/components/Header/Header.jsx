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
  Crown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ENDPOINTS } from "../../routes/endPoints";
import { USER_ROLES, SUBSCRIPTION_TYPES } from "../../services/firebase";
import NotificationDropdown from "../NotificationDropdown";

export default function Header() {
  const navigate = useNavigate();
  const { userData, logout, role, subscriptionType, permissions } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ENDPOINTS.AUTH.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserDisplayName = () => {
    return userData?.displayName || userData?.fullName || "Người dùng";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleDisplayName = () => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "Quản trị viên";
      case USER_ROLES.PARENT:
        return "Phụ huynh";
      case USER_ROLES.STUDENT:
        return "Học sinh";
      default:
        return "Người dùng";
    }
  };

  const menuItems = [
    { icon: User, label: "Trang cá nhân", onClick: () => navigate(ENDPOINTS.SHARED.PROFILE) },
    { icon: Users, label: "Liên hệ của tôi" },
    { icon: BookOpen, label: "Hỗ trợ dữ liệu" },
    { icon: HelpCircle, label: "Trợ giúp & hỗ trợ" },
    { icon: Settings, label: "Cài đặt" },
    { icon: BarChart3, label: "Hoạt động" },
  ];

  // Add subscription management for premium users
  if (subscriptionType === SUBSCRIPTION_TYPES.PREMIUM) {
    menuItems.splice(1, 0, { 
      icon: Crown, 
      label: "Quản lý gói học", 
      onClick: () => navigate(ENDPOINTS.SHARED.SUBSCRIPTION) 
    });
  }

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
        <NotificationDropdown userRole={role} />
        <div className="relative flex items-center gap-3 bg-gray-200/95 rounded-full px-4 py-2 shadow-lg">
          {/* Avatar */}
          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {getUserInitials()}
            </span>
          </div>

          {/* Button toggle dropdown */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-gray-800"
          >
            <span className="text-xl font-medium">{getUserDisplayName()}</span>
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
                    {getUserInitials()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{getUserDisplayName()}</h4>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-gray-500">{getRoleDisplayName()}</p>
                      {subscriptionType === SUBSCRIPTION_TYPES.PREMIUM && (
                        <Crown className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                {menuItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      setIsDropdownOpen(false);
                    }}
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
                  onClick={handleLogout}
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
