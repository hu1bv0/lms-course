import { useState } from "react";

export default function Pricing() {
  const [billing, setBilling] = useState("monthly"); // monthly | yearly
  const [selectedPlan, setSelectedPlan] = useState("premium"); // free | premium | school

  const plans = {
    monthly: {
      free: {
        name: "Gói Miễn phí",
        price: "Miễn phí",
        desc: "Hoàn hảo để bắt đầu",
        features: [
          "Truy cập AI cơ bản",
          "Nhắc nhở học tập thông thường",
          "Dữ liệu web thời gian thực",
          "Lộ trình học tập được AI tạo sẵn",
          "Thống kê tiến độ học đơn giản",
        ],
        button: "Bắt đầu Miễn phí",
      },
      premium: {
        name: "Gói Premium",
        price: "69.000 VND/tháng",
        desc: "Lựa chọn phổ biến nhất",
        features: [
          "Tất cả tính năng gói Miễn phí",
          "Truy cập AI nâng cao không giới hạn",
          "Theo dõi tiến độ và gửi báo cáo",
          "Phân tích tập văn bản và hình ảnh",
          "Không giới hạn tài liệu, bài tập, video",
          "Hỗ trợ ưu tiên 24/7",
        ],
        button: "Chọn Premium",
      },
      school: {
        name: "Gói Trường học",
        price: "990.000 VND/tháng",
        desc: "Cho các cơ sở giáo dục",
        features: [
          "Tất cả các tính năng Premium",
          "Quản lý nhiều tài khoản",
          "Báo cáo tiến độ chi tiết",
          "API tích hợp",
          "Đào tạo và hỗ trợ chuyên biệt",
          "Tùy chỉnh theo yêu cầu",
        ],
        button: "Liên hệ Tư vấn",
      },
    },
    yearly: {
      free: {
        name: "Gói Miễn phí",
        price: "Miễn phí",
        desc: "Hoàn hảo để bắt đầu",
        features: [
          "Truy cập AI cơ bản",
          "Nhắc nhở học tập thông thường",
          "Dữ liệu web thời gian thực",
          "Lộ trình học tập được AI tạo sẵn",
          "Thống kê tiến độ học đơn giản",
        ],
        button: "Bắt đầu Miễn phí",
      },
      premium: {
        name: "Gói Premium",
        price: "690.000 VND/năm",
        desc: "Tiết kiệm 17%",
        features: [
          "Tất cả tính năng gói Miễn phí",
          "Truy cập AI nâng cao không giới hạn",
          "Theo dõi tiến độ và gửi báo cáo",
          "Phân tích tập văn bản và hình ảnh",
          "Không giới hạn tài liệu, bài tập, video",
          "Hỗ trợ ưu tiên 24/7",
        ],
        button: "Chọn Premium",
      },
      school: {
        name: "Gói Trường học",
        price: "9.900.000 VND/năm",
        desc: "Tiết kiệm 17%",
        features: [
          "Tất cả các tính năng Premium",
          "Quản lý nhiều tài khoản",
          "Báo cáo tiến độ chi tiết",
          "API tích hợp",
          "Đào tạo và hỗ trợ chuyên biệt",
          "Tùy chỉnh theo yêu cầu",
        ],
        button: "Liên hệ Tư vấn",
      },
    },
  };

  return (
    <section className="py-2 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Chọn Gói phù hợp với bạn
          </h3>
          <p className="text-lg text-gray-600">
            Bắt đầu miễn phí và nâng cấp khi bạn cần thêm tính năng
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              billing === "monthly"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            Hàng tháng
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition relative ${
              billing === "yearly"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            Hàng năm
            {billing === "yearly" && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-green-100 text-green-600 text-xs font-medium px-2 py-0.5 rounded-full">
                Tiết kiệm 17%
              </span>
            )}
          </button>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(plans[billing]).map(([key, plan]) => (
            <div
              key={key}
              onClick={() => setSelectedPlan(key)}
              className={`relative p-6 rounded-2xl border bg-white shadow-sm cursor-pointer transition transform hover:-translate-y-1 ${
                selectedPlan === key
                  ? "border-blue-500 shadow-lg"
                  : "border-gray-200"
              }`}
            >
              {/* Tag */}
              {key === "premium" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
                    Phổ biến nhất
                  </span>
                </div>
              )}

              {/* Name */}
              <h4 className="text-xl font-semibold mb-2">{plan.name}</h4>
              <p className="text-gray-500 mb-4">{plan.desc}</p>

              {/* Price */}
              <div className="text-2xl font-bold mb-6">{plan.price}</div>

              {/* Features */}
              <ul className="space-y-3 mb-8 text-left">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                className={`w-full py-2 rounded-lg font-medium transition ${
                  key === "premium"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : key === "school"
                      ? "bg-purple-100 text-purple-600 hover:bg-purple-200"
                      : "bg-gray-800 text-white hover:bg-gray-900"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Đảm bảo hoàn tiền trong 30 ngày • Hủy bất cứ lúc nào • Hỗ trợ 24/7
        </p>
      </div>
    </section>
  );
}
