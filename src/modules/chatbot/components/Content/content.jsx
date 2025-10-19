// /components/Content/content.jsx
import { BookOpen } from "lucide-react";

export default function Content({ conversation }) {
  if (!conversation) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-[1236px] mx-auto">
          <div className="border border-black/30 rounded-xl p-6 md:p-10 bg-white text-center">
            <BookOpen className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <h2 className="text-xl font-medium">Không có nội dung</h2>
            <p className="text-sm text-gray-600 mt-2">
              Vui lòng chọn một cuộc trò chuyện từ thanh bên để xem nội dung chi tiết.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tách dữ liệu cơ bản
  const { title, type, preview, payload } = conversation;

  // ==== CASE 1: Toán học ====
  if (type === "math") {
    const question = payload?.question || title;
    const solution = payload?.solution || "x = ±6";
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-[1236px] mx-auto">
          <div className="border border-black/30 rounded-xl p-6 md:p-10 bg-white space-y-6">
            <h2 className="text-2xl font-semibold mb-2">Giải phương trình bậc hai</h2>

            <section>
              <h3 className="text-xl font-medium mb-2">Đề bài</h3>
              <p>{question}</p>
            </section>

            <section>
              <h3 className="text-xl font-medium mb-2">Cách giải</h3>
              <p>
                Đây là phương trình bậc hai cơ bản. Ta có thể lấy căn bậc hai hai vế:
              </p>
              <p className="mt-2 font-medium">⇒ {solution}</p>
              <p className="mt-2">
                Kiểm tra lại: thế x = 6 hoặc x = -6 vào phương trình, cả hai đều thỏa mãn.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-medium mb-2">Ghi nhớ</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Phương trình dạng x² = a có nghiệm x = ±√a</li>
                <li>Nếu a &lt; 0, phương trình vô nghiệm trong R</li>
                <li>Kiểm tra nghiệm bằng cách thay lại vào biểu thức gốc</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // ==== CASE 2: Tiếng Anh ====
  if (type === "english") {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-[1236px] mx-auto">
          <div className="border border-black/30 rounded-xl p-6 md:p-10 bg-white space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              Thì quá khứ đơn và thì hiện tại đơn
            </h2>

            <section>
              <h3 className="text-xl font-medium mb-2">1️⃣ Thì hiện tại đơn (Simple Present)</h3>
              <p>
                Dùng để diễn tả thói quen, sự thật hiển nhiên, hoặc hành động lặp đi lặp lại.
              </p>
              <p className="mt-2 font-medium">🧩 Cấu trúc:</p>
              <pre className="bg-gray-100 rounded-lg p-3 mt-1">
                <code>
                  (+) S + V(s/es) + O{"\n"}
                  (-) S + do/does not + V + O{"\n"}
                  (?) Do/Does + S + V + O?
                </code>
              </pre>
              <p className="mt-2">
                🔹 <b>Ví dụ:</b> She <b>goes</b> to school every day.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-medium mb-2">2️⃣ Thì quá khứ đơn (Simple Past)</h3>
              <p>
                Dùng để diễn tả hành động đã xảy ra và kết thúc trong quá khứ.
              </p>
              <p className="mt-2 font-medium">🧩 Cấu trúc:</p>
              <pre className="bg-gray-100 rounded-lg p-3 mt-1">
                <code>
                  (+) S + V(ed) + O{"\n"}
                  (-) S + did not + V + O{"\n"}
                  (?) Did + S + V + O?
                </code>
              </pre>
              <p className="mt-2">
                🔹 <b>Ví dụ:</b> She <b>went</b> to school yesterday.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-medium mb-2">3️⃣ Phân biệt nhanh</h3>
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Tiêu chí</th>
                    <th className="border p-2">Hiện tại đơn</th>
                    <th className="border p-2">Quá khứ đơn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Thời điểm</td>
                    <td className="border p-2">Hiện tại / thường xuyên</td>
                    <td className="border p-2">Trong quá khứ</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Trạng từ thường dùng</td>
                    <td className="border p-2">always, usually, often</td>
                    <td className="border p-2">yesterday, last week</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Động từ</td>
                    <td className="border p-2">V (s/es)</td>
                    <td className="border p-2">V-ed / quá khứ bất quy tắc</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // ==== CASE 3: Vật lý ====
  if (type === "physics") {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-[1236px] mx-auto">
          <div className="border border-black/30 rounded-xl p-6 md:p-10 bg-white space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Định luật Ôm</h2>

            <section>
              <h3 className="text-xl font-medium mb-2">1️⃣ Phát biểu</h3>
              <p>
                Cường độ dòng điện chạy qua một dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây và tỉ lệ nghịch với điện trở của dây đó.
              </p>
              <p className="mt-2 font-medium">🔹 Công thức: U = I × R</p>
              <p className="text-sm text-gray-600 mt-1">
                Trong đó: U — hiệu điện thế (V), I — cường độ dòng điện (A), R — điện trở (Ω)
              </p>
            </section>

            <section>
              <h3 className="text-xl font-medium mb-2">2️⃣ Ví dụ tính toán</h3>
              <p>
                Giả sử có một điện trở R = 5Ω, hiệu điện thế U = 10V.  
                Tính cường độ dòng điện I?
              </p>
              <p className="mt-2 font-medium">Áp dụng công thức:</p>
              <pre className="bg-gray-100 rounded-lg p-3 mt-1">
                <code>I = U / R = 10 / 5 = 2 (A)</code>
              </pre>
              <p>Kết luận: Cường độ dòng điện chạy qua mạch là 2 ampe.</p>
            </section>

            <section>
              <h3 className="text-xl font-medium mb-2">3️⃣ Ứng dụng thực tế</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Tính toán công suất điện tiêu thụ (P = U × I)</li>
                <li>Thiết kế mạch điện trong dân dụng</li>
                <li>Xác định giá trị điện trở phù hợp cho thiết bị</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    );
  }
// ==== CASE 4: Hóa học ====
  if (type === "chemistry") {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-[1236px] mx-auto">
          <div className="border border-black/30 rounded-xl p-6 md:p-10 bg-white space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              Phản ứng oxi hóa - khử
            </h2>

            <section>
              <h3 className="text-xl font-medium mb-2">1️⃣ Khái niệm</h3>
              <p>
                Phản ứng oxi hóa - khử là quá trình trong đó xảy ra **sự chuyển electron**
                giữa các chất. Một chất **nhường electron** (bị oxi hóa), chất khác **nhận electron**
                (bị khử).
              </p>
              <p className="mt-2 font-medium">🔹 Tổng quát:</p>
              <pre className="bg-gray-100 rounded-lg p-3 mt-1">
                <code>
                  Chất khử → Chất oxi hóa + e⁻{"\n"}
                  Chất oxi hóa + e⁻ → Chất khử
                </code>
              </pre>
            </section>

            <section>
              <h3 className="text-xl font-medium mb-2">2️⃣ Ví dụ minh họa</h3>
              <p>
                Phản ứng giữa kẽm và dung dịch axit clohiđric:
              </p>
              <pre className="bg-gray-100 rounded-lg p-3 mt-2">
                <code>
                  Zn + 2HCl → ZnCl₂ + H₂↑
                </code>
              </pre>
              <p className="mt-2">
                Trong phản ứng này:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Zn <b>bị oxi hóa</b> (nhường 2e⁻): Zn → Zn²⁺ + 2e⁻
                </li>
                <li>
                  H⁺ <b>bị khử</b> (nhận 2e⁻): 2H⁺ + 2e⁻ → H₂
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-medium mb-2">3️⃣ Cách nhận biết phản ứng oxi hóa - khử</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Có sự thay đổi số oxi hóa của nguyên tố.</li>
                <li>Xuất hiện quá trình nhường – nhận electron.</li>
                <li>Thường sinh ra chất mới, khí hoặc kết tủa.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-medium mb-2">4️⃣ Ứng dụng thực tế</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Phản ứng trong pin điện hóa và ắc quy.</li>
                <li>Quá trình gỉ sét của sắt là phản ứng oxi hóa - khử tự nhiên.</li>
                <li>Điện phân, tinh chế kim loại, mạ điện.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-[1236px] mx-auto">
        <div className="border border-black/30 rounded-xl p-6 md:p-10 bg-white">
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
          <p>{preview || "Nội dung chi tiết sẽ sớm được cập nhật."}</p>
        </div>
      </div>
    </div>
  );
}
