import { Send } from "lucide-react";

export default function MainContent() {
    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-blue-700 bg-opacity-90 rounded-xl flex items-center justify-center">
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25 6.25L21.0167 18.3604C20.8128 18.9802 20.4662 19.5435 20.0049 20.0049C19.5435 20.4662 18.9802 20.8128 18.3604 21.0167L6.25 25L18.3604 28.9833C18.9802 29.1872 19.5435 29.5338 20.0049 29.9951C20.4662 30.4565 20.8128 31.0198 21.0167 31.6396L25 43.75L28.9833 31.6396C29.1872 31.0198 29.5338 30.4565 29.9951 29.9951C30.4565 29.5338 31.0198 29.1872 31.6396 28.9833L43.75 25L31.6396 21.0167C31.0198 20.8128 30.4565 20.4662 29.9951 20.0049C29.5338 19.5435 29.1872 18.9802 28.9833 18.3604L25 6.25Z"
                    stroke="white"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.418 6.25V14.5833"
                    stroke="white"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M39.582 35.4167V43.7501"
                    stroke="white"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.25 10.4167H14.5833"
                    stroke="white"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M35.418 39.5833H43.7513"
                    stroke="white"
                    strokeWidth="2.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-4">
              Xin chào! Tôi có thể giúp gì cho bạn?
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Hỏi tôi bất cứ điều gì về các môn học. Tôi có thể giải thích khái
              niệm, giải bài tập,
              <br />
              tạo câu hỏi thực hành và nhiều hơn nữa
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Giải trích khái niệm này cho tôi"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Send className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tạo bài tập thực hành"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Send className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Kiểm tra bài làm của tôi"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Send className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tạo đề bài học hay"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Send className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Môn học của bạn
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  {
                    name: "Toán học",
                    icon: "📐",
                    color: "bg-orange-100 text-orange-700",
                  },
                  {
                    name: "Tiếng Anh",
                    icon: "📖",
                    color: "bg-purple-100 text-purple-700",
                  },
                  {
                    name: "Vật lý",
                    icon: "⚛️",
                    color: "bg-blue-100 text-blue-700",
                  },
                  {
                    name: "Hóa học",
                    icon: "🧪",
                    color: "bg-green-100 text-green-700",
                  },
                  {
                    name: "Ngữ Văn",
                    icon: "📚",
                    color: "bg-yellow-100 text-yellow-700",
                  },
                ].map((subject, idx) => (
                  <button
                    key={idx}
                    className={`px-4 py-2 rounded-[10px] font-medium text-sm ${subject.color} hover:opacity-80 transition-opacity`}
                  >
                    <span className="mr-2">{subject.icon}</span>
                    {subject.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
    );
}