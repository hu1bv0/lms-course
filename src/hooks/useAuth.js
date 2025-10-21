import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser, clearUser, setError } from '../store/slices/authSlice';
import { legacyAuthService as authService } from '../services/firebase';

// Helper function to serialize Firebase data
const serializeFirebaseData = (data) => {
  if (!data) return data;
  
  const serialized = { ...data };
  
  // Convert Firebase Timestamps to ISO strings
  Object.keys(serialized).forEach(key => {
    const value = serialized[key];
    if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
      // This is a Firebase Timestamp
      serialized[key] = new Date(value.seconds * 1000).toISOString();
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively serialize nested objects
      serialized[key] = serializeFirebaseData(value);
    }
  });
  
  return serialized;
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  
  // Debug log to track re-renders (commented out to reduce noise)
  // console.log('useAuth render:', { 
  //   isAuthenticated: authState.isAuthenticated, 
  //   isLoading: authState.isLoading,
  //   userUid: authState.user?.uid 
  // });
  
  // Extract primitive values to prevent unnecessary re-renders
  const user = authState.user;
  const userData = authState.userData;
  const isAuthenticated = authState.isAuthenticated;
  const isLoading = authState.isLoading;
  const error = authState.error;
  const role = authState.role;
  const subscriptionType = authState.subscriptionType;

  // Memoize dispatch to prevent useEffect re-runs
  const memoizedDispatch = useCallback(dispatch, []);

  useEffect(() => {
    let isMounted = true;
    let lastUserData = null;
    let isProcessing = false;
    
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      if (!isMounted || isProcessing) return;
      
      isProcessing = true;
      
      try {
        if (user) {
          // User is signed in
          const userData = await authService.getUserById(user.uid);
          
          if (!isMounted) return;
          
          // Check if user data actually changed
          const currentUserDataString = JSON.stringify({
            uid: user.uid,
            email: user.email,
            role: userData?.role,
            subscriptionType: userData?.subscriptionType
          });
          
          // Show loading only on first load
          const isFirstLoad = !lastUserData;
          if (isFirstLoad) {
            memoizedDispatch(setLoading(true));
          }
          
          if (lastUserData === currentUserDataString) {
            // Data hasn't changed, skip update
            isProcessing = false;
            return;
          }
          
          lastUserData = currentUserDataString;
          
          if (userData) {
            memoizedDispatch(setUser({
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified
              },
              userData: serializeFirebaseData(userData)
            }));
          } else {
            memoizedDispatch(clearUser());
          }
        } else {
          // User is signed out
          if (lastUserData !== null) {
            lastUserData = null;
            memoizedDispatch(clearUser());
          }
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        if (isMounted) {
          memoizedDispatch(setError(error.message));
        }
      } finally {
        if (isMounted) {
          memoizedDispatch(setLoading(false));
          isProcessing = false;
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [memoizedDispatch]); // Use memoized dispatch

  const login = useCallback(async (email, password) => {
    try {
      memoizedDispatch(setLoading(true));
      const result = await authService.login(email, password);
      if (result.success) {
        memoizedDispatch(setUser({
          user: {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            emailVerified: result.user.emailVerified
          },
          userData: serializeFirebaseData(result.userData)
        }));
      }
      return result;
    } catch (error) {
      memoizedDispatch(setError(error.message));
      throw error;
    } finally {
      memoizedDispatch(setLoading(false));
    }
  }, [memoizedDispatch]);

  const register = useCallback(async (email, password, userData) => {
    try {
      memoizedDispatch(setLoading(true));
      const result = await authService.register(email, password, userData);
      if (result.success) {
        // User will be automatically set via onAuthStateChanged
      }
      return result;
    } catch (error) {
      memoizedDispatch(setError(error.message));
      throw error;
    } finally {
      memoizedDispatch(setLoading(false));
    }
  }, [memoizedDispatch]);

  const loginWithGoogle = useCallback(async () => {
    try {
      memoizedDispatch(setLoading(true));
      const result = await authService.loginWithGoogle();
      return result;
    } catch (error) {
      memoizedDispatch(setError(error.message));
      throw error;
    } finally {
      memoizedDispatch(setLoading(false));
    }
  }, [memoizedDispatch]);

  const loginWithFacebook = useCallback(async () => {
    try {
      memoizedDispatch(setLoading(true));
      const result = await authService.loginWithFacebook();
      return result;
    } catch (error) {
      memoizedDispatch(setError(error.message));
      throw error;
    } finally {
      memoizedDispatch(setLoading(false));
    }
  }, [memoizedDispatch]);

  const logout = useCallback(async () => {
    try {
      memoizedDispatch(setLoading(true));
      await authService.logout();
      memoizedDispatch(clearUser());
      // Redirect to login page after logout
      window.location.href = '/login';
    } catch (error) {
      memoizedDispatch(setError(error.message));
      throw error;
    } finally {
      memoizedDispatch(setLoading(false));
    }
  }, [memoizedDispatch]);

  const forgotPassword = useCallback(async (email) => {
    try {
      memoizedDispatch(setLoading(true));
      const result = await authService.forgotPassword(email);
      return result;
    } catch (error) {
      memoizedDispatch(setError(error.message));
      throw error;
    } finally {
      memoizedDispatch(setLoading(false));
    }
  }, [memoizedDispatch]);

  const changePassword = useCallback(async (newPassword) => {
    try {
      memoizedDispatch(setLoading(true));
      const result = await authService.changePassword(newPassword);
      return result;
    } catch (error) {
      memoizedDispatch(setError(error.message));
      throw error;
    } finally {
      memoizedDispatch(setLoading(false));
    }
  }, [memoizedDispatch]);

  return {
    user,
    userData,
    isAuthenticated,
    isLoading,
    error,
    role,
    subscriptionType,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    forgotPassword,
    changePassword
  };
};