// import { Card, CardContent } from "../components/Card";
// import { Avatar, AvatarFallback } from "../components/Avatar";
// import {
//   ArrowLeft,
//   Bell,
//   GraduationCap,
//   BookOpen,
//   Users,
//   CreditCard,
//   MessageCircle,
//   Calendar,
//   School,
//   Settings,
//   LogOut,
//   ChevronDown,
//   Menu,
//   MoreHorizontal,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="border-b border-gray-300/50 bg-white h-[88px] flex items-center px-4">
//         <div className="flex items-center gap-4">
//           <button
//             variant="ghost"
//             size="sm"
//             onClick={() => navigate("/")}
//             className="flex items-center gap-2 text-gray-700"
//           >
//             <ArrowLeft className="w-5 h-5" strokeWidth={3} />
//             <span className="text-xl font-medium">Quay lại</span>
//           </button>

//           <div className="w-px h-9 bg-gray-300/30 mx-4"></div>

//           <div className="flex items-center gap-3">
//             <GraduationCap
//               className="w-9 h-9 text-blue-600"
//               strokeWidth={2.67}
//             />
//             <h1 className="text-2xl font-bold text-black">Learnly</h1>
//           </div>
//         </div>

//         <div className="ml-auto flex items-center gap-4">
//           <Bell className="w-6 h-6 text-black" />
//           <div className="flex items-center gap-3 bg-gray-200/95 rounded-full px-4 py-2 shadow-lg">
//             <Avatar className="w-10 h-10">
//               <div className="w-full h-full bg-blue-700 rounded-full flex items-center justify-center">
//                 <Users className="w-6 h-6 text-white" strokeWidth={2.17} />
//               </div>
//               <AvatarFallback>BH</AvatarFallback>
//             </Avatar>
//             <span className="text-xl font-medium text-black">
//               Bùi Minh Hiếu
//             </span>
//           </div>
//         </div>
//       </header>

//       <div className="flex">
//         {/* Sidebar */}
//         <aside className="w-[317px] bg-blue-600 shadow-2xl rounded-r-[14px] h-[calc(100vh-88px)] overflow-y-auto">
//           <div className="p-6">
//             {/* Logo */}
//             <div className="mb-8">
//               <h2 className="text-5xl font-bold text-white mb-8">Learnly</h2>
//             </div>

//             {/* Navigation */}
//             <nav className="space-y-6">
//               {/* Dashboard */}
//               <div className="flex items-center gap-4 p-3 bg-white/10 rounded-full">
//                 <Menu className="w-10 h-10 text-white" />
//                 <span className="text-2xl font-bold text-white">
//                   Bảng điều khiển
//                 </span>
//               </div>

//               {/* Courses */}
//               <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg transition-colors">
//                 <BookOpen className="w-9 h-9 text-white" strokeWidth={2.67} />
//                 <span className="text-2xl font-bold text-white">Khóa học</span>
//               </div>

//               {/* Students */}
//               <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg transition-colors">
//                 <div className="w-12 h-12 flex items-center justify-center">
//                   <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
//                     <path
//                       d="M23.882 20.912L8.07617 12.7487L23.882 4.4895L39.6877 12.7487L23.882 20.912Z"
//                       stroke="white"
//                       strokeWidth="0.66531"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M17.1617 17.4006C17.0672 17.9695 16.9727 18.4445 16.9727 19.0143C16.9727 22.9064 20.097 25.9442 23.882 25.9442C27.6671 25.9442 30.7914 22.8106 30.7914 19.0143C30.7914 18.4445 30.6969 17.9695 30.6023 17.4006"
//                       stroke="white"
//                       strokeWidth="0.66531"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M23.8816 43.4108C31.6701 43.4108 37.9839 40.4355 37.9839 36.7653C37.9839 33.0951 31.6701 30.1199 23.8816 30.1199C16.0931 30.1199 9.7793 33.0951 9.7793 36.7653C9.7793 40.4355 16.0931 43.4108 23.8816 43.4108Z"
//                       stroke="white"
//                       strokeWidth="0.66531"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M8.07617 12.749V21.8614"
//                       stroke="white"
//                       strokeWidth="0.66531"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </div>
//                 <span className="text-2xl font-bold text-white">Học sinh</span>
//               </div>

