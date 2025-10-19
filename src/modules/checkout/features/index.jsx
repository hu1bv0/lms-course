// import { Card, CardContent } from "../components/Card";
// import { RadioGroup, RadioGroupItem } from "../components/RadioGroup";
// import { Checkbox } from "../components/Checkbox";
// import {
//   ArrowLeft,
//   Shield,
//   Clock,
//   Check,
//   CreditCard,
//   Building,
//   Crown,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// export default function Payment() {
//   const navigate = useNavigate();
//   const [selectedPayment, setSelectedPayment] = useState("credit-card");
//   const [cardNumber, setCardNumber] = useState("");
//   const [expiryDate, setExpiryDate] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [agreeTerms, setAgreeTerms] = useState(false);

//   const handlePayment = (e) => {
//     e.preventDefault();
//     // Handle payment processing
//     console.log("Processing payment...");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#F1F4FD] to-[#F1F4FD]/40">
//       {/* Header */}
//       <header className="bg-white shadow-lg h-[60px] flex items-center px-4 md:px-8">
//         <div className="flex items-center gap-2">
//           <button
//             size="sm"
//             onClick={() => navigate("/dashboard")}
//             className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span className="text-lg font-medium">Quay lại dashboard</span>
//           </button>
//         </div>
//       </header>

//       <div className="container mx-auto px-4 py-8 max-w-7xl">
//         {/* Page Title */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-black mb-2">
//             Hoàn tất thanh toán
//           </h1>
//           <p className="text-gray-600">
//             Chỉ còn một bước nữa để nâng cấp tài khoản của bạn
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Payment Form */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Selected Package */}
//             <Card className="bg-white/70 backdrop-blur-sm border border-blue-200">
//               <CardContent className="p-6">
//                 <h2 className="text-2xl font-bold text-black mb-6">
//                   Gói đã chọn
//                 </h2>

//                 <div className="border-2 border-blue-500 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <div className="w-15 h-15 bg-blue-600 rounded-2xl flex items-center justify-center">
//                         <Crown className="w-8 h-8 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-xl font-bold text-black">
//                           Gói Premium
//                         </h3>
//                         <p className="text-gray-600">Thanh toán hàng tháng</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-3xl font-bold text-black">
//                         69.000 VND
//                       </div>
//                       <div className="text-gray-600">/tháng</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Period Toggle */}
//                 <div className="flex justify-center mt-6">
//                   <div className="bg-gray-200/40 rounded-2xl p-2 inline-flex">
//                     <button className="bg-white/70 rounded-xl px-8 py-3 text-black font-medium">
//                       Hàng tháng
//                     </button>
//                     <button className="px-8 py-3 text-gray-500 font-medium">
//                       Hàng năm
//                     </button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Payment Methods */}
//             <Card className="bg-white/70 backdrop-blur-sm border shadow-lg">
//               <CardContent className="p-6">
//                 <h2 className="text-2xl font-bold text-black mb-6">
//                   Phương thức thanh toán
//                 </h2>

//                 <RadioGroup
//                   value={selectedPayment}
//                   onValueChange={setSelectedPayment}
//                   className="space-y-4"
//                 >
//                   {/* MoMo */}
//                   <div className="relative">
//                     <label htmlFor="momo" className="block cursor-pointer">
//                       <div className="border-2 border-gray-100 rounded-2xl p-4 bg-blue-50/50 hover:bg-blue-100/50 transition-colors">
//                         <div className="flex items-center gap-4">
//                           <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
//                             <span className="text-white font-bold text-sm">
//                               M
//                             </span>
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="font-semibold text-black">
//                               Ví MoMo
//                             </h3>
//                             <p className="text-sm text-gray-600">
//                               Thanh toán nhanh chóng với ví điện tử MoMo
//                             </p>
//                           </div>
//                           <RadioGroupItem value="momo" id="momo" />
//                         </div>
//                       </div>
//                     </label>
//                     <div className="absolute top-2 right-2">
//                       <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
//                         Phổ biến
//                       </span>
//                     </div>
//                   </div>

