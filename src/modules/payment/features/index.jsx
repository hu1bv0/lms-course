import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";
import { GraduationCapIcon, Upload, X, Check, Crown, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";
import { SUBSCRIPTION_TYPES } from "../../../services/firebase";
import { legacyAuthService as authService } from "../../../services/firebase";
import { uploadImageToCloudinary } from "../../../configs/cloudinary.config";
import { SUBSCRIPTION_PLANS, formatPrice } from "../../../constants/pricingConstants";

const PaymentUpgrade = () => {
  const navigate = useNavigate();
  const { userData, updateSubscription } = useAuth();
  const fileInputRef = useRef(null);
  
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // QR Code image - sử dụng QR code thật từ public folder
  const qrCodeImage = "/qr_payment.jpeg";

  const plans = {
    monthly: SUBSCRIPTION_PLANS.MONTHLY,
    yearly: SUBSCRIPTION_PLANS.YEARLY
  };

  const currentPlan = plans[selectedPlan];


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File quá lớn! Vui lòng chọn file nhỏ hơn 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Vui lòng chọn file ảnh!");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          file: file,
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const handleCompletePayment = async () => {
    if (!uploadedImage) {
      toast.error("Vui lòng upload ảnh xác nhận thanh toán!");
      return;
    }

    setIsLoading(true);
    try {
      // Upload image to Cloudinary first
      toast.info("Đang upload ảnh xác nhận...", {
        position: "top-right",
        autoClose: 2000,
      });

      const uploadResult = await uploadImageToCloudinary(uploadedImage.file);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload ảnh thất bại");
      }

      // Create transaction for admin approval
      const transactionData = {
        userId: userData.uid,
        userEmail: userData.email,
        userName: userData.displayName,
        planType: SUBSCRIPTION_TYPES.PREMIUM,
        planName: currentPlan.name,
        amount: currentPlan.price,
        period: currentPlan.period,
        paymentProof: uploadResult.url, // Store Cloudinary URL
        status: 'pending', // pending, approved, rejected
        createdAt: new Date().toISOString(),
        paymentMethod: 'bank_transfer'
      };

      // Save transaction to Firebase
      await authService.createTransaction(transactionData);
      
      toast.success("Đã gửi yêu cầu nâng cấp! Admin sẽ duyệt trong vòng 24h.", {
        position: "top-right",
        autoClose: 5000,
      });
      
      navigate(ENDPOINTS.STUDENT.DASHBOARD);
    } catch (error) {
      console.error("Payment upgrade error:", error);
      toast.error("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(ENDPOINTS.SHARED.SUBSCRIPTION)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-lg font-medium">Quay lại</span>
              </button>
              <div className="w-px h-6 bg-gray-300 mx-4"></div>
              <div className="flex items-center gap-3">
                <GraduationCapIcon className="w-9 h-9 text-blue-600" strokeWidth={2.67} />
                <h1 className="text-2xl font-bold text-black">Learnly</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Thanh toán nâng cấp Gold
          </h2>
          <p className="text-lg text-gray-600">
            Hoàn tất thanh toán để nâng cấp tài khoản
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Thông tin thanh toán
            </h3>

            {/* Service Package */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gói dịch vụ
              </label>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                <Crown className="w-4 h-4" />
                Premium Member
              </div>
            </div>

            {/* Plan Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Chọn gói
              </label>
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedPlan("monthly")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition ${
                    selectedPlan === "monthly"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-900">{plans.monthly.name}</div>
                      <div className="text-sm text-gray-600">{plans.monthly.displayPrice}</div>
                    </div>
                    {selectedPlan === "monthly" && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setSelectedPlan("yearly")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition ${
                    selectedPlan === "yearly"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-900">{plans.yearly.name}</div>
                      <div className="text-sm text-gray-600">{plans.yearly.displayPrice}</div>
                      <div className="text-xs text-green-600">Tiết kiệm {plans.yearly.savings.toLocaleString('vi-VN')}₫</div>
                    </div>
                    {selectedPlan === "yearly" && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </button>
              </div>
            </div>


            {/* Price Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Giá gốc:</span>
                <span className="text-gray-900">{formatPrice(currentPlan.originalPrice)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-semibold text-blue-600">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(currentPlan.price)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Confirmation */}
          <div className="space-y-6">
            {/* QR Code and Upload */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Xác nhận thanh toán
              </h3>
              
              {/* QR Code Display */}
              <div className="text-center mb-6">
                <div className="inline-block p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                  <img 
                    src={qrCodeImage} 
                    alt="QR Code thanh toán" 
                    className="w-56 h-56 mx-auto rounded-lg"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-lg font-semibold text-gray-900">
                    Quét mã QR để thanh toán
                  </p>
                  <p className="text-sm text-gray-600">
                    Sử dụng ứng dụng ngân hàng để quét mã QR
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                    <p className="text-sm text-blue-800 font-medium">
                      💡 Sau khi thanh toán thành công, hãy upload ảnh xác nhận bên dưới
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Payment Proof */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📸 Upload ảnh xác nhận thanh toán
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Vui lòng upload ảnh chụp màn hình hoặc ảnh biên lai thanh toán
                </p>
                
                {uploadedImage ? (
                  <div className="relative">
                    <img 
                      src={uploadedImage.preview} 
                      alt="Payment proof" 
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Click để upload ảnh xác nhận</p>
                    <p className="text-sm text-gray-500">PNG, JPG tối đa 5MB</p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <button
                onClick={handleCompletePayment}
                disabled={!uploadedImage || isLoading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang gửi yêu cầu...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Gửi yêu cầu nâng cấp
                  </div>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Bằng cách nhấn "Gửi yêu cầu nâng cấp", bạn đồng ý với các điều khoản sử dụng
              </p>
            </div>

            {/* Premium Member Benefits */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Quyền lợi Premium Member
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Truy cập đầy đủ tính năng chatbot AI</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Khóa học nâng cao không giới hạn</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Hỗ trợ ưu tiên 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Phân tích học tập cá nhân hóa</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Lộ trình học tập tối ưu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentUpgrade;
