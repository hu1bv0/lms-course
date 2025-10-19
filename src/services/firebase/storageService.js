/**
 * Firebase Storage Service
 * 
 * Handles all Firebase Storage operations including:
 * - File upload and download
 * - Image processing and resizing
 * - File metadata management
 * - Progress tracking
 * - File deletion and cleanup
 */

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getMetadata,
  updateMetadata,
  listAll,
  getBlob
} from 'firebase/storage';
import { storage } from '../../configs/firebase.config';

// Storage paths constants
export const STORAGE_PATHS = {
  AVATARS: 'avatars',
  COURSE_THUMBNAILS: 'courses/thumbnails',
  LESSON_VIDEOS: 'lessons/videos',
  LESSON_MATERIALS: 'lessons/materials',
  ASSIGNMENTS: 'assignments',
  CERTIFICATES: 'certificates',
  PROFILE_PHOTOS: 'profiles/photos',
  DOCUMENTS: 'documents',
  TEMP: 'temp'
};

// File type constants
export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'],
  AUDIO: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  SPREADSHEET: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  PRESENTATION: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
};

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  AVATAR: 5 * 1024 * 1024, // 5MB
  THUMBNAIL: 10 * 1024 * 1024, // 10MB
  VIDEO: 500 * 1024 * 1024, // 500MB
  DOCUMENT: 50 * 1024 * 1024, // 50MB
  DEFAULT: 25 * 1024 * 1024 // 25MB
};

class StorageService {
  constructor() {
    this.storage = storage;
  }

  /**
   * Handle storage errors
   * @param {Error} error - Storage error object
   * @returns {Error} - Formatted error with Vietnamese message
   */
  handleError(error) {
    const errorMessages = {
      'storage/object-not-found': 'File không tồn tại',
      'storage/bucket-not-found': 'Bucket không tồn tại',
      'storage/project-not-found': 'Project không tồn tại',
      'storage/quota-exceeded': 'Đã vượt quá dung lượng cho phép',
      'storage/unauthenticated': 'Chưa xác thực',
      'storage/unauthorized': 'Không có quyền truy cập',
      'storage/retry-limit-exceeded': 'Vượt quá số lần thử lại',
      'storage/invalid-checksum': 'Checksum không hợp lệ',
      'storage/canceled': 'Upload bị hủy',
      'storage/invalid-event-name': 'Tên sự kiện không hợp lệ',
      'storage/invalid-url': 'URL không hợp lệ',
      'storage/invalid-argument': 'Tham số không hợp lệ',
      'storage/no-default-bucket': 'Không có bucket mặc định',
      'storage/cannot-slice-blob': 'Không thể chia nhỏ file',
      'storage/server-file-wrong-size': 'Kích thước file trên server không đúng'
    };

    const message = errorMessages[error.code] || error.message;
    return new Error(message);
  }

