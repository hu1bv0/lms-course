import { ArrowLeft, Bell, User, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 px-8 py-2">
      <div className="flex items-center justify-between">
        {/* Left Section - Back Button and Title */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2 pl-20">
            {/* Logo Icon */}
            <div className="w-10 h-10 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-900">Learnly</h2>
          </div>

          {/* Back Button */}
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
            <button size="icon" className="text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-lg text-gray-600">Quay lại</span>
            </Link>
          </div>
        </div>
        
        {/* Right Section - Notifications and User Profile */}
        <div className="flex items-center space-x-4">
          
          
          {/* User Profile */}
          <div className="flex items-center space-x-3 bg-[#dbdbdb] rounded-2xl px-4 py-2 shadow-lg shadow-gray-400">
            {/* Notification */}
            <button size="icon" className="text-black relative">
              <Bell className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <span className="text-lg font-medium text-gray-900">Bùi Minh Hiếu</span>
          </div>
        </div>
      </div>
    </header>
  );
}
