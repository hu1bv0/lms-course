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
  
  // Debug log to track re-renders
  console.log('useAuth render:', { 
    isAuthenticated: authState.isAuthenticated, 
    isLoading: authState.isLoading,
    userUid: authState.user?.uid 
  });
  
  // Memoize authState to prevent unnecessary re-renders
  const memoizedAuthState = useMemo(() => authState, [
    authState.user?.uid,
    authState.userData?.email,
    authState.isAuthenticated,
    authState.isLoading,
    authState.error,
    authState.role,
    authState.subscriptionType
  ]);

  useEffect(() => {
    let isMounted = true;
    let lastUserUid = null;
    let isLoading = false;
    
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      if (!isMounted) return;
      
      // Prevent unnecessary dispatches
      if (user && user.uid === lastUserUid) return;
      if (isLoading) return; // Prevent multiple simultaneous calls
      
      lastUserUid = user?.uid;
      isLoading = true;
      
      console.log('onAuthStateChange called with user:', user?.uid);
      dispatch(setLoading(true));
      
      try {
        if (user) {
          // User is signed in
          const userData = await authService.getUserById(user.uid);
          console.log('getUserById result:', userData?.role);
          if (userData && isMounted) {
            dispatch(setUser({
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified
              },
              userData: serializeFirebaseData(userData)
            }));
          } else if (isMounted) {
            dispatch(clearUser());
          }
        } else if (isMounted) {
          // User is signed out
          dispatch(clearUser());
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        if (isMounted) {
          dispatch(setError(error.message));
        }
      } finally {
        if (isMounted) {
          dispatch(setLoading(false));
          isLoading = false;
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [dispatch]);

  const login = useCallback(async (email, password) => {
    try {
      dispatch(setLoading(true));
      const result = await authService.login(email, password);
      if (result.success) {
        dispatch(setUser({
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
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const register = useCallback(async (email, password, userData) => {
    try {
      dispatch(setLoading(true));
      const result = await authService.register(email, password, userData);
      if (result.success) {
        // User will be automatically set via onAuthStateChanged
      }
      return result;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const loginWithGoogle = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const result = await authService.loginWithGoogle();
      return result;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const loginWithFacebook = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const result = await authService.loginWithFacebook();
      return result;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await authService.logout();
      dispatch(clearUser());
      // Redirect to login page after logout
      window.location.href = '/login';
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const forgotPassword = useCallback(async (email) => {
    try {
      dispatch(setLoading(true));
      const result = await authService.forgotPassword(email);
      return result;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const changePassword = useCallback(async (newPassword) => {
    try {
      dispatch(setLoading(true));
      const result = await authService.changePassword(newPassword);
      return result;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    ...memoizedAuthState,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    forgotPassword,
    changePassword
  };
};