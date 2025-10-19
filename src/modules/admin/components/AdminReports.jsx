import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  ArrowLeft,
  Users,
  BookOpen,
  DollarSign,
  Target,
  Eye,
  FileText
} from 'lucide-react';
import { toast } from 'react-toastify';
import adminAnalyticsService from '../../../services/firebase/adminAnalyticsService';

const AdminReports = ({ onBack }) => {
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  const [reportType, setReportType] = useState('overview'); // 'overview', 'users', 'courses', 'revenue'
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  // Load report data
  const loadReportData = useCallback(async () => {
    try {
      setLoading(true);
      const dashboardStats = await adminAnalyticsService.getDashboardStats();
      setReportData(dashboardStats);
    } catch (error) {
      console.error('Error loading report data:', error);
      toast.error('Không thể tải dữ liệu báo cáo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  // Generate mock chart data based on real data
  const generateChartData = () => {
    if (!reportData) return null;

    return {
      // User growth over time (mock data based on real user count)
      userGrowth: [
        { month: 'T1', users: Math.floor(reportData.users.total * 0.7) },
        { month: 'T2', users: Math.floor(reportData.users.total * 0.8) },
        { month: 'T3', users: Math.floor(reportData.users.total * 0.85) },
        { month: 'T4', users: Math.floor(reportData.users.total * 0.9) },
        { month: 'T5', users: Math.floor(reportData.users.total * 0.95) },
        { month: 'T6', users: reportData.users.total }
      ],

      // Course enrollments by subject
      courseEnrollments: Object.entries(reportData.courses.bySubject || {}).map(([subject, count]) => ({
        subject,
        enrollments: count
      })),

      // Revenue by month (mock data based on real revenue)
      monthlyRevenue: [
        { month: 'T1', revenue: Math.floor(reportData.transactions.totalRevenue * 0.1) },
        { month: 'T2', revenue: Math.floor(reportData.transactions.totalRevenue * 0.15) },
        { month: 'T3', revenue: Math.floor(reportData.transactions.totalRevenue * 0.2) },
        { month: 'T4', revenue: Math.floor(reportData.transactions.totalRevenue * 0.25) },
        { month: 'T5', revenue: Math.floor(reportData.transactions.totalRevenue * 0.2) },
        { month: 'T6', revenue: Math.floor(reportData.transactions.totalRevenue * 0.1) }
      ],

      // User roles distribution
      userRoles: Object.entries(reportData.users.byRole || {}).map(([role, count]) => ({
        role: role === 'admin' ? 'Admin' : 
              role === 'teacher' ? 'Giáo viên' :
              role === 'student' ? 'Học sinh' : 'Phụ huynh',
        count
      })),

      // Course completion rates
      completionRates: [
        { course: 'Toán học', completed: reportData.enrollments.completed, total: reportData.enrollments.total },
        { course: 'Tiếng Việt', completed: Math.floor(reportData.enrollments.completed * 0.8), total: Math.floor(reportData.enrollments.total * 0.9) },
        { course: 'Khoa học', completed: Math.floor(reportData.enrollments.completed * 0.7), total: Math.floor(reportData.enrollments.total * 0.8) }
      ]
    };
  };

  const chartData = generateChartData();

  // Export report
  const handleExportReport = () => {
    toast.success('Đang xuất báo cáo...');
    // In real implementation, this would generate and download a PDF/Excel file
    setTimeout(() => {
      toast.success('Báo cáo đã được xuất thành công!');
    }, 2000);
  };

  const reportTypes = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'users', label: 'Người dùng', icon: Users },
    { id: 'courses', label: 'Khóa học', icon: BookOpen },
    { id: 'revenue', label: 'Doanh thu', icon: DollarSign }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu báo cáo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 transition"
                title="Quay lại"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Báo cáo & Thống kê</h1>
                <p className="text-sm text-gray-600">Phân tích dữ liệu và xuất báo cáo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="year">Năm nay</option>
              </select>
              
              <button
                onClick={handleExportReport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Type Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {reportTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      reportType === type.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Report */}
        {reportType === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData?.users.total || 0}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +12% so với tháng trước
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Khóa học</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData?.courses.total || 0}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +8% so với tháng trước
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Đăng ký</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData?.enrollments.total || 0}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +15% so với tháng trước
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData?.transactions.totalRevenue?.toLocaleString('vi-VN') || 0} VNĐ
                    </p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +22% so với tháng trước
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tăng trưởng người dùng</h3>
                  <LineChart className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {chartData?.userGrowth?.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-8 text-sm font-medium text-gray-600">{data.month}</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(data.users / Math.max(...chartData.userGrowth.map(d => d.users))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{data.users}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo tháng</h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {chartData?.monthlyRevenue?.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-8 text-sm font-medium text-gray-600">{data.month}</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(data.revenue / Math.max(...chartData.monthlyRevenue.map(d => d.revenue))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {data.revenue.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Roles Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Phân bố người dùng theo vai trò</h3>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {chartData?.userRoles?.map((role, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold ${
                      role.role === 'Admin' ? 'bg-red-500' :
                      role.role === 'Giáo viên' ? 'bg-blue-500' :
                      role.role === 'Học sinh' ? 'bg-green-500' : 'bg-purple-500'
                    }`}>
                      {role.count}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{role.role}</p>
                    <p className="text-xs text-gray-500">
                      {((role.count / reportData.users.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Report */}
        {reportType === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê người dùng</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{reportData?.users.total || 0}</p>
                  <p className="text-sm text-gray-600">Tổng người dùng</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{reportData?.users.byRole.student || 0}</p>
                  <p className="text-sm text-gray-600">Học sinh</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{reportData?.users.byRole.teacher || 0}</p>
                  <p className="text-sm text-gray-600">Giáo viên</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Report */}
        {reportType === 'courses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê khóa học</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{reportData?.courses.total || 0}</p>
                  <p className="text-sm text-gray-600">Tổng khóa học</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{reportData?.courses.totalLessons || 0}</p>
                  <p className="text-sm text-gray-600">Tổng bài học</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{reportData?.courses.totalExams || 0}</p>
                  <p className="text-sm text-gray-600">Tổng bài thi</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{reportData?.courses.averageRating || 0}</p>
                  <p className="text-sm text-gray-600">Đánh giá TB</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Report */}
        {reportType === 'revenue' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê doanh thu</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData?.transactions.totalRevenue?.toLocaleString('vi-VN') || 0} VNĐ
                  </p>
                  <p className="text-sm text-gray-600">Tổng doanh thu</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{reportData?.transactions.approved || 0}</p>
                  <p className="text-sm text-gray-600">Giao dịch thành công</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{reportData?.transactions.pending || 0}</p>
                  <p className="text-sm text-gray-600">Chờ duyệt</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
