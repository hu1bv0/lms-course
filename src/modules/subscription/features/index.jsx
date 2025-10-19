import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";
import { GraduationCapIcon as GraduationCap, Check, Star, Crown, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";
import { SUBSCRIPTION_TYPES } from "../../../services/firebase";
import { legacyAuthService as authService } from "../../../services/firebase";
import { SUBSCRIPTION_PLANS, formatPrice, calculateYearlySavings } from "../../../constants/pricingConstants";

const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const { userData, subscriptionType, updateSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const yearlySavings = calculateYearlySavings();

  const subscriptionPlans = [
    {
      id: SUBSCRIPTION_TYPES.FREE,
      name: "Gói Miễn phí",
      price: 0,
      period: "vĩnh viễn",
      description: "Dành cho học sinh mới bắt đầu",
      features: [
        "Truy cập các khóa học cơ bản",
        "Hỗ trợ AI chatbot (5 câu hỏi/ngày)",
        "Báo cáo tiến độ học tập",
        "Tham gia cộng đồng học tập",
        "Tài liệu học tập cơ bản"
      ],
      limitations: [
        "Giới hạn 5 câu hỏi AI/ngày",
        "Không có khóa học nâng cao",
        "Không có hỗ trợ ưu tiên"
      ],
      popular: false,
      buttonText: "Đang sử dụng",
      buttonDisabled: true
    },
    {
      id: "premium-monthly",
      name: "Gói Premium",
      price: SUBSCRIPTION_PLANS.MONTHLY.price,
      period: SUBSCRIPTION_PLANS.MONTHLY.period,
      description: "Dành cho học sinh muốn học tập hiệu quả",
      features: [
        "Truy cập tất cả khóa học",
        "Hỗ trợ AI chatbot không giới hạn",
        "Báo cáo tiến độ chi tiết",
        "Hỗ trợ ưu tiên 24/7",
        "Tài liệu học tập nâng cao",
        "Luyện thi chuyên sâu",
        "Phân tích điểm mạnh/yếu",
        "Lộ trình học tập cá nhân hóa"
      ],
      limitations: [],
      popular: false,
      buttonText: subscriptionType === SUBSCRIPTION_TYPES.PREMIUM ? "Đang sử dụng" : "Nâng cấp ngay",
      buttonDisabled: subscriptionType === SUBSCRIPTION_TYPES.PREMIUM
    },
    {
      id: "premium-yearly",
      name: "Gói Premium",
      price: SUBSCRIPTION_PLANS.YEARLY.price,
      period: SUBSCRIPTION_PLANS.YEARLY.period,
      description: "Tiết kiệm chi phí với gói năm",
      features: [
        "Truy cập tất cả khóa học",
        "Hỗ trợ AI chatbot không giới hạn",
        "Báo cáo tiến độ chi tiết",
        "Hỗ trợ ưu tiên 24/7",
        "Tài liệu học tập nâng cao",
        "Luyện thi chuyên sâu",
        "Phân tích điểm mạnh/yếu",
        "Lộ trình học tập cá nhân hóa",
        `Tiết kiệm ${yearlySavings.percentage}% so với gói tháng`
      ],
      limitations: [],
      popular: true,
      savings: yearlySavings.amount,
      savingsPercentage: yearlySavings.percentage,
      buttonText: subscriptionType === SUBSCRIPTION_TYPES.PREMIUM ? "Đang sử dụng" : "Nâng cấp ngay",
      buttonDisabled: subscriptionType === SUBSCRIPTION_TYPES.PREMIUM
    }
  ];

  const handleUpgrade = async (planId) => {
    if (planId === "premium-monthly" || planId === "premium-yearly") {
      // Redirect to payment page instead of upgrading directly
      navigate(ENDPOINTS.SHARED.PAYMENT);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-9 h-9 text-blue-600" strokeWidth={2.67} />
                <h1 className="text-2xl font-bold text-black">Learnly</h1>
              </div>
            </div>
            <button
              onClick={() => navigate(ENDPOINTS.STUDENT.DASHBOARD)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Chọn gói học tập phù hợp
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Nâng cấp để trải nghiệm học tập tốt nhất với AI
          </p>
          
          {/* Current Plan Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            <Crown className="w-4 h-4" />
            Gói hiện tại: {subscriptionType === SUBSCRIPTION_TYPES.PREMIUM ? "Premium" : "Miễn phí"}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Phổ biến nhất
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                  {plan.id === "premium-yearly" && (
                    <span className="text-sm font-normal text-gray-500 ml-2">(Hàng năm)</span>
                  )}
                  {plan.id === "premium-monthly" && (
                    <span className="text-sm font-normal text-gray-500 ml-2">(Hàng tháng)</span>
                  )}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                </div>
                
                {/* Savings Badge for Yearly Plan */}
                {plan.savings && plan.savings > 0 && (
                  <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <span>💰</span>
                    Tiết kiệm {formatPrice(plan.savings)} ({plan.savingsPercentage}%)
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Tính năng bao gồm:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Hạn chế:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-gray-600 text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.buttonDisabled || isLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-200'
                } disabled:cursor-not-allowed`}
              >
                {isLoading ? "Đang xử lý..." : plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Câu hỏi thường gặp
          </h3>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">
                Tôi có thể hủy gói Premium bất cứ lúc nào không?
              </h4>
              <p className="text-gray-600">
                Có, bạn có thể hủy gói Premium bất cứ lúc nào. Tài khoản của bạn sẽ được chuyển về gói Miễn phí vào chu kỳ thanh toán tiếp theo.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">
                Gói Premium có những tính năng gì đặc biệt?
              </h4>
              <p className="text-gray-600">
                Gói Premium cung cấp truy cập không giới hạn vào AI chatbot, tất cả khóa học nâng cao, hỗ trợ ưu tiên 24/7 và phân tích học tập cá nhân hóa.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">
                Tôi có thể dùng thử gói Premium không?
              </h4>
              <p className="text-gray-600">
                Hiện tại chúng tôi chưa có chương trình dùng thử miễn phí, nhưng bạn có thể nâng cấp và hủy bất cứ lúc nào trong vòng 7 ngày đầu để được hoàn tiền.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
