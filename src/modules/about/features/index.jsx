import React from "react";
import {
  Shield,
  Users,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Target,
  Heart,
  Award,
  CheckCircle,
} from "lucide-react";
import Header from "../../../components/Header/Header";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-lozo-darker to-lozo-primary/30">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-lozo-darker/40 to-lozo-primary/20"></div>
        <div className="relative max-w-[1280px] mx-auto px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-lozo-secondary"></div>
            <span className="text-white text-sm font-medium">
              Môi trường học tập an toàn
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-normal mb-8 leading-tight">
            <span className="text-white">Về chúng tôi</span>
            <br />
            <span className="bg-gradient-to-r from-lozo-primary to-lozo-secondary bg-clip-text text-transparent">
              LozoAcademy
            </span>
          </h1>

          {/* Description */}
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-white/70 leading-relaxed">
              Chúng tôi là đội ngũ giáo viên và chuyên gia an ninh mạng đam mê,
              với sứ mệnh mang kiến thức bảo mật chất lượng cao đến với mọi học
              viên Việt Nam.
            </p>
          </div>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className="py-20 bg-gradient-to-r from-lozo-darker/30 to-black/80">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-medium text-white mb-6">
              Tầm nhìn và sứ mệnh
            </h2>
            <p className="text-xl text-white/60">
              Định hướng và giá trị cốt lõi của LozoAcademy
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Tầm nhìn
              </h3>
              <p className="text-lg text-white/70 leading-relaxed">
                Trở thành nền tảng giáo dục an ninh mạng hàng đầu Việt Nam, đóng
                góp vào việc xây dựng một thế hệ chuyên gia bảo mật có năng lực
                và đạo đức nghề nghiệp cao.
              </p>
            </div>

            {/* Mission */}
            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Sứ mệnh
              </h3>
              <p className="text-lg text-white/70 leading-relaxed">
                Cung cấp chương trình đào tạo an ninh mạng chất lượng cao, thực
                tế và cập nhật, giúp học viên phát triển kỹ năng cần thiết để
                bảo vệ thế giới số.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-center">
              <div className="w-16 h-16 mx-auto mb-7 rounded-full bg-gradient-to-r from-lozo-primary to-lozo-secondary flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Bảo mật là ưu tiên hàng đầu
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">
                Chúng tôi không chỉ dạy về bảo mật mà còn áp dụng các tiêu chuẩn
                bảo mật cao nhất trong mọi hoạt động của mình.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-center">
              <div className="w-16 h-16 mx-auto mb-7 rounded-full bg-gradient-to-r from-lozo-primary to-lozo-secondary flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Cộng đồng học tập mạnh mẽ
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">
                Xây dựng một cộng đồng chuyên gia an ninh mạng Việt Nam, nơi mọi
                người có thể học hỏi và phát triển cùng nhau.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-center">
              <div className="w-16 h-16 mx-auto mb-7 rounded-full bg-gradient-to-r from-lozo-primary to-lozo-secondary flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Đào tạo thực tế và ứng dụng
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">
                Mọi khóa học đều được thiết kế dựa trên các tình huống thực tế
                và challenge từ thế giới an ninh mạng.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-center">
              <div className="w-16 h-16 mx-auto mb-7 rounded-full bg-gradient-to-r from-lozo-primary to-lozo-secondary flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Chất lượng được công nhận
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">
                Chương trình đào tạo của chúng tôi được thiết kế bởi các chuyên
                gia hàng đầu và được công nhận bởi ngành.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 bg-gradient-to-r from-black/80 to-lozo-darker/40">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-white mb-4">
              Đội ngũ lãnh đạo
            </h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-xl text-white/60">
                Những người đam mê và tận tâm, cùng nhau xây dựng tương lai an
                toàn cho thế giới số
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 - CEO */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-lozo-primary to-lozo-secondary rounded-full shadow-lg">
                    <span className="text-white text-sm font-medium">CEO</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-1">
                  Trần Quảng Quân
                </h3>
                <p className="text-white/60 mb-3">Chief Executive Officer</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  Với hơn 8 năm kinh nghiệm trong lĩnh vực bảo mật, Quân dẫn dắt
                  LozoAcademy với tầm nhìn mang giáo dục an ninh mạng đến gần
                  hơn với mọi người.
                </p>
              </div>
            </div>

            {/* Team Member 2 - CTO */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-lozo-primary to-lozo-secondary rounded-full shadow-lg">
                    <span className="text-white text-sm font-medium">CTO</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-1">
                  Trần Quốc Bảo
                </h3>
                <p className="text-white/60 mb-3">Chief Technology Officer</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  Bảo phát triển và duy trì nền tảng học tập của LozoAcademy,
                  đảm bảo công nghệ luôn đi đầu trong lĩnh vực giáo dục trực
                  tuyến.
                </p>
              </div>
            </div>

            {/* Team Member 3 - COO */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-lozo-primary to-lozo-secondary rounded-full shadow-lg">
                    <span className="text-white text-sm font-medium">COO</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-1">
                  Nguyễn Thị Thảo Nhi
                </h3>
                <p className="text-white/60 mb-3">Chief Operating Officer</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  Nhi điều hành các hoạt động hàng ngày của công ty, đảm bảo mọi
                  quy trình đào tạo được thực hiện một cách hiệu quả và chất
                  lượng.
                </p>
              </div>
            </div>

            {/* Team Member 4 - CDO */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-lozo-primary to-lozo-secondary rounded-full shadow-lg">
                    <span className="text-white text-sm font-medium">CDO</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-1">
                  Nguyễn Thành Lộc
                </h3>
                <p className="text-white/60 mb-3">Chief Design Officer</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  Thiết kế là đam mê của Lộc. Anh tạo ra những trải nghiệm học
                  tập trực quan và thân thiện, giúp học viên dễ dàng tiếp thu
                  kiến thức.
                </p>
              </div>
            </div>

            {/* Team Member 5 - CMO */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-lozo-primary to-lozo-secondary rounded-full shadow-lg">
                    <span className="text-white text-sm font-medium">CMO</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-1">
                  Thái Lê Phương Duyên
                </h3>
                <p className="text-white/60 mb-3">Chief Marketing Officer</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  Duyên xây dựng thương hiệu LozoAcademy và kết nối với cộng
                  đồng an ninh mạng Việt Nam thông qua các chiến lược marketing
                  sáng tạo.
                </p>
              </div>
            </div>

            {/* Team Member 6 - CIO */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-lozo-primary to-lozo-secondary rounded-full shadow-lg">
                    <span className="text-white text-sm font-medium">CIO</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-1">
                  Phạm Minh Nhật
                </h3>
                <p className="text-white/60 mb-3">Chief Information Officer</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  Chuyên gia về hạ tầng công nghệ thông tin, Nhật đảm bảo các hệ
                  thống của LozoAcademy luôn vận hành ổn định và bảo mật.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-lozo-darker/40 to-black">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold text-white mb-4">
                Liên hệ với chúng tôi
              </h2>
              <p className="text-white/60">
                Hãy kết nối và cùng chúng tôi xây dựng tương lai an toàn
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Phone */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-r from-lozo-primary to-lozo-secondary flex items-center justify-center shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Điện thoại
                </h3>
                <div className="text-white/60 space-y-1">
                  <p>+84 385555040</p>
                  <p>+84 815024919</p>
                </div>
              </div>

              {/* Email */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-r from-lozo-primary to-lozo-secondary flex items-center justify-center shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Email</h3>
                <div className="text-white/60">
                  <p>lozostudio25@gmail.com</p>
                </div>
              </div>

              {/* Address */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-r from-lozo-primary to-lozo-secondary flex items-center justify-center shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Địa chỉ
                </h3>
                <div className="text-white/60">
                  <p>Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-gradient-to-b from-lozo-darker/60 to-black">
        <div className="max-w-[1536px] mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-lozo-primary" />
                <span className="text-2xl font-bold text-white">
                  LozoAcademy
                </span>
              </div>
              <p className="text-white/70 leading-relaxed">
                Trao quyền cho thế hệ chuyên gia an ninh mạng tiếp theo thông
                qua học tập thực hành và ứng dụng thực tế.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-lozo-primary/20 flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-lozo-primary/20 flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-lozo-primary/20 flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Courses */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Khóa học
              </h3>
              <ul className="space-y-2 text-white/70">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    An ninh mạng cơ bản
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Ethical Hacking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Dịch ngược mã nguồn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bảo mật Ứng dụng Web
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Điều tra số
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bảo mật Di động
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Tài nguyên
              </h3>
              <ul className="space-y-2 text-white/70">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hướng dẫn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Luyện thi chứng chỉ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hướng dẫn nghề nghiệp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Diễn đàn cộng đồng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Trung tâm hỗ trợ
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
              <div className="space-y-3 text-white/70">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4" />
                  <span>lozostudio25@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4" />
                  <span>+84 385555040 (Mr.Nhat)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4" />
                  <span>+84 815024919 (Mrs.Duyen)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4" />
                  <span>Hồ Chí Minh, Việt Nam</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-6">
                <h4 className="text-white font-medium mb-3">
                  Cập nhật tin tức
                </h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-white/50 focus:outline-none focus:border-lozo-primary"
                  />
                  <button className="px-5 py-2 bg-gradient-to-r from-lozo-primary to-lozo-secondary text-white rounded-r-lg font-medium">
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-white/60 text-sm">
                © 2024 LozoAcademy. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex space-x-6 text-sm text-white/60">
                <a href="#" className="hover:text-white transition-colors">
                  Chính sách bảo mật
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Điều khoản dịch vụ
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Chính sách Cookie
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
