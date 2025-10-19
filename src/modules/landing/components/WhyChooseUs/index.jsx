import { useState } from "react";
import { Clock, Target, Gift, Rocket } from "lucide-react";

const tabs = [
  { key: "parent", label: "Phụ huynh" },
  { key: "student", label: "Học sinh" },
  { key: "teacher", label: "Giáo viên" },
  { key: "school", label: "Trường học" },
];

const contentData = {
  student: [
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Học Mọi lúc",
      desc: "Học bất cứ khi nào bạn muốn, ở bất cứ đâu",
    },
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: "Lộ trình Cá nhân hóa",
      desc: "Hành trình học tập tùy chỉnh riêng cho bạn",
    },
    {
      icon: <Gift className="w-6 h-6 text-blue-500" />,
      title: "Phần thưởng & Thành tích",
      desc: "Kiếm huy hiệu và mở khóa cấp độ mới",
    },
    {
      icon: <Rocket className="w-6 h-6 text-blue-500" />,
      title: "Học tập Tương tác",
      desc: "Nội dung hấp dẫn giúp việc học dễ nhớ",
    },
  ],
  parent: [
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Theo dõi tiến độ",
      desc: "Xem tiến trình học tập của con em mọi lúc",
    },
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: "Báo cáo chi tiết",
      desc: "Nhận báo cáo định kỳ về thành tích học tập",
    },
  ],
  teacher: [
    {
      icon: <Rocket className="w-6 h-6 text-blue-500" />,
      title: "Công cụ giảng dạy",
      desc: "Hỗ trợ xây dựng bài giảng trực tuyến",
    },
    {
      icon: <Gift className="w-6 h-6 text-blue-500" />,
      title: "Đánh giá dễ dàng",
      desc: "Tích hợp hệ thống kiểm tra & chấm điểm",
    },
  ],
  school: [
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: "Quản lý đồng bộ",
      desc: "Kết nối học sinh, phụ huynh và giáo viên",
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Dữ liệu tập trung",
      desc: "Lưu trữ và phân tích hiệu quả",
    },
  ],
};

export default function WhyChooseUs() {
  const [activeTab, setActiveTab] = useState("student");

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Tại sao chọn Learnly?
          </h3>
          <p className="text-lg text-gray-600">
            Được thiết kế cho mọi người trong hệ sinh thái giáo dục - từ học
            sinh đến trường học
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12 bg-gray-50 rounded-full p-2 w-fit mx-auto shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {contentData[activeTab]?.map((item, index) => (
            <div
              key={index}
              className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h4 className="font-semibold text-lg text-gray-900 mb-2">
                {item.title}
              </h4>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
