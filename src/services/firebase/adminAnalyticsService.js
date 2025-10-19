import firestoreService from './firestoreService';

class AdminAnalyticsService {
  constructor() {
    this.firestore = firestoreService;
  }

  // Get total users count
  async getTotalUsers() {
    try {
      const users = await this.firestore.getCollection('users');
      return users.length;
    } catch (error) {
      console.error('Error getting total users:', error);
      return 0;
    }
  }

  // Get users by role
  async getUsersByRole() {
    try {
      const users = await this.firestore.getCollection('users');
      const roleCounts = {
        admin: 0,
        teacher: 0,
        student: 0,
        parent: 0
      };

      users.forEach(user => {
        if (user.role) {
          roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
        }
      });

      return roleCounts;
    } catch (error) {
      console.error('Error getting users by role:', error);
      return { admin: 0, teacher: 0, student: 0, parent: 0 };
    }
  }

  // Get total courses count
  async getTotalCourses() {
    try {
      const courses = await this.firestore.getCollection('courses');
      return courses.length;
    } catch (error) {
      console.error('Error getting total courses:', error);
      return 0;
    }
  }

  // Get courses statistics
  async getCoursesStats() {
    try {
      const courses = await this.firestore.getCollection('courses');
      
      const stats = {
        total: courses.length,
        active: 0,
        inactive: 0,
        totalLessons: 0,
        totalExams: 0,
        totalEnrollments: 0,
        averageRating: 0,
        bySubject: {},
        byLevel: {},
        byDifficulty: {}
      };

      let totalRating = 0;
      let ratedCourses = 0;

      courses.forEach(course => {
        // Status
        if (course.status === 'active') {
          stats.active++;
        } else {
          stats.inactive++;
        }

        // Lessons and Exams
        stats.totalLessons += course.lessons?.length || 0;
        stats.totalExams += course.exams?.length || 0;
        stats.totalEnrollments += course.enrolledStudents || 0;

        // Rating
        if (course.averageRating) {
          totalRating += course.averageRating;
          ratedCourses++;
        }

        // By Subject
        if (course.subject) {
          stats.bySubject[course.subject] = (stats.bySubject[course.subject] || 0) + 1;
        }

        // By Level
        if (course.educationLevel) {
          stats.byLevel[course.educationLevel] = (stats.byLevel[course.educationLevel] || 0) + 1;
        }

        // By Difficulty
        if (course.difficulty) {
          stats.byDifficulty[course.difficulty] = (stats.byDifficulty[course.difficulty] || 0) + 1;
        }
      });

      stats.averageRating = ratedCourses > 0 ? (totalRating / ratedCourses).toFixed(1) : 0;

      return stats;
    } catch (error) {
      console.error('Error getting courses stats:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        totalLessons: 0,
        totalExams: 0,
        totalEnrollments: 0,
        averageRating: 0,
        bySubject: {},
        byLevel: {},
        byDifficulty: {}
      };
    }
  }

