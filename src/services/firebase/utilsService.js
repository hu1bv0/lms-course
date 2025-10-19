/**
 * Firebase Utils Service
 * 
 * Provides utility functions for Firebase operations including:
 * - Data validation and sanitization
 * - Date and time utilities
 * - Error handling and logging
 * - Performance monitoring
 * - Cache management
 * - Security helpers
 */

import { Timestamp } from 'firebase/firestore';

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
};

// Error types
export const ERROR_TYPES = {
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NETWORK: 'NETWORK_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR'
};

class UtilsService {
  constructor() {
    this.cache = new Map();
    this.performanceMetrics = new Map();
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid
   */
  validateEmail(email) {
    return VALIDATION_PATTERNS.EMAIL.test(email);
  }

  /**
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - True if valid
   */
  validatePhone(phone) {
    return VALIDATION_PATTERNS.PHONE.test(phone);
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} - Validation result
   */
  validatePassword(password) {
    const result = {
      isValid: false,
      errors: [],
      score: 0
    };

    if (password.length < 8) {
      result.errors.push('Mật khẩu phải có ít nhất 8 ký tự');
    } else {
      result.score += 1;
    }

    if (!/[a-z]/.test(password)) {
      result.errors.push('Mật khẩu phải có ít nhất một chữ thường');
    } else {
      result.score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      result.errors.push('Mật khẩu phải có ít nhất một chữ hoa');
    } else {
      result.score += 1;
    }

    if (!/\d/.test(password)) {
      result.errors.push('Mật khẩu phải có ít nhất một số');
    } else {
      result.score += 1;
    }

    if (!/[@$!%*?&]/.test(password)) {
      result.errors.push('Mật khẩu phải có ít nhất một ký tự đặc biệt');
    } else {
      result.score += 1;
    }

    result.isValid = result.errors.length === 0;
    return result;
  }

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} - True if valid
   */
  validateURL(url) {
    return VALIDATION_PATTERNS.URL.test(url);
  }

  /**
   * Validate username format
   * @param {string} username - Username to validate
   * @returns {boolean} - True if valid
   */
  validateUsername(username) {
    return VALIDATION_PATTERNS.USERNAME.test(username);
  }

  /**
   * Sanitize string input
   * @param {string} input - Input string
   * @returns {string} - Sanitized string
   */
  sanitizeString(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .substring(0, 1000); // Limit length
  }

  /**
   * Sanitize object data
   * @param {Object} data - Object to sanitize
   * @returns {Object} - Sanitized object
   */
  sanitizeObject(data) {
    if (!data || typeof data !== 'object') return {};

    const sanitized = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  /**
   * Convert Firebase Timestamp to Date
   * @param {Object} timestamp - Firebase Timestamp
   * @returns {Date} - JavaScript Date object
   */
  timestampToDate(timestamp) {
    if (!timestamp) return null;
    
    if (timestamp.seconds !== undefined) {
      return new Date(timestamp.seconds * 1000);
    }
    
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    
    return new Date(timestamp);
  }

  /**
   * Convert Date to Firebase Timestamp
   * @param {Date|string|number} date - Date to convert
   * @returns {Object} - Firebase Timestamp object
   */
  dateToTimestamp(date) {
    if (!date) return null;
    
    const jsDate = new Date(date);
    return Timestamp.fromDate(jsDate);
  }

  /**
   * Format date to Vietnamese format
   * @param {Date|string|number} date - Date to format
   * @param {Object} options - Format options
   * @returns {string} - Formatted date string
   */
  formatDate(date, options = {}) {
    const {
      includeTime = false,
      locale = 'vi-VN',
      timeZone = 'Asia/Ho_Chi_Minh'
    } = options;

    const jsDate = new Date(date);
    
    if (isNaN(jsDate.getTime())) {
      return 'Ngày không hợp lệ';
    }

    const formatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone
    };

    if (includeTime) {
      formatOptions.hour = '2-digit';
      formatOptions.minute = '2-digit';
      formatOptions.second = '2-digit';
    }

    return jsDate.toLocaleDateString(locale, formatOptions);
  }

