import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import loadingReducer from './slices/loadingSlice';

// Persist config for auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'userData', 'isAuthenticated', 'role', 'subscriptionType', 'permissions']
};

// Persist config for loading (don't persist loading state)
const loadingPersistConfig = {
  key: 'loading',
  storage,
  whitelist: [] // Don't persist loading state
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    loading: persistReducer(loadingPersistConfig, loadingReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);