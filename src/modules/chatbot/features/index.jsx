import { useState } from "react";
import { ENDPOINTS } from "../../../routes/endPoints";
import { Link , useNavigate } from "react-router-dom";
import {
  Menu,
  Settings,
  HelpCircle,
  BookOpen,
  BarChart3,
  User,
  Users,
  LogOut,
  ChevronDown,
  Send,
  Link as LinkIcon,
  Image,
  ChevronLeft,
  Sparkles,
  ArrowLeft,
  Crown,
  Bell,
} from "lucide-react";

import SidebarContent from "../components/Sidebar/index";
import MainContent from "../components/MainContent/index";
import Content from "../components/Content/content";

export default function Index() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile slide-in
  const [selectedConversation, setSelectedConversation] = useState(null);

  const navigate = useNavigate();
  const subjects = [
    { name: "Toán học", icon: "📐", color: "bg-orange-100 text-orange-700" },
    { name: "Tiếng Anh", icon: "📖", color: "bg-purple-100 text-purple-700" },
    { name: "Vật lý", icon: "⚛️", color: "bg-blue-100 text-blue-700" },
    { name: "Hóa học", icon: "🧪", color: "bg-green-100 text-green-700" },
    { name: "Ngữ Văn", icon: "📚", color: "bg-yellow-100 text-yellow-700" },
  ];

  const conversations = [
      {
        title: "Phản ứng oxi hóa - khử",
        preview: "Khái niệm, ví dụ và cách xác định chất oxi hóa, khử.",
        type: "chemistry",
      },
      {
        title: "Thì quá khứ đơn và thì hiện tại...",
        preview: "Cách sử dụng thì quá khứ...",
        type: "english"
      },
      {
        title: "Định luật Ôm là gì?",
        preview: "Định luật Ôm mô tả mối quan hệ...",
        type: "physics"
      },
      {
        title: "x^2=36",
        preview: "Để giải phương trình bậc hai đơn giản ...",
        type: "math",
        payload: {
          question: "x^2 = 36",
          solution: "x = ±6"
        }
      },
    ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar (collapsible) */}
      <aside
        className={`hidden lg:block bg-slate-900 text-white transition-[width] duration-300 ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        <SidebarContent
          collapsed={isCollapsed}
          conversations={conversations}
          selectedTitle={selectedConversation?.title}
          onSelect={(conv) => {
            setSelectedConversation(conv);
            // close mobile if open
            setIsMobileOpen(false);
          }}
          onNewConversation={() => setSelectedConversation(null)}
        />
      </aside>

      {/* Mobile Sidebar (slide-in) */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute -right-10 top-4">
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-[10px] bg-slate-900 text-white shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent
          collapsed={false}
          conversations={conversations}
          selectedTitle={selectedConversation?.title}
          onSelect={(conv) => {
            setSelectedConversation(conv);
            setIsMobileOpen(false);
          }}
          onNewConversation={() => setSelectedConversation(null)}
        />
      </aside>
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle menu"
              onClick={() =>
                window.innerWidth < 1024
                  ? setIsMobileOpen(true)
                  : setIsCollapsed((v) => !v)
              }
              className="p-2 hover:bg-gray-100 rounded-[10px]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden md:flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 text-black hover:bg-gray-100 rounded-lg transition-colors">
                <Link
                    to={ENDPOINTS.USER.COURSES}
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-lg">Quay lại</span>
                  </Link>
              </button>

              <div className="w-px h-9 bg-black/30 mx-2"></div>

              <button className="px-4 py-2 text-lg text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold">
                Learnly AI
              </button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-400 font-light">NovaStep Model 4o Advanced</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-black hover:bg-gray-100 rounded-xl transition-colors">
                <Crown className="w-5 h-5" />
                <div className="text-lg font-semibold">Nâng cấp</div>
              </button>
              <Bell className="w-6 h-6" />
              <Settings className="w-6 h-6" />
              
              {/* User Profile with Popup */}
              <div className="relative">
                <button
                  onClick={() => setIsPopupOpen(!isPopupOpen)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-[10px] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Bùi Minh Hiếu</span>
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      BM
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {isPopupOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
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
                    <div className="py-1">
                      {[
                        { icon: User, label: "Trang cá nhân" },
                        { icon: Users, label: "Liên hệ của tôi" },
                        { icon: BookOpen, label: "Hỗ trợ dữ liệu" },
                        { icon: HelpCircle, label: "Trợ giúp & hỗ trợ" },
                        { icon: Settings, label: "Cài đặt" },
                        { icon: BarChart3, label: "Hoạt động" },
                      ].map((it, i) => (
                        <button
                          key={i}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                        >
                          <it.icon className="w-4 h-4" />
                          {it.label}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => navigate("/login")}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          
        {/* Main Chat Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {selectedConversation ? (
              <Content conversation={selectedConversation} />
            ) : (
              <MainContent />
            )}
        </div>

        {/* Bottom Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
              <button className="p-2 hover:bg-gray-200 rounded-[10px] transition-colors">
                <LinkIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-[10px] transition-colors">
                <Image className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="text"
                placeholder="Nhập bất cứ điều gì hoặc kéo và thả tệp của bạn"
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
              <button className="p-2 hover:bg-gray-200 rounded-[10px] transition-colors">
                <Send className="w-5 h-5 text-blue-600" />
              </button>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              Learnly có thể mắc lỗi. Hãy kiểm tra những thông tin quan trọng
            </p>
          </div>
        </div>
      </div>

      {/* Click outside to close popup */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
}