//                   {/* Bank Transfer */}
//                   <label htmlFor="bank" className="block cursor-pointer">
//                     <div className="border-2 border-gray-100 rounded-2xl p-4 bg-blue-50/50 hover:bg-blue-100/50 transition-colors">
//                       <div className="flex items-center gap-4">
//                         <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
//                           <Building className="w-6 h-6 text-white" />
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-black">
//                             Chuyển khoản Ngân hàng
//                           </h3>
//                           <p className="text-sm text-gray-600">
//                             Chuyển khoản qua Internet Banking hoặc ATM
//                           </p>
//                         </div>
//                         <RadioGroupItem value="bank" id="bank" />
//                       </div>
//                     </div>
//                   </label>

//                   {/* Credit Card */}
//                   <label htmlFor="credit-card" className="block cursor-pointer">
//                     <div className="border-2 border-blue-500 rounded-2xl p-4 bg-blue-50/50">
//                       <div className="flex items-center gap-4">
//                         <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
//                           <CreditCard className="w-6 h-6 text-white" />
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-black">
//                             Thẻ tín dụng/Ghi nợ
//                           </h3>
//                           <p className="text-sm text-gray-600">
//                             Visa, Mastercard, JCB được hỗ trợ
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Check className="w-5 h-5 text-blue-600" />
//                           <RadioGroupItem
//                             value="credit-card"
//                             id="credit-card"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </label>

//                   {/* ZaloPay */}
//                   <label htmlFor="zalopay" className="block cursor-pointer">
//                     <div className="border-2 border-gray-100 rounded-2xl p-4 bg-blue-50/50 hover:bg-blue-100/50 transition-colors">
//                       <div className="flex items-center gap-4">
//                         <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//                           <span className="text-white font-bold text-sm">
//                             Z
//                           </span>
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-black">ZaloPay</h3>
//                           <p className="text-sm text-gray-600">
//                             Thanh toán với ví điện tử ZaloPay
//                           </p>
//                         </div>
//                         <RadioGroupItem value="zalopay" id="zalopay" />
//                       </div>
//                     </div>
//                   </label>
//                 </RadioGroup>

//                 {/* Card Details Form */}
//                 {selectedPayment === "credit-card" && (
//                   <div className="mt-6 space-y-4">
//                     <h3 className="text-sm font-semibold text-black">
//                       Thông tin thẻ
//                     </h3>

//                     {/* Supported Cards */}
//                     <div className="flex gap-2 mb-4">
//                       <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
//                         V
//                       </div>
//                       <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">
//                         M
//                       </div>
//                       <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center">
//                         J
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label
//                           htmlFor="cardNumber"
//                           className="text-sm text-black"
//                         >
//                           Số thẻ
//                         </label>
//                         <input
//                           id="cardNumber"
//                           placeholder="0000 0000 0000 0000"
//                           value={cardNumber}
//                           onChange={(e) => setCardNumber(e.target.value)}
//                           className="mt-1"
//                         />
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label
//                             htmlFor="expiry"
//                             className="text-sm text-black"
//                           >
//                             Ngày hết hạn
//                           </label>
//                           <input
//                             id="expiry"
//                             placeholder="MM/YY"
//                             value={expiryDate}
//                             onChange={(e) => setExpiryDate(e.target.value)}
//                             className="mt-1"
//                           />
//                         </div>
//                         <div>
//                           <label htmlFor="cvv" className="text-sm text-black">
//                             Mã bảo mật
//                           </label>
//                           <input
//                             id="cvv"
//                             placeholder="CVV"
//                             value={cvv}
//                             onChange={(e) => setCvv(e.target.value)}
//                             className="mt-1"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Customer Information */}
//                 <div className="mt-8 space-y-4">
//                   <h3 className="text-base font-medium text-black">
//                     Thông tin khách hàng
//                   </h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="fullName" className="text-sm text-black">
//                         Họ và tên *
//                       </label>
//                       <input
//                         id="fullName"
//                         value={fullName}
//                         onChange={(e) => setFullName(e.target.value)}
//                         className="mt-1"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="phone" className="text-sm text-black">
//                         Số điện thoại *
//                       </label>
//                       <input
//                         id="phone"
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                         className="mt-1"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="email" className="text-sm text-black">
//                       Email *
//                     </label>
//                     <input
//                       id="email"
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="mt-1"
//                       required
//                     />
//                   </div>

