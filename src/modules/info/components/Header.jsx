import { Bell, Crown, MessageSquare, Gift, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";
export default function Header() {
  return (
    <header className="w-full min-h-[88px] border-b border-black/50 bg-white px-4 md:px-8 flex items-center justify-between py-4">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <svg className="w-9 h-9" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32.1282 16.8383C32.3968 16.7166 32.6246 16.5165 32.7836 16.263C32.9426 16.0094 33.0258 15.7135 33.0227 15.4119C33.0197 15.1102 32.9306 14.8161 32.7666 14.566C32.6025 14.3159 32.3706 14.1207 32.0997 14.0047L19.2432 7.98606C18.8524 7.80283 18.4278 7.70801 17.9982 7.70801C17.5686 7.70801 17.1441 7.80283 16.7532 7.98606L3.89823 13.9986C3.63118 14.1188 3.40401 14.3164 3.24448 14.5671C3.08496 14.8179 3 15.1111 3 15.4107C3 15.7104 3.08496 16.0035 3.24448 16.2543C3.40401 16.5051 3.63118 16.7027 3.89823 16.8229L16.7532 22.8477C17.1441 23.031 17.5686 23.1258 17.9982 23.1258C18.4278 23.1258 18.8524 23.031 19.2432 22.8477L32.1282 16.8383Z" stroke="#2563EB" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M33 15.417V24.667" stroke="#2563EB" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 19.2705V24.6663C9 25.893 9.94821 27.0694 11.636 27.9367C13.3239 28.8041 15.6131 29.2913 18 29.2913C20.3869 29.2913 22.6761 28.8041 24.364 27.9367C26.0518 27.0694 27 25.893 27 24.6663V19.2705" stroke="#2563EB" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-2xl font-bold text-black">Learnly</span>
        </div>

        <div className="hidden md:flex items-center gap-2">

          <div className="w-px h-9 bg-black/30 mx-2"></div>
          <button className="flex items-center gap-2 px-4 py-2 text-black hover:bg-gray-100 rounded-lg transition-colors">
            <Link to={ENDPOINTS.USER.COURSES} className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.043 10L3.95964 10" stroke="#374151" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.5 15.833L3.95833 9.99967L9.5 4.16634" stroke="#374151" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-lg">Quay lại</span>
            </Link>
          </button>

          <button className="px-4 py-2 text-lg font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Vào học
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-10 ml-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-semibold">
            <MessageSquare className="w-5 h-5" />
            <span className="text-lg">Chat với AI</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-semibold">
            <Gift className="w-5 h-5" />
            <span className="text-lg">Phần thưởng</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-semibold">
            <FileText className="w-5 h-5" />
            <span className="text-lg">Tin tức</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden md:flex items-center gap-3 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">
          <Crown className="w-5 h-5" />
          <span className="text-lg font-medium">Nâng cấp</span>
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.0846 23.25V21.0833C21.0846 19.9341 20.6281 18.8319 19.8154 18.0192C19.0028 17.2065 17.9006 16.75 16.7513 16.75H10.2513C9.10203 16.75 7.99983 17.2065 7.18717 18.0192C6.37451 18.8319 5.91797 19.9341 5.91797 21.0833V23.25" stroke="white" strokeWidth="2.16667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.5013 12.4167C15.8945 12.4167 17.8346 10.4766 17.8346 8.08333C17.8346 5.6901 15.8945 3.75 13.5013 3.75C11.1081 3.75 9.16797 5.6901 9.16797 8.08333C9.16797 10.4766 11.1081 12.4167 13.5013 12.4167Z" stroke="white" strokeWidth="2.16667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="hidden md:block">
            <div className="text-lg font-medium text-black">Bùi Minh Hiếu</div>
            <div className="text-sm text-black/50">Học sinh lớp 9</div>
          </div>
        </div>
      </div>
    </header>
  );
}
