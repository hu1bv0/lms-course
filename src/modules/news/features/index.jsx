import { ArrowLeft, Calendar, Clock, Share2, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black/50 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xl">Quay lại</span>
          </button>
        </div>
      </header>

      {/* Main Article */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Category Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600/20 mb-6">
          <span className="text-blue-600 text-lg font-medium">Công nghệ</span>
        </div>

        {/* Article Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
          Xu hướng định hình giáo dục 2025
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-black/70 mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="none">
              <path d="M15.8346 17.5V15.8333C15.8346 14.9493 15.4834 14.1014 14.8583 13.4763C14.2332 12.8512 13.3854 12.5 12.5013 12.5H7.5013C6.61725 12.5 5.7694 12.8512 5.14428 13.4763C4.51916 14.1014 4.16797 14.9493 4.16797 15.8333V17.5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.0013 9.16667C11.8423 9.16667 13.3346 7.67428 13.3346 5.83333C13.3346 3.99238 11.8423 2.5 10.0013 2.5C8.16035 2.5 6.66797 3.99238 6.66797 5.83333C6.66797 7.67428 8.16035 9.16667 10.0013 9.16667Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>TS. Bùi Minh Hiếu</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>15 tháng 1, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>8 phút đọc</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="flex items-center gap-2 hover:text-black transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Chia sẻ</span>
            </button>
            <button className="flex items-center gap-2 hover:text-black transition-colors">
              <Bookmark className="w-5 h-5" />
              <span>Lưu</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-black/20 mb-6"></div>

        {/* Lead paragraph */}
        <p className="text-xl font-bold text-black mb-8 leading-relaxed">
          GD&TĐ - Vào năm 2025, giáo dục sẽ chuyển đổi nhờ vào các công nghệ đột phá như trí tuệ nhân tạo và nhu cầu của thị trường lao động đang thay đổi.
        </p>

        {/* Main Image */}
        <div className="mb-6">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/47d4e1c17ebb61e819d82e8653bca8b038cc7b13?width=1503" 
            alt="Học sinh học tập với công nghệ"
            className="w-full h-auto rounded-lg"
          />
          <p className="text-black text-center mt-2">
            Giáo dục năm 2025 sẽ thay đổi từ truyền thống sang lấy người học làm trung tâm.
          </p>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none space-y-6 text-justify">
          <p className="text-lg leading-relaxed">
            Lấy con người làm trung tâm, học tập suốt đời, học tập cá nhân hóa là những xu hướng giáo dục sẽ phát triển mạnh mẽ trong năm 2025 nhờ sự phổ biến của các công nghệ đột phá.
          </p>
          <p className="text-lg leading-relaxed">
            Vào năm 2025, giáo dục sẽ chuyển đổi nhờ vào các công nghệ đột phá như trí tuệ nhân tạo và nhu cầu của thị trường lao động đang thay đổi. Mô hình giáo dục truyền thống dành cho thanh thiếu niên được cho là không còn phù hợp với xã hội, nơi sự thay đổi diễn ra với tốc độ chóng mặt. Trong khi đó, các kĩ năng như trí tuệ cảm xúc và giao tiếp, đôi khi bị bỏ qua trong các mô hình giáo dục truyền thống, đang ngày càng trở nên quan trọng.
          </p>

          {/* Section: Lấy con người làm trung tâm */}
          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            Lấy con người làm trung tâm
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <p className="text-lg leading-relaxed">
                Máy móc có thể làm tốt hơn con người trong một số lĩnh vực như phân tích xu hướng, xử lí số liệu và làm báo cáo hành chính. Điều này đồng nghĩa giáo viên có thể giao những nhiệm vụ cơ học này cho máy móc và tập trung vào việc đào tạo kĩ năng mềm cho học sinh như tư duy phản biện, tư duy chiến lược, giao tiếp, trí tuệ cảm xúc, lãnh đạo hay kĩ năng làm việc nhóm.
              </p>
              <p className="text-lg leading-relaxed mt-4">
                Công nghệ giúp giáo viên có thêm nhiều thời gian hơn. Trong năm 2025, họ được kì vọng sẽ tập trung vào tương tác với học sinh ở thế giới thực. Những kĩ năng mềm nêu trên cũng là những yếu tố quan trọng cần có để con người làm nên sự khác biệt trong thời đại AI.
              </p>
            </div>
            <div className="border border-orange-600 bg-amber-500/17 p-4 rounded-lg bg-orange-50">
              <p className="text-lg leading-relaxed">
                Lấy ví dụ tại Trung Quốc, đất nước đi đầu trong chuyển đổi công nghệ và chuyển đổi xanh. Bộ Giáo dục Trung Quốc đã thành lập trường đại học dành cho người lớn tuổi nhằm đối phó với tình trạng già hóa dân số và xây dựng xã hội học tập suốt đời. Người cao tuổi có thể học trực tiếp các môn như nhiếp ảnh, hội họa, thiết kế. Người trưởng thành còn đang đi làm có thể đăng kí học online hoặc nhận mô-đun tự học tại nhà. (mục Học tập suốt đời)
              </p>
            </div>
          </div>

          {/* Section: Trí tuệ nhân tạo trong lớp học */}
          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            Trí tuệ nhân tạo trong lớp học
          </h2>
          
          <p className="text-lg leading-relaxed">
            Trí tuệ nhân tạo tạo sinh (GenAI) có thể tạo ra nội dung và ý tưởng mới như cuộc trò chuyện, câu chuyện, hình ảnh, video và âm nhạc. GenAI có thể học ngôn ngữ của con người, ngôn ngữ lập trình, nghệ thuật, hoá học, sinh học hoặc bất kì lĩnh vực phức tạp nào. GenAI sử dụng lại kiến thức đã có để giải quyết các vấn đề mới.
          </p>
          
          <p className="text-lg leading-relaxed">
            GenAI đang xuất hiện ở khắp mọi nơi và vào năm 2025, trường học cũng không phải ngoại lệ. Việc tự học cách sử dụng AI và hướng dẫn học sinh, sinh viên sử dụng AI sẽ giúp giáo viên làm việc hiệu quả hơn. Khi học cách sử dụng GenAI, họ sẽ tìm thấy những ứng dụng cho nó trong việc dạy và học.
          </p>

          <p className="text-lg leading-relaxed">
            Đơn cử, giáo viên sẽ sử dụng AI để chấm điểm, nhận xét bài tập cho từng cá nhân, xây dựng kế hoạch học tập riêng cho từng nhóm học sinh. Về phía học sinh, cần được hướng dẫn cách sử dụng GenAI an toàn, đúng thời điểm.
          </p>

          <p className="text-lg leading-relaxed">
            Trong năm 2025, Trung Quốc sẽ đẩy mạnh giáo dục AI tại các trường tiểu học và trung học. Mục tiêu nhằm xây dựng nền tảng kiến thức vững chắc về AI cho thế hệ trẻ, từ đó khuyến khích sự sáng tạo và phát triển tư duy phản biện.
          </p>
          <p className="text-lg leading-relaxed">
            Theo thông báo, học sinh tiểu học sẽ bắt đầu học với AI qua các hoạt động khám phá và trải nghiệm công nghệ, giúp các em làm quen với các khái niệm cơ bản. Ở cấp THCS, học sinh sẽ tiếp cận việc áp dụng AI vào các bài học thực tiễn, trong khi học sinh THPT sẽ xây dựng các dự án và ứng dụng nâng cao, giúp các em hiểu rõ hơn về tiềm năng của AI trong từng ngành nghề.
          </p>
          <p className="text-lg leading-relaxed">
            Ngoài ra, trường học được khuyến khích tích hợp giáo dục AI vào các hoạt động sau giờ học và sáng kiến nghiên cứu. Giáo viên cần ưu tiên nâng cao chất lượng đào tạo qua các cơ sở giáo dục AI và giảm khoảng cách giáo dục giữa thành thị và nông thôn. Cụ thể, các trường học ở khu vực nông thôn sẽ được hỗ trợ để có cơ hội tiếp cận với các tài nguyên giáo dục AI hiện đại.
          </p>

          <div className="my-8">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/79c7ccb47aa915dfa93fc46dbb91a83cfa5bfbdb?width=1498" 
              alt="Trường học tích hợp AI"
              className="w-full h-auto rounded-lg"
            />
            <p className="text-black text-center mt-2">
              Trường học tích hợp AI trong giảng dạy và nghiên cứu.
            </p>
          </div>

          {/* Section: Học tập cá nhân hóa */}
          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            Học tập cá nhân hóa
          </h2>
          
          <p className="text-lg leading-relaxed">
            Mỗi người học có tốc độ và phương thức tiếp thu thông tin khác nhau. Một số tiếp thu kiến thức tốt từ video, số khác thích thảo luận nhóm hoặc làm dự án học tập. Học tập cá nhân hóa hứa hẹn sẽ mang lại những trải nghiệm giáo dục phù hợp, đáp ứng thế mạnh của từng học sinh.
          </p>

          <p className="text-lg leading-relaxed">
            Để &quot;cá nhân hóa&quot; học tập, giáo án, phương pháp đánh giá và tài liệu học tập cần được thiết kế riêng. Vào năm 2025, trên thế giới, các công cụ giúp người học tự phát triển năng lực cá nhân sẽ ngày càng phổ biến như gia sư online, công cụ học tập riêng online, giáo trình cá nhân hóa…
          </p>
          <p className="text-lg leading-relaxed">
            Với xu hướng này, giáo viên cần phải thay đổi phương pháp giảng dạy và tiếp cận học sinh. Thay vì “thầy đọc, trò chép”, giáo viên có thể yêu cầu học sinh chủ động tìm hiểu kiến thức bằng cách làm việc nhóm, thực hiện dự án cá nhân hay thuyết trình… Song song với đó, thầy cô cần theo dõi tiến trình tiếp nhận kiến thức của học sinh, điều chỉnh phương pháp dạy, ra bài tập để tạo môi trường học tập năng động, hấp dẫn.
          </p>
          <p className="text-lg leading-relaxed">
            Cuối năm 2024, Bộ Giáo dục Philippines đã kí thoả thuận hợp tác với Khan Academy, nền tảng học tập nổi tiếng thế giới, nhằm nâng cao năng lực cho học sinh. Ý tưởng hợp tác xuất phát từ thực tế nhiều học sinh Philippines dành thời gian trên Internet nên các em có thể tiếp cận dễ dàng với các mô-đun học tập của Khan Academy.
            </p>
            <p className="text-lg leading-relaxed">
                Các tài liệu học tập kỹ thuật số từ Khan Academy tập trung vào Toán, Khoa học và Đọc hiểu. Đây là ba môn mà học sinh Philippines tụt hậu so với bạn bè trong các bài kiểm tra quốc tế. Học sinh có thể lựa chọn bài học phù hợp với tốc độ tiếp nhận kiến thức của mình và ôn tập mọi lúc, mọi nơi.
            </p>

          {/* Section: Học tập suốt đời */}
          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            Học tập suốt đời
          </h2>
          
          <p className="text-lg leading-relaxed">
            Vào năm 2025, tư tưởng rằng giáo dục sẽ kết thúc sau khi chúng ta tốt nghiệp đã lỗi thời. Thay vào đó, học tập suốt đời đã trở thành phương châm sống, đối với những người chuyên nghiệp, cần phải liên tục nâng cao và học lại kĩ năng để theo kịp những thay đổi nhanh chóng trong công nghệ và thị trường việc làm.
          </p>
          <p className="text-lg leading-relaxed">
            Trong dịch Covid-19, lĩnh vực giáo dục phải chuyển sang mô hình đào tạo trực tuyến và đã chứng kiến những hiệu quả của nó. Sau giai đoạn khó khăn này, việc học trực tuyến đã trở nên phổ biến và được nhiều trường học đưa vào ứng dụng rộng rãi.
            </p>
            <p className="text-lg leading-relaxed">
                Một trong những chương trình đào tạo được ứng dụng học trực tuyến nhiều nhất là giáo dục người trưởng thành, một phần trong mô hình học tập suốt đời. Nhiều trường đại học đã chuẩn bị các chương trình học dành cho người lớn theo hình thức học trực tuyến, học theo mô-đun để học viên có thể tiếp cận từ xa mà không nhất thiết phải lên giảng đường.
            </p>
            <p className="text-lg leading-relaxed">
                Phương pháp này giúp họ mở rộng kĩ năng, trau dồi thêm kiến thức trong một thế giới thay đổi nhanh chóng. Xu hướng học tập suốt đời sẽ tiếp tục phát triển trong năm 2025 và lan rộng đến nhiều quốc gia.
            </p>

          <div className="my-8">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/16287e1e5e83580d54eb961b843176ef207325b1?width=1497" 
              alt="Người lao động học tập"
              className="w-full h-auto rounded-lg"
            />
            <p className="text-black text-center mt-2">
              Người lao động học tập để nâng cao kĩ năng làm việc.
            </p>
          </div>

          {/* Section: Đào tạo nghề chuyên nghiệp */}
          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            Đào tạo nghề chuyên nghiệp
          </h2>
          
          <p className="text-lg leading-relaxed">
            Giáo dục nghề chưa được đánh giá đúng ở một số quốc gia, nhất là tại châu Á, nơi việc học trường danh tiếng được coi là bước đệm thành công. Tuy nhiên, hiện nay, giáo dục nghề đang được nhìn nhận, đánh giá lại và cải thiện phương pháp đào tạo để nâng cao &quot;sức nặng&quot; của ngành đào tạo này và thu hút thanh thiếu niên tham gia.
          </p>
          <p className="text-lg leading-relaxed">
            Việc đào tạo nghề phát triển là bắt kịp xu hướng công nghệ hiện nay. Khi AI được nhân rộng và có nguy cơ thay thế nhiều công việc trên thị trường lao động thì những công việc yêu cầu kĩ năng cao, tính chuyên nghiệp càng khó bị thay thế với mức lương, đãi ngộ tốt hơn. Đào tạo nghề góp phần chuẩn bị nhóm nhân công chất lượng cao cho thị trường lao động - những người không sợ sẽ bị đào thải bởi công nghệ.
          </p>
            <p className="text-lg leading-relaxed">
            Ngoài ra, tại một số nước như Mỹ, Anh, học phí đại học ngày càng tăng cao, vượt xa khả năng chi trả của nhiều hộ gia đình. Do đó, giáo dục đại học không còn là ước muốn của mọi người. Nhiều thanh niên đã chuyển sang học nghề.
            </p>
            <p className="text-lg leading-relaxed">
                Góp phần vào sự thay đổi trên còn là tình trạng bất ổn trong lĩnh vực lao động tri thức. Không giống như làn sóng tự động hóa trước đây, trí tuệ nhân tạo (AI) có thể hoàn thành công việc nhanh hơn. Nó có khả năng tạo ra nội dung và ý tưởng sáng tạo, những việc mà hàng triệu người ngồi trước màn hình máy tính đang làm ngày nay
            </p>
            <p className="text-lg leading-relaxed">
                Chưa kể tình trạng kinh tế bất ổn tạo ra làn sóng sa thải tập thể trong giới lao động tri thức. Nhìn vào thực tế trên, không ít Gen Z cảm thấy bất an, thiếu ổn định và muốn tìm cho mình một công việc thực tế, ít tốn kém học phí và chắc chắn hơn.
            </p>
            <p className="text-lg leading-relaxed">
                Ông Mike Rowe, Giám đốc MikeroweWorks, tổ chức nâng cao và khuyến khích lao động chân tay tại Mỹ, nhận định Gen Z không bị ám ảnh bởi suy nghĩ truyền thống về “tầng lớp có bằng cấp” và “tầng lớp lao động”. Họ tin rằng mọi công việc đều là bình đẳng và sẽ được trả lương xứng đáng nếu làm việc chuyên nghiệp, chăm chỉ. Điều đó đồng nghĩa bằng đại học không phải là con đường duy nhất dẫn đến thành công trong mắt họ.
            </p>
            <p className="text-lg leading-relaxed">
                Trước xu hướng trên, đào tạo nghề đang thay đổi. Nhiều trường dạy nghề tại Mỹ đã hợp tác với các trường nghề ở Đức, một trong những quốc gia có chương trình đào tạo nghề tốt nhất thế giới. Các trường cũng hợp tác với các doanh nghiệp để học viên được phép thực hành sớm hơn và có cơ hội nhận việc làm ngay sau khi tốt nghiệp.
            </p>
          <div className="my-8">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/d4bf5d1c591c9b2cd31a513b79553f978ef4b0e4?width=1500" 
              alt="Đào tạo nghề"
              className="w-full h-auto rounded-lg"
            />
            <p className="text-black text-center mt-2">
              Đào tạo nghề là xu hướng khi học phí đại học tăng cao.
            </p>
          </div>

          {/* Section: Kinh doanh Ed-tech */}
          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            Kinh doanh Ed-tech
          </h2>
          
          <p className="text-lg leading-relaxed">
            Ed-tech, hay công nghệ giáo dục, được dự báo sẽ tăng trưởng từ 142 tỷ USD lên gần 350 tỷ USD vào năm 2030. Khi sự ủng hộ của ngành giáo dục đối với các nền tảng học trực tuyến, trợ lý AI, trải nghiệm học nhập vai ngày càng tăng, công nghệ sẽ trở thành công cụ truyền tải tri thức quan trọng trong năm 2025.
          </p>

          <p className="text-lg leading-relaxed">
            Bối cảnh giáo dục năm 2025 sẽ thay đổi từ mô hình truyền thống sang phương pháp học tập năng động hơn, được thúc đẩy bởi công nghệ và lấy con người làm trung tâm. Khi AI tiếp tục định hình lại thế giới, sự kết hợp giữa công nghệ tiên tiến với sự tập trung nâng cao và khả năng thích ứng độc đáo của con người sẽ định nghĩa lại giáo dục trong thời đại kĩ thuật số.
          </p>
          <p className="text-lg leading-relaxed">
            Tương lai của giáo dục không chỉ là truyền thụ kiến thức mà là đào tạo nên những người học linh hoạt, học tập suốt đời và phát triển mạnh mẽ trong một thế giới ngày càng phức tạp và phát triển nhanh chóng.
          </p>

          {/* Quote Box */}
          <div className="border border-orange-600 bg-amber-500/17 p-6 rounded-lg my-8 bg-orange-50">
            <p className="text-lg leading-relaxed">
              Ông Mike Rowe, Giám đốc MikeroweWorks, tổ chức nâng cao và khuyến khích lao động chân tay tại Mỹ, cho biết: &quot;Chúng tôi chứng kiến nhiều người trẻ theo học trường nghề, thoát khỏi những khoản nợ sinh viên khổng lồ. Cơ hội tài chính của họ sẽ được nâng cao nếu họ có thể thành thạo một kỹ năng bất kỳ&quot;. (mục Đào tạo nghề chuyên nghiệp)
            </p>
          </div>
        </div>

        {/* Article Footer */}
        <div className="mt-12 pt-6 border-t border-black/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-black/70">Xuất bản ngày 15 tháng 1, 2025</p>
            <div className="flex gap-6">
              <button className="text-blue-600 hover:underline">Chia sẻ bài viết</button>
              <button className="text-blue-600 hover:underline">Thêm bài viết</button>
            </div>
          </div>
        </div>
      </main>

      {/* Related Articles Section */}
      <section className="bg-gray-100/50 py-12 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-black mb-8">Bài viết liên quan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Article 1 */}
            <article className="bg-white rounded-2xl overflow-hidden border border-black/50 shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/be8cff8ac82556e17a45e027eec1012826057b35?width=636" 
                alt="EdTech Việt Nam"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-black mb-2 line-clamp-2">
                  Thị trường edTech Việt Nam: Quy mô, cơ hội tăng trưởng và xu hướng của ngành
                </h3>
                <p className="text-black/70 text-sm line-clamp-2">
                  Hiện nay, thị trường edTech Việt Nam đã đạt đến quy mô khoảng 5 tỷ USD...
                </p>
              </div>
            </article>

            {/* Article 2 */}
            <article className="bg-white rounded-2xl overflow-hidden border border-black/50 shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/ed6076f7630b0788546cd714e9b8fabbc7f7c90a?width=568" 
                alt="Công nghệ giáo dục"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-black mb-2 line-clamp-2">
                  Công nghệ giáo dục – Xu hướng tương lai và cơ hội nghề nghiệp
                </h3>
                <p className="text-black/70 text-sm line-clamp-2">
                  Trong thời đại số hóa, Công nghệ Giáo dục (EdTech) đang trở thànhh động lực...
                </p>
              </div>
            </article>

            {/* Article 3 */}
            <article className="bg-white rounded-2xl overflow-hidden border border-black/50 shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/225fa2691777812e1ea308900004f642e72fab52?width=572" 
                alt="Ứng dụng EdTech"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-black mb-2 line-clamp-2">
                  Công nghệ giáo dục: Xu hướng phát triển và ứng dụng tại Việt Nam
                </h3>
                <p className="text-black/70 text-sm line-clamp-2">
                  EdTech (công nghệ giáo dục) là sự kết hợp giữa công nghệ và giáo dục...
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
