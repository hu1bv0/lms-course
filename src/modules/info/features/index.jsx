// src/pages/index.jsx
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";
import ProfileEdit from "../components/ProfileEdit";

export default function Index() {
  const [isEditing, setIsEditing] = useState(false);

  // Dữ liệu user chung, lưu ở parent để khi edit xong có thể cập nhật lại profile
  const [userData, setUserData] = useState({
    hoTen: "Bùi Minh Hiếu",
    tenDangNhap: "Híu Bùi",
    ngaySinh: "--/--/----",
    dienThoai: "0783624814",
    email: "hieubmse184406@fpt.edu.vn",
    diaChi: "289 Nguyễn Sơn",
    loaiTaiKhoan: "Học sinh",
    khoi: "9",
    truongHoc: "Trường THCS Đồng Khởi",
    quan: "Quận Tân Phú",
    tinhThanhPho: "TP Hồ Chí Minh",
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <Sidebar activeItem="profile" />

          {/* Nếu isEditing = true -> show ProfileEdit, ngược lại show Profile */}
          {isEditing ? (
            <ProfileEdit
              initialData={userData}
              onSave={(newData) => {
                setUserData(newData);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <Profile
              userData={userData}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
