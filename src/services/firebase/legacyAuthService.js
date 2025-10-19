/**
 * Legacy Auth Service Wrapper
 * 
 * This file provides backward compatibility for the existing authService
 * while using the new centralized Firebase services underneath.
 * 
 * This allows existing code to continue working without changes while
 * gradually migrating to the new Firebase service architecture.
 */

import { authService, firestoreService, utilsService } from './index';
import { uploadImageToCloudinary } from '../../configs/cloudinary.config';

// Re-export constants for backward compatibility
export const USER_ROLES = authService.USER_ROLES;
export const SUBSCRIPTION_TYPES = authService.SUBSCRIPTION_TYPES;

// Helper function to serialize Firebase data (legacy compatibility)
const serializeFirebaseData = (data) => {
  return utilsService.serializeData ? utilsService.serializeData(data) : data;
};

class LegacyAuthService {
  constructor() {
    this.firebaseAuth = authService;
    this.firestore = firestoreService;
    this.utils = utilsService;
  }

  // Đăng ký tài khoản mới
  async register(email, password, userData) {
    try {
      const result = await this.firebaseAuth.register(email, password, userData);
      
      // Upload avatar to Cloudinary if provided
      if (userData.avatar) {
        try {
          const cloudinaryResult = await uploadImageToCloudinary(userData.avatar);
          await this.firebaseAuth.updateUserProfile({
            photoURL: cloudinaryResult.secure_url
          });
        } catch (error) {
          console.warn('Failed to upload avatar to Cloudinary:', error);
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Đăng nhập
  async login(email, password) {
    try {
      return await this.firebaseAuth.login(email, password);
    } catch (error) {
      throw error;
    }
  }

  // Đăng nhập với Google
  async loginWithGoogle() {
    try {
      return await this.firebaseAuth.loginWithGoogle();
    } catch (error) {
      throw error;
    }
  }

  // Đăng nhập với Facebook
  async loginWithFacebook() {
    try {
      return await this.firebaseAuth.loginWithFacebook();
    } catch (error) {
      throw error;
    }
  }

  // Đăng xuất
  async logout() {
    try {
      return await this.firebaseAuth.logout();
    } catch (error) {
      throw error;
    }
  }

  // Gửi email đặt lại mật khẩu
  async forgotPassword(email) {
    try {
      return await this.firebaseAuth.resetPassword(email);
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật mật khẩu
  async changePassword(newPassword) {
    try {
      return await this.firebaseAuth.updateUserPassword(newPassword);
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật thông tin cá nhân
  async updateProfile(profileData) {
    try {
      // Upload avatar to Cloudinary if provided
      if (profileData.avatar) {
        try {
          const cloudinaryResult = await uploadImageToCloudinary(profileData.avatar);
          profileData.photoURL = cloudinaryResult.secure_url;
        } catch (error) {
          console.warn('Failed to upload avatar to Cloudinary:', error);
        }
      }

      return await this.firebaseAuth.updateUserProfile(profileData);
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật email
  async updateEmail(newEmail) {
    try {
      return await this.firebaseAuth.updateUserEmail(newEmail);
    } catch (error) {
      throw error;
    }
  }

  // Xóa tài khoản
  async deleteAccount(password) {
    try {
      return await this.firebaseAuth.deleteUserAccount(password);
    } catch (error) {
      throw error;
    }
  }

  // Lấy thông tin user hiện tại
  async getCurrentUser() {
    try {
      return await this.firebaseAuth.getCurrentUser();
    } catch (error) {
      throw error;
    }
  }

  // Lấy user theo ID
  async getUserById(userId) {
    try {
      return await this.firebaseAuth.getUserById(userId);
    } catch (error) {
      throw error;
    }
  }

  // Lấy users theo role
  async getUsersByRole(role) {
    try {
      return await this.firebaseAuth.getUsersByRole(role);
    } catch (error) {
      throw error;
    }
  }

  // Lắng nghe thay đổi trạng thái đăng nhập
  onAuthStateChange(callback) {
    return this.firebaseAuth.onAuthStateChange(callback);
  }

  // Kiểm tra role
  async hasRole(role) {
    try {
      return await this.firebaseAuth.hasRole(role);
    } catch (error) {
      return false;
    }
  }

  // Kiểm tra subscription
  async hasSubscription(subscriptionType) {
    try {
      return await this.firebaseAuth.hasSubscription(subscriptionType);
    } catch (error) {
      return false;
    }
  }

  // Cập nhật subscription
  async updateSubscription(userId, subscriptionType) {
    try {
      return await this.firestore.updateDocument('users', userId, {
        subscriptionType,
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  }

  // Lấy thống kê users
  async getUserStats() {
    try {
      const [students, parents, admins] = await Promise.all([
        this.firebaseAuth.getUsersByRole(USER_ROLES.STUDENT),
        this.firebaseAuth.getUsersByRole(USER_ROLES.PARENT),
        this.firebaseAuth.getUsersByRole(USER_ROLES.ADMIN)
      ]);

      return {
        total: students.length + parents.length + admins.length,
        students: students.length,
        parents: parents.length,
        admins: admins.length,
        freeUsers: [...students, ...parents].filter(user => user.subscriptionType === SUBSCRIPTION_TYPES.FREE).length,
        premiumUsers: [...students, ...parents].filter(user => user.subscriptionType === SUBSCRIPTION_TYPES.PREMIUM).length
      };
    } catch (error) {
      throw error;
    }
  }

  // Tìm kiếm users
  async searchUsers(searchTerm) {
    try {
      const users = await this.firestore.searchDocuments('users', 'displayName', searchTerm);
      return users;
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách users với pagination
  async getUsersPaginated(options = {}) {
    try {
      const { pageSize = 20, lastDoc = null, role = null } = options;
      
      let queryOptions = {
        pageSize,
        lastDoc,
        orderByField: 'createdAt',
        orderDirection: 'desc'
      };

      if (role) {
        queryOptions.where = [
          { field: 'role', operator: '==', value: role }
        ];
      }

      return await this.firestore.getPaginatedDocuments('users', queryOptions);
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật trạng thái user
  async updateUserStatus(userId, isActive) {
    try {
      return await this.firestore.updateDocument('users', userId, {
        isActive,
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  }

  // Lấy lịch sử hoạt động của user
  async getUserActivity(userId, limit = 50) {
    try {
      const activities = await this.firestore.getCollection('userActivities', {
        where: [
          { field: 'userId', operator: '==', value: userId }
        ],
        limit
      });

      // Sort on client side by createdAt (newest first)
      const sortedActivities = activities.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA; // Descending order (newest first)
      });

      return sortedActivities.slice(0, limit);
    } catch (error) {
      throw error;
    }
  }

  // Ghi log hoạt động
  async logUserActivity(userId, activity, metadata = {}) {
    try {
      return await this.firestore.createDocument('userActivities', {
        userId,
        activity,
        metadata,
        timestamp: new Date(),
        ipAddress: metadata.ipAddress || 'unknown',
        userAgent: metadata.userAgent || navigator.userAgent
      });
    } catch (error) {
      console.warn('Failed to log user activity:', error);
    }
  }

  // Lấy thông tin chi tiết user với các liên quan
  async getUserDetails(userId) {
    try {
      const user = await this.firebaseAuth.getUserById(userId);
      if (!user) return null;

      // Lấy thêm thông tin liên quan
      const [activities, enrollments] = await Promise.all([
        this.getUserActivity(userId, 10),
        this.firestore.getCollection('enrollments', {
          where: [
            { field: 'userId', operator: '==', value: userId }
          ],
          limit: 10
        })
      ]);

      return {
        ...user,
        recentActivities: activities,
        recentEnrollments: enrollments
      };
    } catch (error) {
      throw error;
    }
  }

  // Export data của user (GDPR compliance)
  async exportUserData(userId) {
    try {
      const user = await this.firebaseAuth.getUserById(userId);
      if (!user) return null;

      const [activities, enrollments, payments] = await Promise.all([
        this.firestore.getCollection('userActivities', {
          where: [
            { field: 'userId', operator: '==', value: userId }
          ]
        }),
        this.firestore.getCollection('enrollments', {
          where: [
            { field: 'userId', operator: '==', value: userId }
          ]
        }),
        this.firestore.getCollection('payments', {
          where: [
            { field: 'userId', operator: '==', value: userId }
          ]
        })
      ]);

      return {
        user: serializeFirebaseData(user),
        activities: activities.map(activity => serializeFirebaseData(activity)),
        enrollments: enrollments.map(enrollment => serializeFirebaseData(enrollment)),
        payments: payments.map(payment => serializeFirebaseData(payment)),
        exportedAt: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  // Xóa data của user (GDPR compliance)
  async deleteUserData(userId) {
    try {
      // Lấy danh sách các collections cần xóa
      const collections = ['userActivities', 'enrollments', 'payments', 'notifications'];
      
      const deletePromises = collections.map(async (collection) => {
        const docs = await this.firestore.getCollection(collection, {
          where: [
            { field: 'userId', operator: '==', value: userId }
          ]
        });
        
        const deleteOps = docs.map(doc => ({
          type: 'delete',
          collectionName: collection,
          docId: doc.id
        }));
        
        if (deleteOps.length > 0) {
          return this.firestore.executeBatch(deleteOps);
        }
      });

      await Promise.all(deletePromises);

      // Xóa user document
      await this.firestore.deleteDocument('users', userId);

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Tạo transaction mới
  async createTransaction(transactionData) {
    try {
      return await this.firestore.createDocument('transactions', {
        ...transactionData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  }

  // Lấy transactions
  async getTransactions(status = null) {
    try {
      const options = {};

      if (status) {
        options.where = [
          { field: 'status', operator: '==', value: status }
        ];
      }

      const transactions = await this.firestore.getCollection('transactions', options);
      
      // Sort on client side by createdAt (newest first)
      const sortedTransactions = transactions.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA; // Descending order (newest first)
      });
      
      return {
        success: true,
        transactions: sortedTransactions
      };
    } catch (error) {
      throw error;
    }
  }

  // Phê duyệt transaction
  async approveTransaction(transactionId, adminId) {
    try {
      // First, get the transaction details
      const transactionDoc = await this.firestore.getDocument('transactions', transactionId);
      if (!transactionDoc.success) {
        throw new Error('Transaction not found');
      }

      const transaction = transactionDoc.data;
      const userId = transaction.userId;
      const planType = transaction.planType;

      // Update transaction status
      await this.firestore.updateDocument('transactions', transactionId, {
        status: 'approved',
        approvedBy: adminId,
        approvedAt: new Date(),
        updatedAt: new Date()
      });

      // Update user subscription
      if (userId && planType) {
        await this.firestore.updateDocument('users', userId, {
          subscriptionType: planType,
          subscriptionUpdatedAt: new Date(),
          updatedAt: new Date()
        });
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Từ chối transaction
  async rejectTransaction(transactionId, adminId, reason) {
    try {
      await this.firestore.updateDocument('transactions', transactionId, {
        status: 'rejected',
        rejectedBy: adminId,
        rejectedAt: new Date(),
        rejectionReason: reason,
        updatedAt: new Date()
      });

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const legacyAuthService = new LegacyAuthService();
export default legacyAuthService;
