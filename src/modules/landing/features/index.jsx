import { Card, CardContent } from "../components/Card";
import { Link } from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";
// import { Badge } from "../components/Badge";
import Pricing from "../components/Pricing";
import WhychooseUs from "../components/WhyChooseUs";
import bg_world from "../../../assets/images/bg_worldmap.png";
import { Avatar, AvatarFallback, AvatarImage } from "../components/Avatar";
import {
  Star,
  Play,
  Users,
  Award,
  BookOpen,
  Clock,
  Zap,
  Target,
  Headphones,
  Video,
  MessageCircle,
  GraduationCap,
  Trophy,
  Crown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <GraduationCap
                  className="w-9 h-9 text-blue-600"
                  strokeWidth={2.67}
                />
                <h1 className="text-2xl font-bold text-black">Learnly</h1>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a
                href="#chatbot-demo"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Chat với AI
              </a>
              <a
                href="#rewards"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Đổi thưởng
              </a>
              <a
                href="#courses"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Khóa học
              </a>
              <a
                href="/news"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Tin tức
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                className="text-white bg-[#366ADC] hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium transition"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>
              <button
                className="text-white bg-[#32B7FF] hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium transition"
                onClick={() => navigate("/signin")}
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg_world})` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-[#2563EB] mb-6">
              Học thông minh,
            </h2>
            <h2 className="text-5xl font-bold text-gray-600 mb-6">
              Hiểu tận gốc
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Khám phá tiềm năng của bạn với hệ thống học tập cá nhân hóa được
              hỗ trợ bởi AI. Nơi mọi câu hỏi đều có câu trả lời, mọi khái niệm
              đều trở nên rõ ràng, và mọi học sinh đều khám phá niềm vui trong
              việc hiểu biết.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                size="lg"
                className="bg-blue-600 rounded-full shadow-md hover:bg-blue-700 px-8 py-3 text-white flex items-center text-lg font-medium"
                onClick={() => navigate("/login")}
              >
                Bắt đầu Học miễn phí →
              </button>
              <button
                size="lg"
                className="px-8 py-3 border-8 border-blue-600 rounded-full flex items-center text-lg font-medium"
                onClick={() => document.getElementById('courses').scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="w-5 h-5 mr-2" />
                Xem Khóa học
              </button>
            </div>
            <div className="flex justify-center items-center gap-8 mt-12 text-sm text-gray-500">
              <span>
                <strong className="text-blue-600 text-lg">100%</strong>{" "}
                <br></br> Miễn phí bắt đầu
              </span>

              <span>
                <strong className="text-green-600 text-lg">
                  AI thông minh
                </strong>{" "}
                <br></br> Câu trả lời nhanh chóng, chính xác
              </span>
              <span>
                <strong className="text-pink-600 text-lg">24/7</strong>{" "}
                <br></br> Luôn sẵn sàng
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Tính năng Nổi bật
            </h3>
            <p className="text-lg text-gray-600">
              Khám phá những tính năng mạnh mẽ giúp Learnly trở thành nền tảng
              học tập thông minh hàng đầu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3">AI Thông minh</h4>
                <p className="text-gray-600">
                  Hệ thống AI thông minh giúp cá nhân hóa trải nghiệm học tập
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Tăng hiệu tốc</h4>
                <p className="text-gray-600">
                  Phương pháp học tập tối ưu giúp tăng hiệu quả gấp 3 lần
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Học cùng Chí</h4>
                <p className="text-gray-600">
                  Kết nối và học tập cùng hàng triệu học viên trên toàn quốc
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3">
                  Luyện đồng thọ nạp
                </h4>
                <p className="text-gray-600">
                  Luyện tập liên tục với các bài tập đa dạng và thú vị
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3">
                  Có chứng chi hinh đây
                </h4>
                <p className="text-gray-600">
                  Nhận chứng chỉ được công nhận sau khi hoàn thành khóa học
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Đồ sáng thời Chỉ</h4>
                <p className="text-gray-600">
                  Công nghệ học tập tiên tiến nhất với trải nghiệm tuyệt vời
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Được Tin tương bởi hơn của CA nước
            </h3>
            <p className="text-lg text-gray-600">
              Kết quả thực tế từ những học sinh thực sự đã thay đổi trải nghiệm
              học tập với Learnly
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                50,000+
              </div>
              <div className="text-gray-600">Học viên tham gia</div>
            </div>

            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">94%</div>
              <div className="text-gray-600">Tỷ lệ hoàn thành</div>
            </div>

            <div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                2.5 giờ
              </div>
              <div className="text-gray-600">Thời gian học mỗi ngày</div>
            </div>

            <div>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-gray-600">Hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhychooseUs />

      {/* Learning Methods Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Học tập Với đã CA phân Nói
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="w-10 h-10 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-4">Video bài học</h4>
                <p className="text-gray-600">
                  Học qua video chất lượng cao với giảng viên chuyên nghiệp
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Headphones className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-4">Lý thuyết ôn đọc</h4>
                <p className="text-gray-600">
                  Tài liệu lý thuyết phong phú và dễ hiểu
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold mb-4">
                  Phản hồi tô mời thầy hệt
                </h4>
                <p className="text-gray-600">
                  Hỗ trợ và phản hồi nhanh chóng từ đội ngũ giảng viên
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">Bạn đã sẵn sàng để</p>
            <h4 className="text-2xl font-bold text-gray-900">Bắt Đầng Học</h4>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Học sinh & Phụ huynh nói gì về Learnify
            </h3>
            <p className="text-lg text-gray-600">
              Hàng nghìn học sinh và gia đình đã tin tưởng và đạt được kết quả
              tuyệt vời với Learnly
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src="https://images2.thanhnien.vn/528068263637045248/2023/2/21/blackpink-jisoo-2-1676965715595447024457.jpg" />
                    <AvatarFallback>NT</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Nguyễn Thị An</div>
                    <div className="text-sm text-gray-500">Học sinh lớp 12</div>
                  </div>
                  <div className="flex ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">
                  &quot;Learnify đã giúp tôi cải thiện đáng kể kết quả học tập.
                  Giao diện dễ sử dụng và nội dung chất lượng cao.&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src="https://www.nme.com/wp-content/uploads/2022/02/big-bang-top-696x442.jpeg" />
                    <AvatarFallback>LV</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Lê Văn Bình</div>
                    <div className="text-sm text-gray-500">Phụ huynh</div>
                  </div>
                  <div className="flex ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">
                  &quot;Con tôi rất thích học trên Learnify. Nền tảng này thực
                  sự hiệu quả và phù hợp với trẻ em.&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src="https://kenh14cdn.com/2017/170208musikdaesung3-1486544100041.jpg" />
                    <AvatarFallback>TH</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Trần Hải</div>
                    <div className="text-sm text-gray-500">Sinh viên</div>
                  </div>
                  <div className="flex ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">
                  &quot;Tôi đã hoàn thành 5 khóa học trên Learnify và đều rất
                  hài lòng với chất lượng giảng dạy.&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src="https://townsquare.media/site/252/files/2018/07/big-bang-seungri-solo-album.jpg?w=1200&h=0&zc=1&s=0&a=t&q=89" />
                    <AvatarFallback>PM</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Phạm Minh Đức</div>
                    <div className="text-sm text-gray-500">
                      Nhân viên văn phòng
                    </div>
                  </div>
                  <div className="flex ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">
                  &quot;Learnify giúp tôi học thêm nhiều kỹ năng mới cho công
                  việc. Rất đáng để đầu tư thời gian.&quot;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing />

      {/* News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Tin tức mới nhất về E-Learning
            </h3>
            <p className="text-lg text-gray-600">
              Cập nhật những tin tức và xu hướng mới nhất trong lĩnh vực giáo
              dục
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="overflow-hidden">
              <Link to={ENDPOINTS.LANDING.NEWS}>
                <div className="aspect-video bg-gradient-to-r from-blue-400 to-blue-600"></div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">
                    AI sẽ thay đổi nền giáo dục trong thập kỷ tới
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Khám phá cách AI đang revolutionize việc học tập...
                  </p>
                  <div className="text-xs text-gray-500">15 Tháng 3, 2024</div>
                </CardContent>
              </Link>
            </Card>

            <Card className="overflow-hidden">
              <Link to={ENDPOINTS.LANDING.NEWS}>
                <div className="aspect-video bg-gradient-to-r from-green-400 to-green-600"></div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">
                    Top 10 xu hướng học trực tuyến năm 2024
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Những xu hướng mới đang thay đổi cách chúng ta học...
                  </p>
                  <div className="text-xs text-gray-500">12 Tháng 3, 2024</div>
                </CardContent>
              </Link>
            </Card>

            <Card className="overflow-hidden">
              <Link to={ENDPOINTS.LANDING.NEWS}>
                <div className="aspect-video bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">
                    Bí quyết học hiệu quả trong thời đại số
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Những phương pháp học tập được chứng minh hiệu quả...
                  </p>
                  <div className="text-xs text-gray-500">10 Tháng 3, 2024</div>
                </CardContent>
              </Link>
            </Card>

            <Card className="overflow-hidden">
              <Link to={ENDPOINTS.LANDING.NEWS}>
                <div className="aspect-video bg-gradient-to-r from-orange-400 to-orange-600"></div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">
                    Tương lai của giáo dục trực tuyến tại Việt Nam
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Phân tích thị trường và dự báo phát triển...
                  </p>
                  <div className="text-xs text-gray-500">8 Tháng 3, 2024</div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <p className="inline-block bg-white/20 text-sm px-4 py-1 rounded-full mb-6">
            🌟 Hơn 50.000 học sinh đã tin tưởng
          </p>

          <h3 className="text-4xl font-bold mb-2">Sẵn sàng Thay đổi</h3>
          <h3 className="text-4xl font-bold mb-6 text-yellow-300">
            Cách Học của bạn?
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Tham gia cùng hàng nghìn học sinh đã cải thiện điểm số và khám phá
            niềm vui học tập với Learnly AI
          </p>

          <div className="grid grid-cols-3 gap-8 mb-10">
            <div>
              <div className="text-3xl font-bold mb-1">50K+</div>
              <div className="opacity-80">Học sinh tích cực</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">94%</div>
              <div className="opacity-80">Cải thiện điểm số</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">4.9/5</div>
              <div className="opacity-80">Đánh giá trung bình</div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-medium"
            >
              Bắt đầu Miễn phí Ngay
            </button>
            <button className="border border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-full font-medium">
              Xem Demo
            </button>
          </div>

          <p className="mt-8 text-sm opacity-80">
            Được tin tưởng bởi các trường hàng đầu Việt Nam: <br />
            <span className="font-medium">THCS Nguyễn Du</span>,{" "}
            <span className="font-medium">THCS Lê Quý Đôn</span>,{" "}
            <span className="font-medium">THCS Trần Hưng Đạo</span>,{" "}
            <span className="font-medium">THCS Chu Văn An</span>
          </p>
          <p className="text-xs mt-2 opacity-70">
            Miễn phí 100% để bắt đầu • Không cần thẻ tín dụng • Hỗ trợ 24/7
          </p>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Khóa học phổ biến
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá các khóa học được yêu thích nhất, được thiết kế đặc biệt cho học sinh Việt Nam
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Course 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded">Toán học</span>
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded">Lớp 6-9</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Toán học cơ bản</h3>
                <p className="text-gray-600 mb-4">Nắm vững kiến thức toán học từ cơ bản đến nâng cao với phương pháp học tập hiệu quả</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.8 (1,234 đánh giá)</span>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Học ngay
                  </button>
                </div>
              </div>
            </div>

            {/* Course 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <GraduationCap className="w-16 h-16 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded">Vật lý</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded">Lớp 7-9</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Vật lý thực hành</h3>
                <p className="text-gray-600 mb-4">Khám phá thế giới vật lý qua các thí nghiệm và bài tập thực tế</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.7 (856 đánh giá)</span>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Học ngay
                  </button>
                </div>
              </div>
            </div>

            {/* Course 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <MessageCircle className="w-16 h-16 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded">Ngữ văn</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded">Lớp 6-9</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ngữ văn sáng tạo</h3>
                <p className="text-gray-600 mb-4">Phát triển kỹ năng viết và phân tích văn học một cách sáng tạo</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.9 (2,156 đánh giá)</span>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Học ngay
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Xem tất cả khóa học
            </button>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section id="rewards" className="py-20 bg-gradient-to-br from-yellow-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Hệ thống đổi thưởng
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Học tập tích cực, tích lũy điểm thưởng và đổi lấy những phần quà hấp dẫn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Reward 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Điểm học tập</h3>
              <p className="text-gray-600 mb-4">Tích lũy điểm khi hoàn thành bài học và đạt điểm cao</p>
              <div className="text-2xl font-bold text-yellow-600">1,000 điểm</div>
            </div>

            {/* Reward 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Huy hiệu thành tích</h3>
              <p className="text-gray-600 mb-4">Thu thập các huy hiệu đặc biệt khi đạt mốc học tập</p>
              <div className="text-2xl font-bold text-blue-600">15 huy hiệu</div>
            </div>

            {/* Reward 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quà tặng đặc biệt</h3>
              <p className="text-gray-600 mb-4">Đổi điểm lấy sách, dụng cụ học tập và nhiều phần quà khác</p>
              <div className="text-2xl font-bold text-green-600">50+ quà</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/login")}
              className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Đăng nhập để đổi thưởng
            </button>
          </div>
        </div>
      </section>

      {/* AI Chatbot Demo Section */}
      <section id="chatbot-demo" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trải nghiệm AI Chatbot
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá sức mạnh của AI trong việc hỗ trợ học tập. Chat với AI để được giải đáp mọi thắc mắc về bài học.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">AI Assistant</h3>
                  <p className="text-gray-500">Trợ lý học tập thông minh</p>
                </div>
              </div>

              {/* Demo Chat Interface */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="space-y-4">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs">
                      Giải thích cho tôi về định lý Pythagore
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-white border rounded-lg px-4 py-2 max-w-xs">
                      <p className="text-gray-800">
                        Định lý Pythagore là một trong những định lý cơ bản nhất trong hình học. 
                        Nó phát biểu rằng trong một tam giác vuông, bình phương của cạnh huyền 
                        bằng tổng bình phương của hai cạnh góc vuông: a² + b² = c²
                      </p>
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs">
                      Có thể cho ví dụ cụ thể không?
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-white border rounded-lg px-4 py-2 max-w-xs">
                      <p className="text-gray-800">
                        Chắc chắn! Ví dụ: Nếu tam giác có hai cạnh góc vuông là 3cm và 4cm, 
                        thì cạnh huyền sẽ là √(3² + 4²) = √(9 + 16) = √25 = 5cm
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Phản hồi nhanh</h4>
                  <p className="text-gray-600 text-sm">AI trả lời ngay lập tức</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Giải thích chi tiết</h4>
                  <p className="text-gray-600 text-sm">Từng bước rõ ràng</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Đa môn học</h4>
                  <p className="text-gray-600 text-sm">Toán, Lý, Hóa, Văn...</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Đăng nhập để trải nghiệm AI Chatbot
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Learnly */}
            <div>
              <h1 className="text-2xl font-bold text-blue-400 mb-4">Learnly</h1>
              <p className="text-gray-400 mb-4">
                Học Thông minh, Hiểu Sâu sắc. Trao quyền cho học sinh lớp 6-9
                với giáo dục cá nhân hóa được hỗ trợ bởi AI.
              </p>
            </div>

            {/* Khóa học nổi bật */}
            <div>
              <h4 className="font-semibold mb-4">Khóa học Nổi bật</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Toán học
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Tiếng Anh
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Khoa học
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Văn học
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Lịch sử
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Địa lý
                  </a>
                </li>
              </ul>
            </div>

            {/* Hỗ trợ học tập */}
            <div>
              <h4 className="font-semibold mb-4">Dịch vụ Hỗ trợ Học tập</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Tin tức Giáo dục
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Sự kiện Học tập
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Diễn đàn Học sinh
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Mẹo Học tập
                  </a>
                </li>
              </ul>
            </div>

            {/* Liên hệ */}
            <div>
              <h4 className="font-semibold mb-4">Đối tác & Liên hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 contact.learnly@gmail.com</li>
                <li>📞 +84 783 624 814</li>
                <li>📍 Thành phố Hồ Chí Minh, Việt Nam</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 Learnly. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">
                Điều khoản sử dụng
              </a>
              <a href="#" className="hover:text-white">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-white">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
