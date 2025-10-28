/**
 * Firebase Authentication Service
 * 
 * Handles all authentication-related operations including:
 * - User registration and login
 * - Social authentication (Google, Facebook)
 * - Password management
 * - Email verification
 * - User profile management
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updateEmail,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { auth, db } from '../../configs/firebase.config';

// User roles constants
export const USER_ROLES = {
  ADMIN: 'admin',
  PARENT: 'parent',
  STUDENT: 'student'
};

// Subscription types constants
export const SUBSCRIPTION_TYPES = {
  FREE: 'free',
  PREMIUM: 'premium'
};

// Error messages mapping
const ERROR_MESSAGES = {
  'auth/user-not-found': 'Không tìm thấy tài khoản với email này',
  'auth/wrong-password': 'Mật khẩu không chính xác',
  'auth/email-already-in-use': 'Email này đã được sử dụng',
  'auth/weak-password': 'Mật khẩu phải có ít nhất 6 ký tự',
  'auth/invalid-email': 'Email không hợp lệ',
  'auth/user-disabled': 'Tài khoản đã bị vô hiệu hóa',
  'auth/too-many-requests': 'Quá nhiều yêu cầu, vui lòng thử lại sau',
  'auth/network-request-failed': 'Lỗi kết nối mạng',
  'auth/invalid-credential': 'Thông tin đăng nhập không hợp lệ'
};

class AuthService {
  constructor() {
    this.providers = {
      google: new GoogleAuthProvider(),
      facebook: new FacebookAuthProvider()
    };
  }

  /**
   * Handle authentication errors
   * @param {Error} error - Firebase error object
   * @returns {Error} - Formatted error with Vietnamese message
   */
  handleAuthError(error) {
    const errorCode = error.code;
    const message = ERROR_MESSAGES[errorCode] || error.message;
    return new Error(message);
  }

  /**
   * Generate unique user code for students
   * @returns {string} - 6 character alphanumeric code
   */
  generateUserCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Register new user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} userData - Additional user data
   * @returns {Promise<Object>} - Registration result
   */
  async register(email, password, userData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Update user profile
      await updateProfile(user, {
        displayName: userData.displayName || userData.fullName
      });

      // Prepare user data for Firestore
      const firestoreUserData = {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName || userData.fullName,
        role: userData.role || USER_ROLES.STUDENT,
        subscriptionType: SUBSCRIPTION_TYPES.FREE,
        createdAt: new Date(),
        updatedAt: new Date(),
        isEmailVerified: false,
        ...userData
      };

      // Generate userCode for students
      if (firestoreUserData.role === USER_ROLES.STUDENT) {
        firestoreUserData.userCode = this.generateUserCode();
      }

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), firestoreUserData);

      return { success: true, user };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Login result
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;

      return { success: true, user, userData };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Login with Google
   * @returns {Promise<Object>} - Login result
   */
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, this.providers.google);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: USER_ROLES.STUDENT,
          subscriptionType: SUBSCRIPTION_TYPES.FREE,
          createdAt: new Date(),
          updatedAt: new Date(),
          isEmailVerified: user.emailVerified,
          provider: 'google'
        });
      }

      return { success: true, user };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Login with Facebook
   * @returns {Promise<Object>} - Login result
   */
  async loginWithFacebook() {
    try {
      const result = await signInWithPopup(auth, this.providers.facebook);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: USER_ROLES.STUDENT,
          subscriptionType: SUBSCRIPTION_TYPES.FREE,
          createdAt: new Date(),
          updatedAt: new Date(),
          isEmailVerified: user.emailVerified,
          provider: 'facebook'
        });
      }

      return { success: true, user };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<Object>} - Reset result
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Email đặt lại mật khẩu đã được gửi' };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Update result
   */
  async updateUserPassword(newPassword) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Không có người dùng đang đăng nhập');

      await updatePassword(user, newPassword);
      return { success: true, message: 'Mật khẩu đã được cập nhật' };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} - Update result
   */
  async updateUserProfile(profileData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Không có người dùng đang đăng nhập');

      // Prepare Firebase Auth profile update (only update if fields are provided)
      const authProfileUpdate = {};
      if (profileData.displayName !== undefined) {
        authProfileUpdate.displayName = profileData.displayName;
      }
      if (profileData.photoURL !== undefined) {
        authProfileUpdate.photoURL = profileData.photoURL;
      }

      // Update Firebase Auth profile if there are fields to update
      if (Object.keys(authProfileUpdate).length > 0) {
        await updateProfile(user, authProfileUpdate);
      }

      // Prepare Firestore update data (remove undefined values)
      const firestoreData = Object.fromEntries(
        Object.entries(profileData).filter(([_, v]) => v !== undefined)
      );
      
      // Update Firestore user document
      await updateDoc(doc(db, 'users', user.uid), {
        ...firestoreData,
        updatedAt: new Date()
      });

      return { success: true, message: 'Thông tin cá nhân đã được cập nhật' };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user email
   * @param {string} newEmail - New email address
   * @returns {Promise<Object>} - Update result
   */
  async updateUserEmail(newEmail) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Không có người dùng đang đăng nhập');

      await updateEmail(user, newEmail);
      
      // Update Firestore user document
      await updateDoc(doc(db, 'users', user.uid), {
        email: newEmail,
        updatedAt: new Date()
      });

      return { success: true, message: 'Email đã được cập nhật' };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Delete user account
   * @param {string} password - Current password for verification
   * @returns {Promise<Object>} - Delete result
   */
  async deleteUserAccount(password) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Không có người dùng đang đăng nhập');

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', user.uid));

      // Delete user account
      await deleteUser(user);

      return { success: true, message: 'Tài khoản đã được xóa' };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current user data
   * @returns {Promise<Object|null>} - User data or null
   */
  async getCurrentUser() {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} - User data or null
   */
  async getUserById(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get users by role
   * @param {string} role - User role
   * @returns {Promise<Array>} - Array of users
   */
  async getUsersByRole(role) {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', role),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Listen to authentication state changes
   * @param {Function} callback - Callback function
   * @returns {Function} - Unsubscribe function
   */
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {Promise<boolean>} - True if user has role
   */
  async hasRole(role) {
    try {
      const userData = await this.getCurrentUser();
      return userData && userData.role === role;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if user has specific subscription
   * @param {string} subscriptionType - Subscription type to check
   * @returns {Promise<boolean>} - True if user has subscription
   */
  async hasSubscription(subscriptionType) {
    try {
      const userData = await this.getCurrentUser();
      return userData && userData.subscriptionType === subscriptionType;
    } catch (error) {
      return false;
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