//               {/* Transactions */}
//               <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg transition-colors">
//                 <CreditCard className="w-9 h-9 text-white" strokeWidth={1.33} />
//                 <span className="text-2xl font-bold text-white">Giao dịch</span>
//               </div>

//               {/* Chat */}
//               <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg transition-colors">
//                 <MessageCircle
//                   className="w-9 h-9 text-white"
//                   strokeWidth={0.67}
//                 />
//                 <span className="text-2xl font-bold text-white">Chat</span>
//               </div>

//               {/* Calendar */}
//               <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg transition-colors">
//                 <Calendar className="w-9 h-9 text-white" strokeWidth={1.33} />
//                 <span className="text-2xl font-bold text-white">Lịch</span>
//               </div>

//               {/* Classes */}
//               <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg transition-colors">
//                 <div className="w-12 h-12 flex items-center justify-center">
//                   <svg className="w-9 h-10" viewBox="0 0 37 40" fill="none">
//                     <path
//                       d="M18.043 1.06885C27.8047 1.06885 35.7558 9.53641 35.7559 20.0298C35.7559 30.5232 27.8047 38.9907 18.043 38.9907C15.0508 38.9907 12.2276 38.1955 9.75195 36.7896L9.62793 36.7192L9.49121 36.7603L2.36621 38.9272C2.09545 39.0093 1.80931 39.0118 1.53711 38.936C1.26484 38.8602 1.01342 38.7077 0.810547 38.4907C0.607487 38.2735 0.460157 38 0.386719 37.6978C0.313278 37.3955 0.316703 37.0772 0.396484 36.7769L2.42285 29.1597L2.45508 29.0386L2.39941 28.9263C1.03783 26.1885 0.327307 23.1328 0.331055 20.0298C0.331082 9.53652 8.28135 1.06902 18.043 1.06885Z"
//                       fill="white"
//                       stroke="white"
//                       strokeWidth="0.67"
//                     />
//                   </svg>
//                 </div>
//                 <span className="text-2xl font-bold text-white">Lớp Học</span>
//               </div>

//               {/* Settings */}
//               <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg transition-colors">
//                 <Settings className="w-9 h-9 text-white" strokeWidth={1.33} />
//                 <span className="text-2xl font-bold text-white">Cài đặt</span>
//               </div>

//               {/* Logout */}
//               <div className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg transition-colors cursor-pointer mt-32">
//                 <LogOut className="w-13 h-13 text-white" />
//                 <span className="text-3xl font-bold text-white">Đăng xuất</span>
//               </div>
//             </nav>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-8">
//           <div className="max-w-7xl mx-auto space-y-8">
//             {/* Learning Progress Section */}
//             <Card className="p-8 shadow-lg rounded-[21px]">
//               <CardContent className="p-0">
//                 <div className="flex items-center justify-between mb-8">
//                   <div className="flex items-center gap-4">
//                     <h2 className="text-3xl font-bold text-black">
//                       Tiến Độ Học Tập
//                     </h2>
//                     <ChevronDown
//                       className="w-11 h-11 text-black"
//                       strokeWidth={3.6}
//                     />
//                   </div>

//                   {/* Robot Illustration */}
//                   <div className="w-[472px] h-[472px]">
//                     <img
//                       src="https://api.builder.io/api/v1/image/assets/TEMP/338bd8f23d36d1cef8e1ebdf0900f021e09f61f1?width=943"
//                       alt="AI Robot Learning Assistant"
//                       className="w-full h-full object-contain"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 mb-8">
//                   <span className="text-lg text-black">Chủ đề tiếp theo:</span>
//                 </div>

//                 {/* Progress Circles */}
//                 <div className="flex gap-8 mb-12">
//                   {/* Attendance */}
//                   <div className="text-center">
//                     <div className="relative w-32 h-32 mb-4">
//                       <svg
//                         className="w-32 h-32 transform -rotate-90"
//                         viewBox="0 0 120 120"
//                       >
//                         <circle
//                           cx="60"
//                           cy="60"
//                           r="50"
//                           stroke="#E5E7EB"
//                           strokeWidth="8"
//                           fill="transparent"
//                         />
//                         <circle
//                           cx="60"
//                           cy="60"
//                           r="50"
//                           stroke="#3B82F6"
//                           strokeWidth="8"
//                           fill="transparent"
//                           strokeDasharray={`${(64 / 72) * 314} 314`}
//                           strokeLinecap="round"
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="text-center">
//                           <div className="text-2xl font-bold">64</div>
//                           <div className="text-sm text-gray-500">/72</div>
//                         </div>
//                       </div>
//                     </div>
//                     <p className="text-xl font-medium">Tham dự</p>
//                   </div>