//                   <div className="flex items-start gap-2 mt-4">
//                     <Checkbox
//                       id="terms"
//                       checked={agreeTerms}
//                       onCheckedChange={setAgreeTerms}
//                       className="mt-1"
//                     />
//                     <label
//                       htmlFor="terms"
//                       className="text-xs text-gray-700 leading-relaxed"
//                     >
//                       Tôi đồng ý với{" "}
//                       <a href="#" className="text-blue-600 hover:underline">
//                         Điều khoản dịch vụ
//                       </a>{" "}
//                       và{" "}
//                       <a href="#" className="text-blue-600 hover:underline">
//                         Chính sách bảo mật
//                       </a>
//                     </label>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column - Order Summary */}
//           <div className="lg:col-span-1">
//             <Card className="bg-white/70 backdrop-blur-sm border sticky top-8">
//               <CardContent className="p-6">
//                 <h2 className="text-2xl font-bold text-black mb-6">
//                   Tóm tắt đơn hàng
//                 </h2>

//                 <div className="space-y-4 mb-6">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Gói Premium</span>
//                     <span className="font-semibold">69.000 VND</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">VAT (10%)</span>
//                     <span className="text-gray-600">6.900 VND</span>
//                   </div>
//                   <div className="border-t border-gray-200 pt-4">
//                     <div className="flex justify-between font-bold text-xl">
//                       <span>Tổng cộng</span>
//                       <span className="text-blue-600">75.900 VND</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Features */}
//                 <div className="space-y-3 mb-6">
//                   <h3 className="font-medium text-black">Bao gồm:</h3>
//                   {[
//                     "Truy cập AI nâng cao không giới hạn",
//                     "Không giới hạn tài liệu, bài tập, video",
//                     "Theo dõi tiến độ và gửi báo cáo",
//                     "Hỗ trợ ưu tiên 24/7",
//                   ].map((feature, index) => (
//                     <div key={index} className="flex items-start gap-2">
//                       <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//                       <span className="text-sm text-gray-600">{feature}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Security Features */}
//                 <div className="bg-gray-100/50 rounded-xl p-4 space-y-3 mb-6">
//                   <div className="flex items-center gap-3">
//                     <Shield className="w-5 h-5 text-gray-500" />
//                     <span className="text-sm text-gray-600">
//                       Thanh toán được bảo mật bởi SSL 256-bit
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <Clock className="w-5 h-5 text-gray-500" />
//                     <span className="text-sm text-gray-600">
//                       Hủy bất cứ lúc nào, không ràng buộc
//                     </span>
//                   </div>
//                 </div>

//                 {/* Payment button */}
//                 <button
//                   onClick={handlePayment}
//                   disabled={!agreeTerms}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
//                 >
//                   Thanh toán 75.900 VND
//                 </button>

//                 <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
//                   Bằng cách thanh toán, bạn hãy xác nhận đã đọc và đồng ý với
//                   các điều khoản của chúng tôi.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { Check, CreditCard, Building, Crown } from "lucide-react";
import momologo from "../../../assets/icons/momo.png";
import zalopaylogo from "../../../assets/icons/zalopay.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const orderData = {
  package: {
    id: "premium",
    name: "Gói Premium",
    description: "Thanh toán hàng tháng",
    price: 69000,
    unit: "VND",
    billingCycle: "/tháng",
  },
  vatRate: 0.1, // 10%
};

