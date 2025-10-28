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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-lg font-medium">Quay lại</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-9 h-9 text-blue-600" strokeWidth={2.67} />
              <h1 className="text-2xl font-bold text-black">Learnly</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to={ENDPOINTS.SHARED.SUBSCRIPTION}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Quản lý gói học
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {userData?.displayName || "Người dùng"}
                </h2>
                {userData?.role !== USER_ROLES.ADMIN && (
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      subscriptionType === SUBSCRIPTION_TYPES.PREMIUM 
                        ? "bg-purple-100 text-purple-700" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {subscriptionType === SUBSCRIPTION_TYPES.PREMIUM && <Crown className="w-4 h-4 inline mr-1" />}
                      {getSubscriptionDisplayName(subscriptionType)}
                    </span>
                  </div>
                )}
                <p className="text-gray-600">
                  {getRoleDisplayName(userData?.role)}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                  {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
                </button>

                {subscriptionType === SUBSCRIPTION_TYPES.FREE && userData?.role !== USER_ROLES.ADMIN && (
                  <button
                    onClick={handleUpgradeToPremium}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    <Crown className="w-5 h-5" />
                    Nâng cấp lên Premium
                  </button>
                )}

                <Link
                  to={ENDPOINTS.SHARED.SUBSCRIPTION}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                  Quản lý gói học
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Thông tin cá nhân</h3>
                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
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
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{userData?.email}</span>
                  </div>
                </div>

                {/* User Code - Chỉ hiển thị cho học sinh */}
                {userData?.role === USER_ROLES.STUDENT && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Shield className="w-4 h-4" />
                      Mã học sinh
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900 font-mono text-lg">
                        {userData?.userCode || "Chưa có mã"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Mã này được sử dụng để phụ huynh liên kết với tài khoản của bạn
                    </p>
                  </div>
                )}

                {/* Display Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4" />
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.displayName}
                      onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập họ và tên"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{editData?.displayName || userData?.displayName || "Chưa cập nhật"}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone className="w-4 h-4" />
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{editData?.phone || userData?.phone || "Chưa cập nhật"}</span>
                    </div>
                  )}
                </div>

                {/* School */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <School className="w-4 h-4" />
                    Trường học
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.school}
                      onChange={(e) => setEditData({...editData, school: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên trường học"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{editData?.school || userData?.school || "Chưa cập nhật"}</span>
                    </div>
                  )}
                </div>

                {/* Grade (for students) */}
                {userData?.role === USER_ROLES.STUDENT && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <GraduationCap className="w-4 h-4" />
                      Lớp học
                    </label>
                    {isEditing ? (
                      <select
                        value={editData.grade}
                        onChange={(e) => setEditData({...editData, grade: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn lớp học</option>
                        {getAllGrades().map((grade) => (
                          <option key={grade.gradeNumber} value={grade.grade}>
                            {grade.grade}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900">{editData?.grade || userData?.grade || "Chưa cập nhật"}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Role */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Shield className="w-4 h-4" />
                    Vai trò
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{getRoleDisplayName(userData?.role)}</span>
                  </div>
                </div>

                {/* Join Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4" />
                    Ngày tham gia
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('vi-VN') : "Chưa xác định"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Status - Only show for non-admin users */}
            {userData?.role !== USER_ROLES.ADMIN && (
              <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Trạng thái gói học</h3>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {subscriptionType === SUBSCRIPTION_TYPES.PREMIUM ? (
                      <Crown className="w-8 h-8 text-purple-600" />
                    ) : (
                      <Star className="w-8 h-8 text-blue-600" />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Gói {getSubscriptionDisplayName(subscriptionType)}
                      </h4>
                      <p className="text-sm text-gray-600">
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
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                    >
                      Nâng cấp ngay
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Link Student - Only show for parents */}
            {userData?.role === USER_ROLES.PARENT && (
              <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Liên kết học sinh</h3>
                
                {/* Input form */}
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 mb-3">
                    Nhập mã học sinh (được cung cấp từ tài khoản học sinh) để liên kết và theo dõi tiến độ học tập
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleLinkStudent()}
                      placeholder="Nhập mã học sinh (ví dụ: 4Q5KAX)"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                      maxLength={10}
                      disabled={linkingStudent}
                    />
                    <button
                      onClick={handleLinkStudent}
                      disabled={linkingStudent || !studentCode.trim()}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <UserPlus className="w-5 h-5" />
                      {linkingStudent ? "Đang liên kết..." : "Liên kết"}
                    </button>
                  </div>
                </div>

                {/* Linked students list */}
                {linkedStudents.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-gray-700" />
                      <h4 className="font-semibold text-gray-900">
                        Học sinh đã liên kết ({linkedStudents.length})
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {linkedStudents.map((student) => (
                        <div 
                          key={student.id} 
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">{student.displayName}</h5>
                              <p className="text-sm text-gray-600">{student.email}</p>
                              {student.grade && (
                                <p className="text-sm text-gray-500">{student.grade}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(ENDPOINTS.PARENT.DASHBOARD)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            Xem tiến độ
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Chưa liên kết học sinh nào</p>
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