//                   {/* Homework */}
//                   <div className="text-center">
//                     <div className="relative w-32 h-32 mb-4">
//                       <svg
//                         className="w-32 h-32 transform -rotate-90"
//                         viewBox="0 0 120 120"
//                       >
//                         <circle
//                           cx="60"
//                           cy="60"
//                           r="50"
//                           stroke="#E5E7EB"
//                           strokeWidth="8"
//                           fill="transparent"
//                         />
//                         <circle
//                           cx="60"
//                           cy="60"
//                           r="50"
//                           stroke="#8B5CF6"
//                           strokeWidth="8"
//                           fill="transparent"
//                           strokeDasharray={`${(21 / 31) * 314} 314`}
//                           strokeLinecap="round"
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="text-center">
//                           <div className="text-2xl font-bold">21</div>
//                           <div className="text-sm text-gray-500">/31</div>
//                         </div>
//                       </div>
//                     </div>
//                     <p className="text-xl font-medium">Bài tập về nhà</p>
//                   </div>

//                   {/* Assessment */}
//                   <div className="text-center">
//                     <div className="relative w-32 h-32 mb-4">
//                       <svg
//                         className="w-32 h-32 transform -rotate-90"
//                         viewBox="0 0 120 120"
//                       >
//                         <circle
//                           cx="60"
//                           cy="60"
//                           r="50"
//                           stroke="#E5E7EB"
//                           strokeWidth="8"
//                           fill="transparent"
//                         />
//                         <circle
//                           cx="60"
//                           cy="60"
//                           r="50"
//                           stroke="#10B981"
//                           strokeWidth="8"
//                           fill="transparent"
//                           strokeDasharray={`${(90 / 100) * 314} 314`}
//                           strokeLinecap="round"
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="text-center">
//                           <div className="text-2xl font-bold">90</div>
//                           <div className="text-sm text-gray-500">/100</div>
//                         </div>
//                       </div>
//                     </div>
//                     <p className="text-xl font-medium">Đánh giá</p>
//                   </div>
//                 </div>

//                 {/* Action button */}
//                 <button className="bg-[#301EA1] hover:bg-[#2515A0] text-white px-8 py-4 text-xl font-semibold rounded-2xl">
//                   Đi đến khoá học
//                 </button>
//               </CardContent>
//             </Card>

//             <div className="grid lg:grid-cols-2 gap-8">
//               {/* Upcoming Events */}
//               <Card className="p-6 shadow-lg rounded-2xl">
//                 <CardContent className="p-0">
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-2xl font-bold text-black">
//                       Sự Kiện Sắp Tới
//                     </h3>
//                     <span className="text-sm text-gray-600">Xem tất cả</span>
//                   </div>

//                   <div className="space-y-6">
//                     {/* Event 1 */}
//                     <div className="flex gap-4">
//                       <img
//                         src="https://api.builder.io/api/v1/image/assets/TEMP/c3a59072c59f54a9b3e3b15cc80084079b27b6c6?width=496"
//                         alt="AI Course"
//                         className="w-[124px] h-[81px] rounded-[28px] object-cover"
//                       />
//                       <div className="flex-1">
//                         <p className="text-sm text-gray-500 mb-1">
//                           June 20, 00:12
//                         </p>
//                         <h4 className="text-lg font-bold text-black mb-2">
//                           Khóa học ứng dụng AI
//                         </h4>
//                         <p className="text-sm text-black">
//                           Cung cấp kiến thức thực tế về AI và các công cụ AI tạo
//                           sinh [*]. Giúp học sinh, sinh viên ứng dụng AI để hỗ
//                           trợ học tập và nghiên cứu.
//                         </p>
//                       </div>
//                     </div>