export default function Payment() {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { package: pkg, vatRate } = orderData;
  const vatAmount = pkg.price * vatRate;
  const total = pkg.price + vatAmount;

  const handlePayment = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Bạn cần đồng ý điều khoản trước khi thanh toán.");
      return;
    }
    console.log("Processing payment with:", {
      selectedPayment,
      cardNumber,
      expiryDate,
      cvv,
      fullName,
      phone,
      email,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F4FD] to-[#F1F4FD]/40">
      {/* Header */}
      {/* <header className="bg-white shadow h-[60px] flex items-center px-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại Dashboard</span>
        </button>
      </header> */}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Hoàn tất thanh toán
          </h1>
          <p className="text-gray-600">
            Chỉ còn một bước nữa để nâng cấp tài khoản của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Gói đã chọn</h2>
              <div className="border-2 border-blue-500 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{pkg.name}</h3>
                    <p className="text-gray-600">T{pkg.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-black">
                    {pkg.price.toLocaleString()} {pkg.unit}
                  </div>
                  <div className="text-gray-600">{pkg.billingCycle}</div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold mb-6">
                Phương thức thanh toán
              </h2>

              <div className="space-y-4">
                {[
                  {
                    id: "momo",
                    label: "Ví MoMo",
                    desc: "Thanh toán qua ví MoMo",
                    icon: (
                      <img src={momologo} className="w-6 h-6 text-pink-500" />
                    ),
                  },
                  {
                    id: "bank",
                    label: "Chuyển khoản",
                    desc: "Chuyển khoản qua ngân hàng",
                    icon: <Building className="w-6 h-6 text-blue-500" />,
                  },
                  {
                    id: "credit-card",
                    label: "Thẻ tín dụng/Ghi nợ",
                    desc: "Visa, Mastercard, JCB được hỗ trợ",
                    icon: <CreditCard className="w-6 h-6 text-indigo-500" />,
                  },
                  {
                    id: "zalopay",
                    label: "ZaloPay",
                    desc: "Thanh toán qua ZaloPay",
                    icon: (
                      <img
                        src={zalopaylogo}
                        className="w-6 h-6 text-green-500"
                      />
                    ),
                  },
                ].map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-between transition ${
                      selectedPayment === method.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {method.icon}
                      <div>
                        <p className="font-semibold">{method.label}</p>
                        <p className="text-sm text-gray-500">{method.desc}</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                      className="w-5 h-5 accent-blue-600"
                    />
                  </div>
                ))}
              </div>

              {/* Card Form */}
              {selectedPayment === "credit-card" && (
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium text-black">Thông tin thẻ</h3>
                  <input
                    placeholder="Số thẻ"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Customer Info */}
              <div className="mt-8 space-y-4">
                <h3 className="font-medium text-black">Thông tin khách hàng</h3>
                <input
                  placeholder="Họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  placeholder="Số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Chính sách bảo mật
                  </a>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column */}
          {/* Right Column */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8 h-fit">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

            {/* Giá */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{pkg.name}</span>
                <span>
                  {pkg.price.toLocaleString()} {pkg.unit}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT ({vatRate * 100}%)</span>
                <span>
                  {vatAmount.toLocaleString()} {pkg.unit}
                </span>
              </div>
            </div>

            <hr className="my-3" />

            {/* Tổng cộng */}
            <div className="flex justify-between font-bold text-lg text-blue-600 mb-4">
              <span>Tổng cộng</span>
              <span>
                {total.toLocaleString()} {pkg.unit}
              </span>
            </div>

            {/* Bao gồm */}
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Truy cập AI nâng cao không giới hạn
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Không giới hạn tài liệu, bài tập, video
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Theo dõi tiến độ & gửi báo cáo
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Hỗ trợ ưu tiên 24/7
              </li>
            </ul>

            {/* Nút thanh toán */}
            <button
              onClick={handlePayment}
              disabled={!agreeTerms}
              className={`w-full py-3 font-semibold text-white rounded-lg transition ${
                agreeTerms
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Thanh toán {total.toLocaleString()} {pkg.unit}
            </button>

            {/* Lưu ý */}
            <p className="text-xs text-gray-500 text-center mt-3">
              Thanh toán được bảo mật bởi SSL 256-bit <br />
              Hủy bất cứ lúc nào, không ràng buộc
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
