import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function ProfileEdit({ initialData = {}, onSave = () => {}, onCancel = () => {} }) {
  const [editData, setEditData] = useState({
    hoTen: initialData.hoTen || "",
    ngaySinh: initialData.ngaySinh || "",
    dienThoai: initialData.dienThoai || "",
    email: initialData.email || "",
    diaChi: initialData.diaChi || "",
    truongHoc: initialData.truongHoc || "",
    quan: initialData.quan || "",
    tinhThanhPho: initialData.tinhThanhPho || "",
    tenDangNhap: initialData.tenDangNhap || "",
    loaiTaiKhoan: initialData.loaiTaiKhoan || "",
    khoi: initialData.khoi || "",
  });

  const handleUpdate = () => {
    onSave(editData);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-300 shadow-2xl p-6 md:p-8">
      {/* Nút quay lại */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base font-medium">Quay lại</span>
        </button>
      </div>

      <h2 className="text-xl font-bold text-center mb-8">Cập nhật thông tin cá nhân</h2>

      {/* Form nhập liệu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ tên</label>
          <input
            type="text"
            value={editData.hoTen}
            onChange={(e) => setEditData({ ...editData, hoTen: e.target.value })}
            className="h-11 w-full border border-gray-300 rounded-[10px] px-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày sinh</label>
          <input
            type="text"
            value={editData.ngaySinh}
            onChange={(e) => setEditData({ ...editData, ngaySinh: e.target.value })}
            placeholder="DD - MM - YYYY"
            className="h-11 w-full border border-gray-300 rounded-[10px] px-3 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Trường học</label>
          <input
            type="text"
            value={editData.truongHoc}
            onChange={(e) => setEditData({ ...editData, truongHoc: e.target.value })}
            className="h-11 w-full border border-gray-300 rounded-[10px] px-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Điện thoại</label>
          <input
            type="text"
            value={editData.dienThoai}
            onChange={(e) => setEditData({ ...editData, dienThoai: e.target.value })}
            className="h-11 w-full border border-gray-300 rounded-[10px] px-3 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Quận/Huyện</label>
          <input
            type="text"
            value={editData.quan}
            onChange={(e) => setEditData({ ...editData, quan: e.target.value })}
            className="h-11 w-full border border-gray-300 rounded-[10px] px-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            className="h-11 w-full border border-gray-300 rounded-[10px] px-3 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tỉnh/Thành Phố</label>
          <input
            type="text"
            value={editData.tinhThanhPho}
            onChange={(e) => setEditData({ ...editData, tinhThanhPho: e.target.value })}
            className="h-11 w-full border border-gray-300 rounded-[10px] px-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ</label>
          <input
            type="text"
            value={editData.diaChi}
            onChange={(e) => setEditData({ ...editData, diaChi: e.target.value })}
            className="h-11 w-full border border-gray-300 rounded-[10px] px-3 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
        <button
          onClick={handleUpdate}
          className="px-10 py-3 bg-blue-500 hover:bg-blue-600 text-white text-base font-semibold rounded-full shadow-md transition-colors"
        >
          Cập nhật thông tin
        </button>

        <button
          onClick={handleCancel}
          className="px-10 py-3 text-base font-semibold rounded-full border border-gray-400 hover:bg-gray-50 transition-colors"
        >
          Hủy bỏ
        </button>
      </div>
    </div>
  );
}
