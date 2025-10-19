import { User, Lock, GraduationCap, Share2, QrCode, Gift, LogOut } from "lucide-react";

// interface SidebarProps {
//   activeItem?: string;
// }

export default function Sidebar() {
  const menuItems = [
    { id: "profile", label: "Thông tin cá nhân", icon: User, active: true, color: "text-blue-500" },
    { id: "password", label: "Đổi mật khẩu", icon: Lock, color: "text-black" },
    { id: "courses", label: "Khóa học của bạn", icon: GraduationCap, color: "text-blue-500" },
    { id: "link", label: "Liên kết tài khoản", icon: Share2, color: "text-purple-500" },
    { id: "activation", label: "Nhập mã kích hoạt", icon: QrCode, color: "text-black" },
    { id: "referral", label: "Mã giới thiệu", icon: Gift, color: "text-green-500" },
    { id: "logout", label: "Đăng xuất", icon: LogOut, color: "text-red-500" },
  ];

  return (
    <div className="w-full md:w-64 bg-white rounded-2xl border border-gray-400 shadow-xl p-4 h-fit">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-3">
          <svg className="w-7 h-7" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.5846 22.75V20.5833C20.5846 19.4341 20.1281 18.3319 19.3154 17.5192C18.5028 16.7065 17.4006 16.25 16.2513 16.25H9.7513C8.60203 16.25 7.49983 16.7065 6.68717 17.5192C5.87451 18.3319 5.41797 19.4341 5.41797 20.5833V22.75" stroke="white" strokeWidth="2.16667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.0013 11.9167C15.3945 11.9167 17.3346 9.97657 17.3346 7.58333C17.3346 5.1901 15.3945 3.25 13.0013 3.25C10.6081 3.25 8.66797 5.1901 8.66797 7.58333C8.66797 9.97657 10.6081 11.9167 13.0013 11.9167Z" stroke="white" strokeWidth="2.16667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-black mb-1">Bùi Minh Hiếu</h3>
        <p className="text-sm text-black/50">Khối 9</p>
        <button className="mt-3 px-6 py-1.5 bg-blue-600/30 text-blue-700 rounded-[10px] text-sm font-bold hover:bg-blue-600/40 transition-colors">
          Cập nhật avatar
        </button>
      </div>

      <div className="border-t border-black pt-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === "profile"; // Example active item
          
          return (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors
                ${isActive 
                  ? "bg-purple-200/70 text-black font-bold" 
                  : "text-black hover:bg-gray-100"}
                `}
            >
              <Icon className={`w-6 h-6 ${item.color}`}/>
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
