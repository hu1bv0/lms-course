// src/components/Profile.jsx
import { Pencil } from "lucide-react";

export default function Profile({ userData = {}, onEdit = () => {} }) {
  // dùng props userData (parent truyền xuống)
  const data = userData;

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl border border-black/50 shadow-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-blue-600">Thông tin cá nhân</h2>
        <button
          onClick={onEdit} // ← gọi callback để chuyển sang edit mode
          className="flex items-center gap-3 px-6 py-3 rounded-full border border-black/50 hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">Cập nhật</span>
          <Pencil className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
        <div>
          <p className="text-sm text-black/50">Họ tên:</p>
          <p className="text-base font-bold text-black">{data.hoTen}</p>
        </div>

        <div>
          <p className="text-sm text-black/50">Ngày Sinh:</p>
          <p className="text-base font-bold text-black">{data.ngaySinh}</p>
        </div>

        <div>
          <p className="text-sm text-black/50">Tên đăng nhập:</p>
          <p className="text-base font-bold text-black">{data.tenDangNhap}</p>
        </div>

        <div>
          <p className="text-sm text-black/50">Điện thoại:</p>
          <p className="text-base font-bold text-black">{data.dienThoai}</p>
        </div>

        <div>
          <p className="text-sm text-black/50">Loại tài khoản:</p>
          <p className="text-base font-bold text-black">{data.loaiTaiKhoan}</p>
        </div>

        <div>
          <p className="text-sm text-black/50">Email</p>
          <p className="text-base font-bold text-black">{data.email}</p>
        </div>

        <div>
          <p className="text-sm text-black/50">Khối:</p>
          <p className="text-base font-bold text-black">{data.khoi}</p>
        </div>

        <div>
          <p className="text-sm text-black/50">Địa chỉ:</p>
          <p className="text-base font-bold text-black">{data.diaChi}</p>
        </div>

        <div>
          <p className="text-sm text-black/50">Trường học:</p>
          <p className="text-base font-bold text-black">{data.truongHoc}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm text-black/50">Quận:</p>
          <p className="text-base font-bold text-black">{data.quan}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm text-black/50">Tỉnh/Thành Phố:</p>
          <p className="text-base font-bold text-black">{data.tinhThanhPho}</p>
        </div>
      </div>
    </div>
  );
}