//                     {/* Event 2 */}
//                     <div className="flex gap-4">
//                       <img
//                         src="https://api.builder.io/api/v1/image/assets/TEMP/7833a98eaa974de24094388d36a7cd0b4369bffb?width=496"
//                         alt="Chatbot Support"
//                         className="w-[124px] h-[81px] rounded-[28px] object-cover"
//                       />
//                       <div className="flex-1">
//                         <p className="text-sm text-gray-500 mb-1">
//                           June 20, 00:12
//                         </p>
//                         <h4 className="text-lg font-bold text-black mb-2">
//                           Chatbot hỗ trợ 24/7
//                         </h4>
//                         <p className="text-sm text-black">
//                           Chatbot AI là công cụ giao tiếp tự động, hoạt động dựa
//                           trên công nghệ xử lý ngôn ngữ tự nhiên (NLP) và học
//                           máy, cho phép giao tiếp hiệu quả, nhanh chóng và chính
//                           xác với người dùng qua văn bản.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Next Classes */}
//               <Card className="p-6 shadow-lg rounded-2xl">
//                 <CardContent className="p-0">
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-2xl font-bold text-black">
//                       Lớp Học Tiếp Theo
//                     </h3>
//                     <div className="flex items-center gap-2">
//                       <Calendar
//                         className="w-6 h-6 text-black"
//                         strokeWidth={1}
//                       />
//                       <span className="text-sm text-gray-600">Lịch</span>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     {/* Class 1 */}
//                     <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
//                       <div className="flex items-center gap-4">
//                         <div className="text-center">
//                           <div className="text-3xl font-bold text-black">
//                             19
//                           </div>
//                           <div className="text-sm text-gray-500 font-bold">
//                             Aug
//                           </div>
//                         </div>
//                         <div className="flex-1">
//                           <h4 className="text-sm font-bold text-black mb-1">
//                             Nguyên tắc cơ bản
//                           </h4>
//                           <p className="text-xs text-gray-500 font-bold">
//                             From : Hiếu Bùi
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-lg text-gray-500 font-bold">
//                             18:00 - 20:30
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Class 2 */}
//                     <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
//                       <div className="flex items-center gap-4">
//                         <div className="text-center">
//                           <div className="text-3xl font-bold text-black">
//                             21
//                           </div>
//                           <div className="text-sm text-gray-500 font-bold">
//                             Aug
//                           </div>
//                         </div>
//                         <div className="flex-1">
//                           <h4 className="text-sm font-bold text-black mb-1">
//                             Xử lý phản xạ
//                           </h4>
//                           <p className="text-xs text-gray-500 font-bold">
//                             From : Hiếu Bùi
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-lg text-gray-500 font-bold">
//                             18:00 - 20:30
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Class 3 */}
//                     <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
//                       <div className="flex items-center gap-4">
//                         <div className="text-center">
//                           <div className="text-3xl font-bold text-black">
//                             25
//                           </div>
//                           <div className="text-sm text-gray-500 font-bold">
//                             Aug
//                           </div>
//                         </div>
//                         <div className="flex-1">
//                           <h4 className="text-sm font-bold text-black mb-1">
//                             C���u trúc máy tính
//                           </h4>
//                           <p className="text-xs text-gray-500 font-bold">
//                             From : Hiếu Bùi
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-lg text-gray-500 font-bold">
//                             18:00 - 20:30
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
import { Card, CardContent } from "../components/Card";
import { ChevronDown, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";

export default function Dashboard() {
  return (
    <main className="flex-1 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Learning Progress Section */}
        <Card className="p-8 shadow-lg rounded-[21px]">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-8">
              <div className="flex-row items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-black">
                    Tiến Độ Học Tập
                  </h2>
                  <ChevronDown
                    className="w-11 h-11 text-black"
                    strokeWidth={3.6}
                  />
                </div>

                <div className="flex items-center gap-2 mb-8">
                  <span className="text-lg text-black">Chủ đề tiếp theo:</span>
                </div>

                {/* Progress Circles */}
                <div className="flex gap-8 mb-12">
                  {/* Attendance */}
                  <div className="text-center">
                    <div className="relative w-32 h-32 mb-4">
                      <svg
                        className="w-32 h-32 transform -rotate-90"
                        viewBox="0 0 120 120"
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#E5E7EB"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#3B82F6"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${(64 / 72) * 314} 314`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold">64</div>
                          <div className="text-sm text-gray-500">/72</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xl font-medium">Tham dự</p>
                  </div>

                  {/* Homework */}
                  <div className="text-center">
                    <div className="relative w-32 h-32 mb-4">
                      <svg
                        className="w-32 h-32 transform -rotate-90"
                        viewBox="0 0 120 120"
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#E5E7EB"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#8B5CF6"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${(21 / 31) * 314} 314`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold">21</div>
                          <div className="text-sm text-gray-500">/31</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xl font-medium">Bài tập về nhà</p>
                  </div>

                  {/* Assessment */}
                  <div className="text-center">
                    <div className="relative w-32 h-32 mb-4">
                      <svg
                        className="w-32 h-32 transform -rotate-90"
                        viewBox="0 0 120 120"
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#E5E7EB"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#10B981"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${(90 / 100) * 314} 314`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold">90</div>
                          <div className="text-sm text-gray-500">/100</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xl font-medium">Đánh giá</p>
                  </div>
                </div>

                {/* Action button */}
                <button className="bg-[#301EA1] hover:bg-[#2515A0] text-white px-8 py-4 text-xl font-semibold rounded-2xl">
                  <Link to={ENDPOINTS.USER.COURSES}>Đi đến khoá học</Link>
                </button>
              </div>

              {/* Robot Illustration */}
              <div className="w-[472px] h-[472px]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/338bd8f23d36d1cef8e1ebdf0900f021e09f61f1?width=943"
                  alt="AI Robot Learning Assistant"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <Card className="p-6 shadow-lg rounded-2xl">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-black">
                  Sự Kiện Sắp Tới
                </h3>
                <Link to="https://www.facebook.com/profile.php?id=61577615262108">
                  <span className="text-sm text-gray-600">Xem tất cả</span>
                </Link>
              </div>

              <div className="space-y-6">
                {/* Event 1 */}
                <div className="flex gap-4">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/c3a59072c59f54a9b3e3b15cc80084079b27b6c6?width=496"
                    alt="AI Course"
                    className="w-[124px] h-[81px] rounded-[28px] object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">June 20, 00:12</p>
                    <h4 className="text-lg font-bold text-black mb-2">
                      Khóa học ứng dụng AI
                    </h4>
                    <p className="text-sm text-black">
                      Cung cấp kiến thức thực tế về AI và các công cụ AI tạo
                      sinh [*]. Giúp học sinh, sinh viên ứng dụng AI để hỗ trợ
                      học tập và nghiên cứu.
                    </p>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="flex gap-4">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/7833a98eaa974de24094388d36a7cd0b4369bffb?width=496"
                    alt="Chatbot Support"
                    className="w-[124px] h-[81px] rounded-[28px] object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">June 20, 00:12</p>
                    <h4 className="text-lg font-bold text-black mb-2">
                      Chatbot hỗ trợ 24/7
                    </h4>
                    <p className="text-sm text-black">
                      Chatbot AI là công cụ giao tiếp tự động, hoạt động dựa
                      trên công nghệ xử lý ngôn ngữ tự nhiên (NLP) và học máy,
                      cho phép giao tiếp hiệu quả, nhanh chóng và chính xác với
                      người dùng qua văn bản.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Classes */}
          <Card className="p-6 shadow-lg rounded-2xl">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-black">
                  Lớp Học Tiếp Theo
                </h3>
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-black" strokeWidth={1} />
                  <span className="text-sm text-gray-600">Lịch</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Class 1 */}
                <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black">19</div>
                      <div className="text-sm text-gray-500 font-bold">Aug</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-black mb-1">
                        Nguyên tắc cơ bản
                      </h4>
                      <p className="text-xs text-gray-500 font-bold">
                        From : Hiếu Bùi
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg text-gray-500 font-bold">
                        18:00 - 20:30
                      </div>
                    </div>
                  </div>
                </div>

                {/* Class 2 */}
                <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black">21</div>
                      <div className="text-sm text-gray-500 font-bold">Aug</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-black mb-1">
                        Xử lý phản xạ
                      </h4>
                      <p className="text-xs text-gray-500 font-bold">
                        From : Hiếu Bùi
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg text-gray-500 font-bold">
                        18:00 - 20:30
                      </div>
                    </div>
                  </div>
                </div>

                {/* Class 3 */}
                <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black">25</div>
                      <div className="text-sm text-gray-500 font-bold">Aug</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-black mb-1">
                        Cấu trúc máy tính
                      </h4>
                      <p className="text-xs text-gray-500 font-bold">
                        From : Hiếu Bùi
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg text-gray-500 font-bold">
                        18:00 - 20:30
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
