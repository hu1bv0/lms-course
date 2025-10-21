/**
 * Firebase Firestore Service
 * 
 * Handles all Firestore database operations including:
 * - CRUD operations for collections
 * - Query operations with filters and sorting
 * - Real-time listeners
 * - Batch operations
 * - Transaction operations
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  onSnapshot,
  writeBatch,
  runTransaction,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../configs/firebase.config';

// Collection names constants
export const COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  LESSONS: 'lessons',
  ENROLLMENTS: 'enrollments',
  PAYMENTS: 'payments',
  NOTIFICATIONS: 'notifications',
  SUBSCRIPTIONS: 'subscriptions',
  ANALYTICS: 'analytics',
  CHAT_MESSAGES: 'chatMessages',
  ASSIGNMENTS: 'assignments',
  QUIZZES: 'quizzes',
  CERTIFICATES: 'certificates',
  LESSON_COMPLETIONS: 'lesson_completions',
  EXAM_RESULTS: 'exam_results',
  PART_COMPLETIONS: 'part_completions',
  CHAT_SESSIONS: 'chat_sessions',
  CHAT_MESSAGES: 'chat_messages'
};

class FirestoreService {
  constructor() {
    this.db = db;
  }

  /**
   * Handle Firestore errors
   * @param {Error} error - Firestore error object
   * @returns {Error} - Formatted error with Vietnamese message
   */
  handleError(error) {
    const errorMessages = {
      'permission-denied': 'Không có quyền truy cập',
      'not-found': 'Không tìm thấy dữ liệu',
      'already-exists': 'Dữ liệu đã tồn tại',
      'invalid-argument': 'Tham số không hợp lệ',
      'deadline-exceeded': 'Hết thời gian chờ',
      'resource-exhausted': 'Tài nguyên đã hết',
      'failed-precondition': 'Điều kiện tiên quyết không đúng',
      'aborted': 'Thao tác bị hủy',
      'out-of-range': 'Giá trị nằm ngoài phạm vi',
      'unimplemented': 'Chức năng chưa được triển khai',
      'internal': 'Lỗi nội bộ',
      'unavailable': 'Dịch vụ không khả dụng',
      'data-loss': 'Mất dữ liệu',
      'unauthenticated': 'Chưa xác thực'
    };

    const message = errorMessages[error.code] || error.message;
    return new Error(message);
  }

  /**
   * Serialize Firebase data (convert Timestamps to ISO strings)
   * @param {Object} data - Data to serialize
   * @returns {Object} - Serialized data
   */
  serializeData(data) {
    if (!data) return data;
    
    const serialized = { ...data };
    
    Object.keys(serialized).forEach(key => {
      const value = serialized[key];
      if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
        // This is a Firebase Timestamp
        serialized[key] = new Date(value.seconds * 1000).toISOString();
      } else if (Array.isArray(value)) {
        // Recursively serialize arrays
        serialized[key] = value.map(item => {
          if (item && typeof item === 'object') {
            return this.serializeData(item);
          }
          return item;
        });
      } else if (value && typeof value === 'object') {
        // Recursively serialize nested objects
        serialized[key] = this.serializeData(value);
      }
    });
    
    return serialized;
  }

  /**
   * Get document by ID
   * @param {string} collectionName - Collection name
   * @param {string} docId - Document ID
   * @returns {Promise<Object>} - Document data with success flag
   */
  async getDocument(collectionName, docId) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const rawData = docSnap.data();
        console.log(`🔍 [FirestoreService] RAW data from ${collectionName}/${docId}:`, rawData);
        console.log(`🔍 [FirestoreService] RAW lessons:`, rawData?.lessons);
        console.log(`🔍 [FirestoreService] RAW exams:`, rawData?.exams);
        
        const serializedData = this.serializeData(rawData);
        console.log(`✅ [FirestoreService] SERIALIZED data:`, serializedData);
        console.log(`✅ [FirestoreService] SERIALIZED lessons:`, serializedData?.lessons);
        console.log(`✅ [FirestoreService] SERIALIZED exams:`, serializedData?.exams);
        
        return {
          success: true,
          data: serializedData,
          id: docSnap.id
        };
      }
      return {
        success: false,
        data: null,
        id: docId,
        error: 'Document not found'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        id: docId,
        error: this.handleError(error).message
      };
    }
  }

  /**
   * Get all documents from collection
   * @param {string} collectionName - Collection name
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Array of documents
   */
  async getCollection(collectionName, options = {}) {
    try {
      let q = collection(this.db, collectionName);

      // Apply filters
      if (options.where) {
        options.where.forEach(filter => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
      }

      // Apply ordering
      if (options.orderBy) {
        options.orderBy.forEach(order => {
          q = query(q, orderBy(order.field, order.direction || 'asc'));
        });
      }

      // Apply limit
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...this.serializeData(doc.data())
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new document
   * @param {string} collectionName - Collection name
   * @param {Object} data - Document data
   * @param {string} docId - Optional document ID
   * @returns {Promise<Object>} - Created document data
   */
  async createDocument(collectionName, data, docId = null) {
    try {
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      let docRef;
      if (docId) {
        docRef = doc(this.db, collectionName, docId);
        await setDoc(docRef, docData);
      } else {
        docRef = await addDoc(collection(this.db, collectionName), docData);
      }

      return { id: docRef.id, ...data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update document
   * @param {string} collectionName - Collection name
   * @param {string} docId - Document ID
   * @param {Object} data - Data to update
   * @returns {Promise<Object>} - Update result
   */
  async updateDocument(collectionName, docId, data) {
    try {
      console.log('updateDocument called with:', { collectionName, docId, data });
      
      const docRef = doc(this.db, collectionName, docId);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };

      console.log('updateData:', updateData);
      
      await updateDoc(docRef, updateData);
      return { success: true, id: docId };
    } catch (error) {
      console.error('updateDocument error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete document
   * @param {string} collectionName - Collection name
   * @param {string} docId - Document ID
   * @returns {Promise<Object>} - Delete result
   */
  async deleteDocument(collectionName, docId) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await deleteDoc(docRef);
      return { success: true, id: docId };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Listen to document changes
   * @param {string} collectionName - Collection name
   * @param {string} docId - Document ID
   * @param {Function} callback - Callback function
   * @returns {Function} - Unsubscribe function
   */
  listenToDocument(collectionName, docId, callback) {
    const docRef = doc(this.db, collectionName, docId);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...this.serializeData(doc.data()) });
      } else {
        callback(null);
      }
    });
  }

  /**
   * Listen to collection changes
   * @param {string} collectionName - Collection name
   * @param {Object} options - Query options
   * @param {Function} callback - Callback function
   * @returns {Function} - Unsubscribe function
   */
  listenToCollection(collectionName, options = {}, callback) {
    let q = collection(this.db, collectionName);

    // Apply filters
    if (options.where) {
      options.where.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
    }

    // Apply ordering
    if (options.orderBy) {
      options.orderBy.forEach(order => {
        q = query(q, orderBy(order.field, order.direction || 'asc'));
      });
    }

    // Apply limit
    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    return onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...this.serializeData(doc.data())
      }));
      callback(docs);
    });
  }

  /**
   * Execute batch operations
   * @param {Array} operations - Array of operations
   * @returns {Promise<Object>} - Batch result
   */
  async executeBatch(operations) {
    try {
      const batch = writeBatch(this.db);

      operations.forEach(operation => {
        const { type, collectionName, docId, data } = operation;
        const docRef = doc(this.db, collectionName, docId);

        switch (type) {
          case 'create':
            batch.set(docRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
            break;
          case 'update':
            batch.update(docRef, { ...data, updatedAt: serverTimestamp() });
            break;
          case 'delete':
            batch.delete(docRef);
            break;
          default:
            throw new Error(`Unknown operation type: ${type}`);
        }
      });

      await batch.commit();
      return { success: true };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Execute transaction
   * @param {Function} updateFunction - Transaction update function
   * @returns {Promise<Object>} - Transaction result
   */
  async executeTransaction(updateFunction) {
    try {
      const result = await runTransaction(this.db, updateFunction);
      return { success: true, result };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Increment field value
   * @param {string} collectionName - Collection name
   * @param {string} docId - Document ID
   * @param {string} field - Field name
   * @param {number} value - Value to increment by
   * @returns {Promise<Object>} - Update result
   */
  async incrementField(collectionName, docId, field, value = 1) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await updateDoc(docRef, {
        [field]: increment(value),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Add item to array field
   * @param {string} collectionName - Collection name
   * @param {string} docId - Document ID
   * @param {string} field - Array field name
   * @param {*} value - Value to add
   * @returns {Promise<Object>} - Update result
   */
  async addToArray(collectionName, docId, field, value) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await updateDoc(docRef, {
        [field]: arrayUnion(value),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Remove item from array field
   * @param {string} collectionName - Collection name
   * @param {string} docId - Document ID
   * @param {string} field - Array field name
   * @param {*} value - Value to remove
   * @returns {Promise<Object>} - Update result
   */
  async removeFromArray(collectionName, docId, field, value) {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await updateDoc(docRef, {
        [field]: arrayRemove(value),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search documents with text search (basic implementation)
   * @param {string} collectionName - Collection name
   * @param {string} field - Field to search in
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} - Search results
   */
  async searchDocuments(collectionName, field, searchTerm) {
    try {
      // Note: This is a basic implementation. For production, consider using
      // Algolia or Elasticsearch for better text search capabilities
      const q = query(
        collection(this.db, collectionName),
        where(field, '>=', searchTerm),
        where(field, '<=', searchTerm + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...this.serializeData(doc.data())
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get paginated documents
   * @param {string} collectionName - Collection name
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} - Paginated results
   */
  async getPaginatedDocuments(collectionName, options = {}) {
    try {
      const { pageSize = 10, lastDoc = null, orderByField = 'createdAt', orderDirection = 'desc' } = options;
      
      let q = query(
        collection(this.db, collectionName),
        orderBy(orderByField, orderDirection),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...this.serializeData(doc.data())
      }));

      return {
        docs,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
        hasMore: querySnapshot.docs.length === pageSize
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Create and export singleton instance
const firestoreService = new FirestoreService();
export default firestoreService;