  // Get enrollments statistics
  async getEnrollmentsStats() {
    try {
      const enrollments = await this.firestore.getCollection('enrollments');
      
      const stats = {
        total: enrollments.length,
        completed: 0,
        inProgress: 0,
        byCourse: {},
        byMonth: {},
        averageProgress: 0
      };

      let totalProgress = 0;
      let enrollmentsWithProgress = 0;

      enrollments.forEach(enrollment => {
        // Progress
        if (enrollment.progress >= 100) {
          stats.completed++;
        } else {
          stats.inProgress++;
        }

        if (enrollment.progress !== undefined) {
          totalProgress += enrollment.progress;
          enrollmentsWithProgress++;
        }

        // By Course
        if (enrollment.courseId) {
          stats.byCourse[enrollment.courseId] = (stats.byCourse[enrollment.courseId] || 0) + 1;
        }

        // By Month
        if (enrollment.createdAt) {
          const month = new Date(enrollment.createdAt).toISOString().substring(0, 7); // YYYY-MM
          stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
        }
      });

      stats.averageProgress = enrollmentsWithProgress > 0 ? (totalProgress / enrollmentsWithProgress).toFixed(1) : 0;

      return stats;
    } catch (error) {
      console.error('Error getting enrollments stats:', error);
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        byCourse: {},
        byMonth: {},
        averageProgress: 0
      };
    }
  }

  // Get transactions statistics
  async getTransactionsStats() {
    try {
      const transactions = await this.firestore.getCollection('transactions');
      
      const stats = {
        total: transactions.length,
        pending: 0,
        approved: 0,
        rejected: 0,
        totalRevenue: 0,
        monthlyRevenue: {},
        byPlanType: {}
      };

      transactions.forEach(transaction => {
        // Status
        switch (transaction.status) {
          case 'pending':
            stats.pending++;
            break;
          case 'approved':
            stats.approved++;
            stats.totalRevenue += transaction.amount || 0;
            break;
          case 'rejected':
            stats.rejected++;
            break;
        }

        // Monthly Revenue (only approved)
        if (transaction.status === 'approved' && transaction.createdAt) {
          const month = new Date(transaction.createdAt).toISOString().substring(0, 7); // YYYY-MM
          stats.monthlyRevenue[month] = (stats.monthlyRevenue[month] || 0) + (transaction.amount || 0);
        }

        // By Plan Type
        if (transaction.planType) {
          stats.byPlanType[transaction.planType] = (stats.byPlanType[transaction.planType] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting transactions stats:', error);
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        totalRevenue: 0,
        monthlyRevenue: {},
        byPlanType: {}
      };
    }
  }

  // Get recent activities
  async getRecentActivities(limit = 10) {
    try {
      const activities = [];
      
      // Recent enrollments
      const enrollments = await this.firestore.getCollection('enrollments');
      enrollments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .forEach(enrollment => {
          activities.push({
            id: `enrollment_${enrollment.id}`,
            type: 'enrollment',
            title: 'Đăng ký khóa học mới',
            description: `Học sinh đăng ký khóa học "${enrollment.courseTitle}"`,
            timestamp: enrollment.createdAt,
            userId: enrollment.studentId
          });
        });

      // Recent transactions
      const transactions = await this.firestore.getCollection('transactions');
      transactions
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .forEach(transaction => {
          activities.push({
            id: `transaction_${transaction.id}`,
            type: 'transaction',
            title: 'Giao dịch thanh toán',
            description: `${transaction.userName} - ${transaction.amount?.toLocaleString('vi-VN')} VNĐ`,
            timestamp: transaction.createdAt,
            userId: transaction.userId,
            status: transaction.status
          });
        });

      // Recent course completions
      const completions = enrollments.filter(e => e.progress >= 100);
      completions
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 3)
        .forEach(enrollment => {
          activities.push({
            id: `completion_${enrollment.id}`,
            type: 'completion',
            title: 'Hoàn thành khóa học',
            description: `Học sinh hoàn thành khóa học "${enrollment.courseTitle}"`,
            timestamp: enrollment.updatedAt,
            userId: enrollment.studentId
          });
        });

      // Sort by timestamp and return limited results
      return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recent activities:', error);
      return [];
    }
  }

  // Get comprehensive dashboard stats
  async getDashboardStats() {
    try {
      const [
        totalUsers,
        usersByRole,
        coursesStats,
        enrollmentsStats,
        transactionsStats,
        recentActivities
      ] = await Promise.all([
        this.getTotalUsers(),
        this.getUsersByRole(),
        this.getCoursesStats(),
        this.getEnrollmentsStats(),
        this.getTransactionsStats(),
        this.getRecentActivities()
      ]);

      return {
        users: {
          total: totalUsers,
          byRole: usersByRole
        },
        courses: coursesStats,
        enrollments: enrollmentsStats,
        transactions: transactionsStats,
        recentActivities
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        users: { total: 0, byRole: { admin: 0, teacher: 0, student: 0, parent: 0 } },
        courses: { total: 0, active: 0, inactive: 0, totalLessons: 0, totalExams: 0, totalEnrollments: 0, averageRating: 0 },
        enrollments: { total: 0, completed: 0, inProgress: 0, averageProgress: 0 },
        transactions: { total: 0, pending: 0, approved: 0, rejected: 0, totalRevenue: 0 },
        recentActivities: []
      };
    }
  }
}

const adminAnalyticsService = new AdminAnalyticsService();
export default adminAnalyticsService;
