import {
  Menu,
  BookOpen,
  CreditCard,
  MessageCircle,
  Calendar,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ENDPOINTS } from "../../routes/endPoints";

export default function Sidebar() {
  return (
    <aside className="w-[317px] bg-blue-600 shadow-2xl rounded-r-[14px] h-full overflow-y-auto">
      <div className="p-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <GraduationCap
              className="w-9 h-9 text-blue-600"
              strokeWidth={2.67}
            />
            <h1 className="text-2xl font-bold text-black">Learnly</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-6">
          <div className="flex items-center gap-4 p-3 bg-white/10 rounded-full">
            <Menu className="w-10 h-10 text-white" />
            <span className="text-2xl font-bold text-white">
              Bảng điều khiển
            </span>
          </div>

          <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg">
            <Link to={ENDPOINTS.LANDING.COURSES} className="flex items-center gap-4">
              <BookOpen className="w-9 h-9 text-white" strokeWidth={2.67} />
              <span className="text-2xl font-bold text-white">Khóa học</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg">
            <CreditCard className="w-9 h-9 text-white" strokeWidth={1.33} />
            <span className="text-2xl font-bold text-white">Giao dịch</span>
          </div>

          <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg">
            <MessageCircle className="w-9 h-9 text-white" strokeWidth={0.67} />
            <span className="text-2xl font-bold text-white">Chat</span>
          </div>

          <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg">
            <Calendar className="w-9 h-9 text-white" strokeWidth={1.33} />
            <span className="text-2xl font-bold text-white">Lịch</span>
          </div>

          <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg">
            <Settings className="w-9 h-9 text-white" strokeWidth={1.33} />
            <span className="text-2xl font-bold text-white">Cài đặt</span>
          </div>

          <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg cursor-pointer mt-32">
            <Link to={ENDPOINTS.AUTH.LOGIN} className="flex items-center gap-4">
              <LogOut className="w-13 h-13 text-white" />
              <span className="text-3xl font-bold text-white">Đăng xuất</span>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}