  /**
   * Get relative time (e.g., "2 giờ trước")
   * @param {Date|string|number} date - Date to compare
   * @returns {string} - Relative time string
   */
  getRelativeTime(date) {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);

    if (diffInSeconds < 60) {
      return 'Vừa xong';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ngày trước`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} tháng trước`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} năm trước`;
  }

  /**
   * Generate unique ID
   * @param {number} length - ID length
   * @returns {string} - Unique ID
   */
  generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Generate slug from string
   * @param {string} text - Text to convert to slug
   * @returns {string} - Slug string
   */
  generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Deep clone object
   * @param {Object} obj - Object to clone
   * @returns {Object} - Cloned object
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      Object.keys(obj).forEach(key => {
        clonedObj[key] = this.deepClone(obj[key]);
      });
      return clonedObj;
    }
  }

  /**
   * Merge objects deeply
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} - Merged object
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    Object.keys(source).forEach(key => {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    });
    
    return result;
  }

  /**
   * Debounce function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} - Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} - Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Cache data with expiration
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  setCache(key, value, ttl = 300000) { // Default 5 minutes
    const expiration = Date.now() + ttl;
    this.cache.set(key, { value, expiration });
  }

  /**
   * Get cached data
   * @param {string} key - Cache key
   * @returns {*} - Cached value or null
   */
  getCache(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiration) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Clear cache
   * @param {string} key - Optional specific key to clear
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Start performance measurement
   * @param {string} name - Measurement name
   */
  startPerformanceMeasurement(name) {
    this.performanceMetrics.set(name, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }

  /**
   * End performance measurement
   * @param {string} name - Measurement name
   * @returns {number} - Duration in milliseconds
   */
  endPerformanceMeasurement(name) {
    const measurement = this.performanceMetrics.get(name);
    
    if (!measurement) {
      console.warn(`Performance measurement '${name}' not found`);
      return 0;
    }
    
    measurement.endTime = performance.now();
    measurement.duration = measurement.endTime - measurement.startTime;
    
    return measurement.duration;
  }

  /**
   * Get performance measurement
   * @param {string} name - Measurement name
   * @returns {Object|null} - Measurement data
   */
  getPerformanceMeasurement(name) {
    return this.performanceMetrics.get(name) || null;
  }

  /**
   * Log error with context
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  logError(error, context = {}) {
    const errorLog = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Firebase Error:', errorLog);
    
    // In production, you might want to send this to an error tracking service
    // like Sentry, LogRocket, or your own logging service
  }

  /**
   * Retry function with exponential backoff
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} baseDelay - Base delay in milliseconds
   * @returns {Promise} - Promise that resolves with function result
   */
  async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (i === maxRetries) {
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  /**
   * Check if running in development mode
   * @returns {boolean} - True if in development
   */
  isDevelopment() {
    return import.meta.env.DEV || process.env.NODE_ENV === 'development';
  }

  /**
   * Check if running in production mode
   * @returns {boolean} - True if in production
   */
  isProduction() {
    return import.meta.env.PROD || process.env.NODE_ENV === 'production';
  }

  /**
   * Get environment variable
   * @param {string} key - Environment variable key
   * @param {*} defaultValue - Default value
   * @returns {*} - Environment variable value
   */
  getEnvVar(key, defaultValue = null) {
    return import.meta.env[key] || process.env[key] || defaultValue;
  }

  /**
   * Format file size
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Generate random color
   * @returns {string} - Random hex color
   */
  generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  /**
   * Check if value is empty
   * @param {*} value - Value to check
   * @returns {boolean} - True if empty
   */
  isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  /**
   * Capitalize first letter
   * @param {string} str - String to capitalize
   * @returns {string} - Capitalized string
   */
  capitalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Convert string to title case
   * @param {string} str - String to convert
   * @returns {string} - Title case string
   */
  toTitleCase(str) {
    if (!str || typeof str !== 'string') return '';
    
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
}

// Create and export singleton instance
const utilsService = new UtilsService();
export default utilsService;
