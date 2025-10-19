import {
  BookOpen,
  ArrowLeft,
  Calculator,
  Languages,
  Atom,
  MapPin,
  FileText,
  Clock,
  Wrench,
  TrendingUp,
  Clock3,
  Target,
  BarChart3,
  Users,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";

export default function Index() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const subjects = [
    {
      name: "Toán học",
      lessons: "12 chủ đề",
      icon: Calculator,
      color: "bg-blue-500",
    },
    {
      name: "Tiếng Anh",
      lessons: "10 chủ đề",
      icon: Languages,
      color: "bg-emerald-500",
    },
    {
      name: "Khoa học",
      lessons: "8 chủ đề",
      icon: Atom,
      color: "bg-purple-500",
    },
    { name: "Vật lý", lessons: "8 chủ đề", icon: Atom, color: "bg-orange-500" },
    { name: "Địa lý", lessons: "7 chủ đề", icon: MapPin, color: "bg-teal-500" },
    {
      name: "Tin học",
      lessons: "9 chủ đề",
      icon: FileText,
      color: "bg-pink-500",
    },
    {
      name: "Lịch sử",
      lessons: "6 chủ đề",
      icon: Clock,
      color: "bg-indigo-500",
    },
    {
      name: "Công nghệ",
      lessons: "6 chủ đề",
      icon: Wrench,
      color: "bg-red-500",
    },
  ];

  const lessons = [
    {
      id: 1,
      title: "Giải thích về so sánh số",
      duration: "15 phút",
      status: "completed",
      image:
        "https://png.pngtree.com/thumb_back/fh260/background/20230702/pngtree-3d-illustration-of-virtual-learning-environment-image_3753731.jpg",
    },
    {
      id: 2,
      title: "So sánh số nguyên",
      duration: "20 phút",
      status: "completed",
      image:
        "https://cdn2.tuoitre.vn/471584752817336320/2024/3/22/8857720-17110949064572087082205.jpg",
    },
    {
      id: 3,
      title: "So sánh phân số",
      duration: "25 phút",
      status: "premium",
      image:
        "https://media.istockphoto.com/id/1967163303/vi/vec-to/ph%C3%A2n-s%E1%BB%91-t%C6%B0%C6%A1ng-%C4%91%C6%B0%C6%A1ng-%C4%91%C6%B0%E1%BB%A3c-gi%E1%BA%A3i-th%C3%ADch-m%E1%BB%99t-n%E1%BB%ADa-b%E1%BA%B1ng-hai-ph%E1%BA%A7n-t%C6%B0-v%C3%A0-ba-ph%E1%BA%A7n-s%C3%A1u.jpg?s=612x612&w=0&k=20&c=57Uh-iSSoaHqZ8FRO-D9iytmDGi7L6ptiZvv-YbGlhc=",
    },
    {
      id: 4,
      title: "Bài tập thực hành",
      duration: "30 phút",
      status: "locked",
      image:
        "https://banhocthongminhbsuc.com/wp-content/uploads/2025/09/toan-lop-5-2.png",
    },
  ];

  const activities = [
    {
      title: "So sánh kích th...",
      time: "5chu đề",
      progress: 75,
      type: "exam",
    },
    {
      title: "Phép cộng và p...",
      time: "4chu đề",
      progress: 100,
      type: "practice",
    },
    { title: "Hình học kh...", time: "6 chu đề", progress: 25, type: "lesson" },
    { title: "Phương trình...", time: "7 chu đề", progress: 0, type: "exam" },
    { title: "Đại số cơ bản", time: "3 chu đề", progress: 50, type: "lesson" },
  ];
  const menuItems = [
    { icon: User, label: "Trang cá nhân" },
    { icon: Users, label: "Liên hệ của tôi" },
    { icon: BookOpen, label: "Hỗ trợ dữ liệu" },
    { icon: HelpCircle, label: "Trợ giúp & hỗ trợ" },
    { icon: Settings, label: "Cài đặt" },
    { icon: BarChart3, label: "Hoạt động" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[10px] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Learnly</span>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to={ENDPOINTS.USER.DASHBOARD}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </Link>
                <a href="#" className="text-gray-900 font-medium">
                  Khóa học
                </a>
                <Link
                  to={ENDPOINTS.USER.CHATBOT}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Chat với AI
                </Link>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Phần thưởng
                </a>
                <Link
                  to={ENDPOINTS.USER.NEWS}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Tin tức
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-[10px] hover:bg-purple-700 transition-colors">
                Nâng cấp
              </button>
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
                          <h4 className="text-sm font-semibold">
                            Bùi Minh Hiếu
                          </h4>
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
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-red-600">
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Chào mừng bạn trở lại, Bùi Minh Hiếu!
              </h1>
              <p className="text-blue-100">
                Hãy tiếp tục hành trình học tập của bạn
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">50%</div>
                <div className="text-sm text-blue-100">Tần độ đăng nhập</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1/5</div>
                <div className="text-sm text-blue-100">Chu kỳ ôn tập</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-sm text-blue-100">Điểm trung bình</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-[10px] flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">Bài học hôm nay</div>
                    <div className="text-2xl font-bold text-gray-900">3</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-[10px] flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">Streak học tập</div>
                    <div className="text-2xl font-bold text-gray-900">
                      3 ngày
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-[10px] flex items-center justify-center">
                    <Target className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">Điểm thưởng</div>
                    <div className="text-2xl font-bold text-gray-900">
                      1,250
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-[10px] flex items-center justify-center">
                    <Clock3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">Thời gian học</div>
                    <div className="text-2xl font-bold text-gray-900">2.5h</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Môn học</h3>
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <button
                    key={subject.name}
                    className="w-full flex items-center gap-3 p-3 rounded-[10px] hover:bg-gray-50 transition-colors text-left"
                  >
                    <div
                      className={`w-10 h-10 ${subject.color} rounded-[10px] flex items-center justify-center`}
                    >
                      <subject.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {subject.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subject.lessons}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Grade Selector */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Khối lớp</h3>
              <div className="grid grid-cols-4 gap-2">
                {[6, 7, 8, 9].map((grade) => (
                  <button
                    key={grade}
                    className={`py-2 px-3 rounded-[10px] font-medium transition-colors ${
                      grade === 8
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Lớp {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Tips */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Chủ đề học tập
              </h3>
              <div className="space-y-3">
                {activities.map((activity, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-[10px]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {activity.time} • kiểm tra
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${activity.progress === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
                          style={{ width: `${activity.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {activity.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Current Course Card */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    So sánh kích thước và vị trí
                  </h2>
                  <p className="text-blue-100">
                    Khám phá và nắm vững kiến thức cơ bản
                  </p>
                </div>
                <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-[10px] hover:bg-white/30 transition-colors">
                  Đang học
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-[10px] p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">Bài học</span>
                  </div>
                  <div className="text-2xl font-bold">2/4</div>
                  <div className="text-sm text-blue-100">Hoàn thành</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-[10px] p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Thời gian</span>
                  </div>
                  <div className="text-2xl font-bold">2-3h</div>
                  <div className="text-sm text-blue-100">Ước tính</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-[10px] p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm">Điểm số</span>
                  </div>
                  <div className="text-2xl font-bold">85%</div>
                  <div className="text-sm text-blue-100">Trung bình</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Tiến độ tổng</span>
                  <span className="font-medium">50%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: "50%" }}
                  />
                </div>
              </div>
            </div>

            {/* Lessons Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">▶ Bài học</h3>
                <span className="text-sm text-gray-500">4 bài học</span>
              </div>
              <div className="space-y-3">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-4 rounded-[10px] border border-gray-200 hover:border-blue-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-[10px] flex items-center justify-center text-blue-600 font-bold">
                      {lesson.id}
                    </div>
                    <img
                      src={lesson.image}
                      alt=""
                      className="w-12 h-12 rounded-[10px] object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {lesson.title}
                      </h4>
                      <p className="text-sm text-gray-500">{lesson.duration}</p>
                    </div>
                    {lesson.status === "completed" && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-[10px] text-sm font-medium">
                        Hoàn thành
                      </span>
                    )}
                    {lesson.status === "premium" && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-[10px] text-sm font-medium">
                        Premium
                      </span>
                    )}
                    {lesson.status === "locked" && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 transition-colors text-sm font-medium">
                        Bắt đầu
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Practice & Test Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  📝 Bài kiểm tra & Luyện tập
                </h3>
                <span className="text-sm text-gray-500">4 bài kiểm tra</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-[10px] p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-[10px] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        Kiểm tra cơ bản
                      </h4>
                      <p className="text-sm text-gray-500">10 câu hỏi</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                      ✓
                    </span>
                  </div>
                  <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-[10px] hover:bg-emerald-700 transition-colors font-medium">
                    Bắt đầu kiểm tra
                  </button>
                </div>
                <div className="border border-gray-200 rounded-[10px] p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-[10px] flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        Kiểm tra nâng cao
                      </h4>
                      <p className="text-sm text-gray-500">15 câu hỏi</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-gray-200 text-gray-400 rounded-[10px] cursor-not-allowed font-medium">
                    Cần nâng cấp để thử cấp
                  </button>
                </div>
                <div className="border border-gray-200 rounded-[10px] p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-[10px] flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        Đề thi thử
                      </h4>
                      <p className="text-sm text-gray-500">20 câu hỏi</p>
                      <p className="text-xs text-gray-400 mt-1">45 phút</p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                      10h
                    </span>
                  </div>
                  <button className="w-full px-4 py-2 bg-gray-200 text-gray-400 rounded-[10px] cursor-not-allowed font-medium">
                    Cần nâng cấp để thử cấp
                  </button>
                </div>
                <div className="border border-gray-200 rounded-[10px] p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-[10px] flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        Luyện tập hàng ngày
                      </h4>
                      <p className="text-sm text-gray-500">5 câu hỏi</p>
                      <p className="text-xs text-emerald-600 mt-1">
                        10 phút • Điều cạnh nhất: 92%
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                      Mới
                    </span>
                  </div>
                  <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-[10px] hover:bg-emerald-700 transition-colors font-medium">
                    Bắt đầu kiểm tra
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
