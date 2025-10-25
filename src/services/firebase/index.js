/**
 * Firebase Service - Centralized Firebase operations
 * 
 * This service provides a centralized way to interact with Firebase services
 * including Authentication, Firestore, and Storage.
 * 
 * @author Course LMS Team
 * @version 1.0.0
 */

// Export all Firebase modules
export { default as authService } from './authService';
export { default as firestoreService } from './firestoreService';
export { default as storageService } from './storageService';
export { default as utilsService } from './utilsService';
export { default as courseService } from './courseService';
export { default as parentService } from './parentService';
export { default as notificationService } from './notificationService';
export { default as adminAnalyticsService } from './adminAnalyticsService';
export { default as aiService } from './aiService';
export { default as surveyService } from './surveyService';

// Export legacy service for backward compatibility
export { default as legacyAuthService } from './legacyAuthService';

// Export Firebase configuration
export { auth, db, storage } from '../../configs/firebase.config';

// Export constants
export { USER_ROLES, SUBSCRIPTION_TYPES } from './authService';
