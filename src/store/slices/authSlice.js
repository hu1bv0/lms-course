import { createSlice } from "@reduxjs/toolkit";
import { USER_ROLES, SUBSCRIPTION_TYPES } from "../../services/firebase";

const initialState = {
  user: null,
  userData: null,
  isAuthenticated: false,
  isLoading: false, // Don't persist loading state
  error: null,
  role: null,
  subscriptionType: SUBSCRIPTION_TYPES.FREE,
  permissions: {
    canAccessAdmin: false,
    canAccessPremium: false,
    canManageUsers: false,
    canViewReports: false
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action) => {
      console.log('AuthSlice - setUser called with:', action.payload.userData?.role);
      state.user = action.payload.user;
      state.userData = action.payload.userData;
      state.isAuthenticated = true;
      state.role = action.payload.userData?.role || USER_ROLES.STUDENT;
      state.subscriptionType = action.payload.userData?.subscriptionType || SUBSCRIPTION_TYPES.FREE;
      
      // Set permissions based on role and subscription
      state.permissions = {
        canAccessAdmin: state.role === USER_ROLES.ADMIN,
        canAccessPremium: state.subscriptionType === SUBSCRIPTION_TYPES.PREMIUM,
        canManageUsers: state.role === USER_ROLES.ADMIN,
        canViewReports: state.role === USER_ROLES.ADMIN || state.role === USER_ROLES.PARENT
      };
      
      state.error = null;
    },
    clearUser: (state) => {
      console.log('AuthSlice - clearUser called');
      state.user = null;
      state.userData = null;
      state.isAuthenticated = false;
      state.role = null;
      state.subscriptionType = SUBSCRIPTION_TYPES.FREE;
      state.permissions = {
        canAccessAdmin: false,
        canAccessPremium: false,
        canManageUsers: false,
        canViewReports: false
      };
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
      state.role = action.payload.role || state.role;
      state.subscriptionType = action.payload.subscriptionType || state.subscriptionType;
      
      // Update permissions
      state.permissions = {
        canAccessAdmin: state.role === USER_ROLES.ADMIN,
        canAccessPremium: state.subscriptionType === SUBSCRIPTION_TYPES.PREMIUM,
        canManageUsers: state.role === USER_ROLES.ADMIN,
        canViewReports: state.role === USER_ROLES.ADMIN || state.role === USER_ROLES.PARENT
      };
    },
    updateSubscription: (state, action) => {
      state.subscriptionType = action.payload;
      state.permissions.canAccessPremium = action.payload === SUBSCRIPTION_TYPES.PREMIUM;
    }
  },
});

export const { 
  setLoading, 
  setUser, 
  clearUser, 
  setError, 
  updateUserData, 
  updateSubscription 
} = authSlice.actions;

export default authSlice.reducer;
