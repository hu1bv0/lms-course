import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ENDPOINTS } from "../../../routes/endPoints";
import { useAuth } from "../../../hooks/useAuth";
import { USER_ROLES, SUBSCRIPTION_TYPES } from "../../../services/firebase";
import parentService from "../../../services/firebase/parentService";
import { getAllGrades } from "../../../constants/educationConstants";
import { toast } from "react-toastify";
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  School, 
  Calendar,
  Crown,
  CreditCard,
  Settings,
  ArrowLeft,
  Edit,
  Shield,
  Star,
  UserPlus,
  Users,
  Loader2
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { userData, subscriptionType, updateProfileData, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    displayName: "",
    phone: "",
    school: "",
    grade: ""
  });
  const [studentCode, setStudentCode] = useState("");
  const [linkingStudent, setLinkingStudent] = useState(false);
  const [linkedStudents, setLinkedStudents] = useState([]);
  const lastUserDataRef = useRef(null);

  // Update editData when userData changes (but only when not editing)
  useEffect(() => {
    if (userData && !isEditing && !isSaving) {
      const currentData = {
        displayName: userData.displayName || "",
        phone: userData.phone || "",
        school: userData.school || "",
        grade: userData.grade || ""
      };
      
      // Only update if data actually changed
      const dataString = JSON.stringify(currentData);
      const lastDataString = JSON.stringify(lastUserDataRef.current);
      
      if (dataString !== lastDataString) {
        console.log('Updating editData from userData:', currentData);
        setEditData(currentData);
        lastUserDataRef.current = currentData;
      }
    }
  }, [userData, isEditing, isSaving]);

  // Load linked students for parents
  useEffect(() => {
    if (userData?.role === USER_ROLES.PARENT) {
      loadLinkedStudents();
    }
  }, [userData]);

  const loadLinkedStudents = async () => {
    try {
      const result = await parentService.getParentChildren(userData.uid);
      if (result.success) {
        setLinkedStudents(result.children || []);
      }
    } catch (error) {
      console.error('Error loading linked students:', error);
    }
  };

  const handleLinkStudent = async () => {
    if (!studentCode.trim()) {
      toast.error("Vui lòng nhập mã học sinh!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      setLinkingStudent(true);
      const result = await parentService.linkStudentToParent(userData.uid, studentCode.trim());
      
      if (result.success) {
        toast.success("Liên kết học sinh thành công!", {
          position: "top-right",
          autoClose: 2000,
        });
        setStudentCode("");
        loadLinkedStudents(); // Reload danh sách
      } else {
        toast.error(result.message || "Không tìm thấy học sinh với mã này!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error linking student:', error);
      toast.error("Có lỗi xảy ra khi liên kết học sinh!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLinkingStudent(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      console.log('Saving profile with data:', editData);
      const result = await updateProfileData(userData.uid, editData);
      console.log('Save profile result:', result);
      
      console.log('Current userData after save:', userData);
      
      toast.success(result?.message || "Cập nhật thông tin thành công!", {
        position: "top-right",
        autoClose: 2000,
      });
      
      // Close edit mode after successful save
      setIsEditing(false);
      
      // Wait a bit for the auth state to update
      setTimeout(() => {
        console.log('UserData after timeout:', userData);
      }, 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error?.message || "Có lỗi xảy ra khi cập nhật thông tin!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpgradeToPremium = () => {
    navigate(ENDPOINTS.SHARED.SUBSCRIPTION);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "Quản trị viên";
      case USER_ROLES.TEACHER:
        return "Giáo viên";
      case USER_ROLES.STUDENT:
        return "Học sinh";
      case USER_ROLES.PARENT:
        return "Phụ huynh";
      default:
        return "Người dùng";
    }
  };

  const getSubscriptionDisplayName = (type) => {
    switch (type) {
      case SUBSCRIPTION_TYPES.PREMIUM:
        return "Premium";
      case SUBSCRIPTION_TYPES.FREE:
        return "Miễn phí";
      default:
        return "Miễn phí";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-lg font-medium">Quay lại</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Learnly</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to={ENDPOINTS.SHARED.SUBSCRIPTION}
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors hover:underline"
              >
                Quản lý gói học
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-110 transition-transform duration-300 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-pulse opacity-50"></div>
                  <User className="w-14 h-14 text-white relative z-10" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {userData?.displayName || "Người dùng"}
                </h2>
                {userData?.role !== USER_ROLES.ADMIN && (
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className={`px-4 py-1.5 rounded-xl text-sm font-semibold shadow-md ${
                      subscriptionType === SUBSCRIPTION_TYPES.PREMIUM 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                        : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                    }`}>
                      {subscriptionType === SUBSCRIPTION_TYPES.PREMIUM && <Crown className="w-4 h-4 inline mr-1" />}
                      {getSubscriptionDisplayName(subscriptionType)}
                    </span>
                  </div>
                )}
                <p className="text-gray-600 font-medium">
                  {getRoleDisplayName(userData?.role)}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 font-semibold"
                >
                  <Edit className="w-5 h-5" />
                  {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
                </button>

                {subscriptionType === SUBSCRIPTION_TYPES.FREE && userData?.role !== USER_ROLES.ADMIN && (
                  <button
                    onClick={handleUpgradeToPremium}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 font-semibold"
                  >
                    <Crown className="w-5 h-5" />
                    Nâng cấp lên Premium
                  </button>
                )}

                <Link
                  to={ENDPOINTS.SHARED.SUBSCRIPTION}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-gray-200/50 font-semibold"
                >
                  <CreditCard className="w-5 h-5" />
                  Quản lý gói học
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Thông tin cá nhân</h3>
                </div>
                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105 font-semibold"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <span>Lưu thay đổi</span>
                    )}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    Email
                  </label>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200/50 shadow-md hover:shadow-lg transition-all duration-300">
                    <span className="text-gray-900 font-medium">{userData?.email}</span>
                  </div>
                </div>

                {/* User Code - Chỉ hiển thị cho học sinh */}
                {userData?.role === USER_ROLES.STUDENT && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-purple-600" />
                      </div>
                      Mã học sinh
                    </label>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200/50 shadow-md hover:shadow-lg transition-all duration-300">
                      <span className="text-gray-900 font-mono text-lg font-bold">
                        {userData?.userCode || "Chưa có mã"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      Mã này được sử dụng để phụ huynh liên kết với tài khoản của bạn
                    </p>
                  </div>
                )}

                {/* Display Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.displayName}
                      onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                      placeholder="Nhập họ và tên"
                    />
                  ) : (
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200/50 shadow-md hover:shadow-lg transition-all duration-300">
                      <span className="text-gray-900 font-medium">{editData?.displayName || userData?.displayName || "Chưa cập nhật"}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50 shadow-md hover:shadow-lg transition-all duration-300">
                      <span className="text-gray-900 font-medium">{editData?.phone || userData?.phone || "Chưa cập nhật"}</span>
                    </div>
                  )}
                </div>

                {/* School */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                      <School className="w-4 h-4 text-orange-600" />
                    </div>
                    Trường học
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.school}
                      onChange={(e) => setEditData({...editData, school: e.target.value})}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                      placeholder="Nhập tên trường học"
                    />
                  ) : (
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200/50 shadow-md hover:shadow-lg transition-all duration-300">
                      <span className="text-gray-900 font-medium">{editData?.school || userData?.school || "Chưa cập nhật"}</span>
                    </div>
                  )}
                </div>

                {/* Grade (for students) */}
                {userData?.role === USER_ROLES.STUDENT && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-cyan-600" />
                      </div>
                      Lớp học
                    </label>
                    {isEditing ? (
                      <select
                        value={editData.grade}
                        onChange={(e) => setEditData({...editData, grade: e.target.value})}
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                      >
                        <option value="">Chọn lớp học</option>
                        {getAllGrades().map((grade) => (
                          <option key={grade.gradeNumber} value={grade.grade}>
                            {grade.grade}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200/50 shadow-md hover:shadow-lg transition-all duration-300">
                        <span className="text-gray-900 font-medium">{editData?.grade || userData?.grade || "Chưa cập nhật"}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Role */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-indigo-600" />
                    </div>
                    Vai trò
                  </label>
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50 shadow-md hover:shadow-lg transition-all duration-300">
                    <span className="text-gray-900 font-medium">{getRoleDisplayName(userData?.role)}</span>
                  </div>
                </div>

                {/* Join Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-pink-600" />
                    </div>
                    Ngày tham gia
                  </label>
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200/50 shadow-md hover:shadow-lg transition-all duration-300">
                    <span className="text-gray-900 font-medium">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('vi-VN') : "Chưa xác định"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Status - Only show for non-admin users */}
            {userData?.role !== USER_ROLES.ADMIN && (
              <div className="mt-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center shadow-md">
                    {subscriptionType === SUBSCRIPTION_TYPES.PREMIUM ? (
                      <Crown className="w-5 h-5 text-white" />
                    ) : (
                      <Star className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Trạng thái gói học</h3>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
                      subscriptionType === SUBSCRIPTION_TYPES.PREMIUM 
                        ? "bg-gradient-to-br from-purple-500 to-pink-500" 
                        : "bg-gradient-to-br from-blue-400 to-cyan-400"
                    }`}>
                      {subscriptionType === SUBSCRIPTION_TYPES.PREMIUM ? (
                        <Crown className="w-8 h-8 text-white" />
                      ) : (
                        <Star className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">
                        Gói {getSubscriptionDisplayName(subscriptionType)}
                      </h4>
                      <p className="text-sm text-gray-600 font-medium">
                        {subscriptionType === SUBSCRIPTION_TYPES.PREMIUM 
                          ? "Truy cập đầy đủ tất cả tính năng"
                          : "Truy cập các tính năng cơ bản"
                        }
                      </p>
                    </div>
                  </div>
                  
                  {subscriptionType === SUBSCRIPTION_TYPES.FREE && userData?.role !== USER_ROLES.ADMIN && (
                    <button
                      onClick={handleUpgradeToPremium}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 font-semibold"
                    >
                      Nâng cấp ngay
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Link Student - Only show for parents */}
            {userData?.role === USER_ROLES.PARENT && (
              <div className="mt-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Liên kết học sinh</h3>
                </div>
                
                {/* Input form */}
                <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm p-5 rounded-xl mb-4 border border-blue-200/50 shadow-lg">
                  <p className="text-sm text-gray-700 mb-4 font-medium">
                    Nhập mã học sinh (được cung cấp từ tài khoản học sinh) để liên kết và theo dõi tiến độ học tập
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleLinkStudent()}
                      placeholder="Nhập mã học sinh (ví dụ: 4Q5KAX)"
                      className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md uppercase font-semibold"
                      maxLength={10}
                      disabled={linkingStudent}
                    />
                    <button
                      onClick={handleLinkStudent}
                      disabled={linkingStudent || !studentCode.trim()}
                      className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 font-semibold"
                    >
                      <UserPlus className="w-5 h-5" />
                      {linkingStudent ? "Đang liên kết..." : "Liên kết"}
                    </button>
                  </div>
                </div>

                {/* Linked students list */}
                {linkedStudents.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        Học sinh đã liên kết ({linkedStudents.length})
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {linkedStudents.map((student) => (
                        <div 
                          key={student.id} 
                          className="flex items-center justify-between p-5 bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl border border-blue-200/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                              <User className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h5 className="font-bold text-gray-900 text-lg">{student.displayName}</h5>
                              <p className="text-sm text-gray-600 font-medium">{student.email}</p>
                              {student.grade && (
                                <p className="text-sm text-gray-500 font-medium">{student.grade}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(ENDPOINTS.PARENT.DASHBOARD)}
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105"
                          >
                            Xem tiến độ
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4 shadow-lg">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="font-semibold text-lg mb-1">Chưa liên kết học sinh nào</p>
                    <p className="text-sm mt-1">Nhập mã học sinh ở trên để bắt đầu liên kết</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