  /**
   * Validate file type
   * @param {File} file - File to validate
   * @param {Array} allowedTypes - Allowed file types
   * @returns {boolean} - True if valid
   */
  validateFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
  }

  /**
   * Validate file size
   * @param {File} file - File to validate
   * @param {number} maxSize - Maximum file size in bytes
   * @returns {boolean} - True if valid
   */
  validateFileSize(file, maxSize) {
    return file.size <= maxSize;
  }

  /**
   * Generate unique filename
   * @param {string} originalName - Original filename
   * @param {string} userId - User ID
   * @returns {string} - Unique filename
   */
  generateUniqueFilename(originalName, userId = '') {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    
    return `${userId}_${baseName}_${timestamp}_${randomString}.${extension}`;
  }

  /**
   * Get storage reference
   * @param {string} path - Storage path
   * @param {string} filename - Filename
   * @returns {Object} - Storage reference
   */
  getStorageRef(path, filename) {
    return ref(this.storage, `${path}/${filename}`);
  }

  /**
   * Upload file to Firebase Storage
   * @param {File} file - File to upload
   * @param {string} path - Storage path
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} - Upload result
   */
  async uploadFile(file, path, options = {}) {
    try {
      const {
        filename = null,
        userId = '',
        metadata = {},
        onProgress = null,
        validateType = true,
        validateSize = true,
        maxSize = FILE_SIZE_LIMITS.DEFAULT
      } = options;

      // Validate file type
      if (validateType) {
        const allowedTypes = Object.values(FILE_TYPES).flat();
        if (!this.validateFileType(file, allowedTypes)) {
          throw new Error('Loại file không được hỗ trợ');
        }
      }

      // Validate file size
      if (validateSize) {
        if (!this.validateFileSize(file, maxSize)) {
          throw new Error(`File quá lớn. Kích thước tối đa: ${Math.round(maxSize / 1024 / 1024)}MB`);
        }
      }

      // Generate filename
      const finalFilename = filename || this.generateUniqueFilename(file.name, userId);

      // Create storage reference
      const storageRef = this.getStorageRef(path, finalFilename);

      // Prepare metadata
      const uploadMetadata = {
        contentType: file.type,
        customMetadata: {
          originalName: file.name,
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          ...metadata
        }
      };

      let uploadResult;

      if (onProgress) {
        // Upload with progress tracking
        const uploadTask = uploadBytesResumable(storageRef, file, uploadMetadata);
        
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            throw this.handleError(error);
          }
        );

        uploadResult = await uploadTask;
      } else {
        // Simple upload
        uploadResult = await uploadBytes(storageRef, file, uploadMetadata);
      }

      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);

      return {
        success: true,
        filename: finalFilename,
        downloadURL,
        metadata: uploadResult.metadata,
        path: `${path}/${finalFilename}`
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload image with automatic resizing
   * @param {File} file - Image file
   * @param {string} path - Storage path
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} - Upload result
   */
  async uploadImage(file, path, options = {}) {
    try {
      const {
        maxWidth = 1920,
        maxHeight = 1080,
        quality = 0.8,
        ...uploadOptions
      } = options;

      // Validate image type
      if (!this.validateFileType(file, FILE_TYPES.IMAGE)) {
        throw new Error('File phải là hình ảnh (JPEG, PNG, GIF, WebP)');
      }

      // Create canvas for image processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      return new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            // Calculate new dimensions
            let { width, height } = img;
            
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width *= ratio;
              height *= ratio;
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw and compress image
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(async (blob) => {
              try {
                const result = await this.uploadFile(blob, path, {
                  ...uploadOptions,
                  validateType: false,
                  validateSize: false
                });
                resolve(result);
              } catch (error) {
                reject(this.handleError(error));
              }
            }, file.type, quality);
          } catch (error) {
            reject(this.handleError(error));
          }
        };

        img.onerror = () => {
          reject(new Error('Không thể tải hình ảnh'));
        };

        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Download file from Firebase Storage
   * @param {string} path - File path
   * @returns {Promise<Blob>} - File blob
   */
  async downloadFile(path) {
    try {
      const storageRef = ref(this.storage, path);
      const blob = await getBlob(storageRef);
      return blob;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get download URL for file
   * @param {string} path - File path
   * @returns {Promise<string>} - Download URL
   */
  async getDownloadURL(path) {
    try {
      const storageRef = ref(this.storage, path);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete file from Firebase Storage
   * @param {string} path - File path
   * @returns {Promise<Object>} - Delete result
   */
  async deleteFile(path) {
    try {
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
      return { success: true, path };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get file metadata
   * @param {string} path - File path
   * @returns {Promise<Object>} - File metadata
   */
  async getFileMetadata(path) {
    try {
      const storageRef = ref(this.storage, path);
      const metadata = await getMetadata(storageRef);
      return metadata;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update file metadata
   * @param {string} path - File path
   * @param {Object} metadata - New metadata
   * @returns {Promise<Object>} - Update result
   */
  async updateFileMetadata(path, metadata) {
    try {
      const storageRef = ref(this.storage, path);
      await updateMetadata(storageRef, metadata);
      return { success: true, path };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * List files in directory
   * @param {string} path - Directory path
   * @returns {Promise<Array>} - List of files
   */
  async listFiles(path) {
    try {
      const storageRef = ref(this.storage, path);
      const result = await listAll(storageRef);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const metadata = await getMetadata(itemRef);
          const downloadURL = await getDownloadURL(itemRef);
          
          return {
            name: itemRef.name,
            path: itemRef.fullPath,
            downloadURL,
            metadata
          };
        })
      );

      return files;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload multiple files
   * @param {Array} files - Array of files
   * @param {string} path - Storage path
   * @param {Object} options - Upload options
   * @returns {Promise<Array>} - Upload results
   */
  async uploadMultipleFiles(files, path, options = {}) {
    try {
      const uploadPromises = files.map(file => 
        this.uploadFile(file, path, options)
      );

      const results = await Promise.allSettled(uploadPromises);
      
      return results.map((result, index) => ({
        file: files[index].name,
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete multiple files
   * @param {Array} paths - Array of file paths
   * @returns {Promise<Array>} - Delete results
   */
  async deleteMultipleFiles(paths) {
    try {
      const deletePromises = paths.map(path => this.deleteFile(path));
      const results = await Promise.allSettled(deletePromises);
      
      return results.map((result, index) => ({
        path: paths[index],
        success: result.status === 'fulfilled',
        error: result.status === 'rejected' ? result.reason.message : null
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get file size in human readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} - Human readable size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file extension
   * @param {string} filename - Filename
   * @returns {string} - File extension
   */
  getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  }

  /**
   * Check if file is image
   * @param {string} filename - Filename
   * @returns {boolean} - True if image
   */
  isImage(filename) {
    const extension = this.getFileExtension(filename);
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    return imageExtensions.includes(extension);
  }

  /**
   * Check if file is video
   * @param {string} filename - Filename
   * @returns {boolean} - True if video
   */
  isVideo(filename) {
    const extension = this.getFileExtension(filename);
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
    return videoExtensions.includes(extension);
  }
}

// Create and export singleton instance
const storageService = new StorageService();
export default storageService;
