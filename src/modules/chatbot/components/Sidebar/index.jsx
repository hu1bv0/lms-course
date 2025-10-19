import { ENDPOINTS } from "../../../../routes/endPoints";
import { Link } from "react-router-dom";
import {
  Settings,
  MessageSquare,
  HelpCircle,
  BookOpen,
  BarChart3,
  Users,
  GraduationCap
} from "lucide-react";

export default function SidebarContent({ collapsed, conversations = [], onSelect = () => {}, selectedTitle = null, onNewConversation = () => {}, } ) {

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <Link to={ENDPOINTS.INDEX}>
            <GraduationCap strokeWidth={2.67} className="w-6 h-6 text-white" />
          </Link>
        </div>
        {!collapsed && <span className="text-xl font-semibold">Learnly</span>}
      </div>

      <div className="p-4">
        <button onClick={onNewConversation} 
          className="w-full flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-[10px] transition-colors">
          <MessageSquare className="w-5 h-5" />
          {!collapsed && <span>Cuộc thảo chuyện mới</span>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {!collapsed && (
          <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">
            Hôm Nay
          </h3>
        )}
        <div className="space-y-2">
          {conversations.map((conv, idx) => {
            const isActive = selectedTitle === conv.title;
            return (
              <div
                key={idx}
                onClick={() => onSelect(conv)}
                className={`p-3 rounded-[10px] hover:bg-slate-800 cursor-pointer transition-colors ${isActive ? "bg-slate-700" : ""}`}
                title={conv.title}
              >
                {!collapsed ? (
                  <>
                    <h4 className="text-sm font-medium line-clamp-1">
                      {conv.title}
                    </h4>
                    {conv.preview && (
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                        {conv.preview}
                      </p>
                    )}
                  </>
                ) : (
                  <MessageSquare className="w-5 h-5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-800 p-4 space-y-2">
        {[
          { icon: HelpCircle, label: "Trang chủ" },
          { icon: BookOpen, label: "Tìm kiếm" },
          { icon: Users, label: "Liên hệ" },
          { icon: BarChart3, label: "Trợ giúp" },
          { icon: Settings, label: "Cài đặt", muted: true },
        ].map((item, i) => (
          <button
            key={i}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-[10px] transition-colors hover:bg-slate-800 ${
              item.muted ? "text-white/50" : ""
            }`}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}