# Firebase Authentication Setup Guide

## 🔥 Firebase Configuration

### 1. Tạo Firebase Project
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Enable Authentication và Firestore Database

### 2. Cấu hình Authentication
1. Vào **Authentication** > **Sign-in method**
2. Enable các phương thức đăng nhập:
   - Email/Password
   - Google
   - Facebook (nếu cần)

### 3. Cấu hình Firestore Database
1. Vào **Firestore Database**
2. Tạo database ở chế độ test mode
3. Tạo collection `users` với các fields:
   - `uid` (string)
   - `email` (string)
   - `displayName` (string)
   - `role` (string): "admin", "phu_huynh", "hoc_sinh"
   - `subscriptionType` (string): "free", "premium"
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)
   - `isEmailVerified` (boolean)

### 4. Cấu hình Environment Variables
Tạo file `.env` trong root directory với nội dung:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_URL=http://localhost:8765/api/iam
```

### 5. Cài đặt Dependencies
```bash
npm install firebase
```

## 🚀 Features Implemented

### ✅ Authentication System
- **Đăng nhập/Đăng ký** với email/password
- **Social Login** với Google và Facebook
- **3 loại user roles**: Admin, Phụ huynh, Học sinh
- **Session persistence** - tự động đăng nhập lại
- **Email verification** khi đăng ký

### ✅ Password Management
- **Quên mật khẩu** với email reset
- **Đổi mật khẩu** với validation
- **Password requirements** và security

### ✅ Subscription System
- **Free Plan**: Cơ bản cho học sinh mới
- **Premium Plan**: Đầy đủ tính năng
- **Upgrade/Downgrade** subscription
- **Role-based permissions**

### ✅ Security Features
- **Route protection** với role-based access
- **JWT token management**
- **Firebase security rules**
- **Input validation** và error handling

## 📁 File Structure

```
src/
├── configs/
│   └── firebase.config.js          # Firebase configuration
├── services/
│   └── authService.js              # Authentication service
├── hooks/
│   └── useAuth.js                  # Custom auth hook
├── store/slices/
│   └── authSlice.js                # Redux auth state
├── modules/auth/features/
│   ├── login.jsx                   # Login component
│   ├── signin.jsx                  # Register component
│   ├── forgotPassword.jsx          # Forgot password
│   └── changePassword.jsx          # Change password
└── modules/subscription/features/
    └── index.jsx                   # Subscription management
```

## 🔧 Usage Examples

### Login Component
```jsx
import { useAuth } from '../hooks/useAuth';

const LoginComponent = () => {
  const { login, isLoading, error } = useAuth();
  
  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // User will be automatically redirected
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };
};
```

### Protected Route
```jsx
import { RequiredAuth } from '../routes';

const AdminPage = () => (
  <RequiredAuth path="/login" requiredRoles={["admin"]}>
    <AdminContent />
  </RequiredAuth>
);
```

### Check User Role
```jsx
import { useAuth } from '../hooks/useAuth';

const Component = () => {
  const { role, permissions } = useAuth();
  
  if (permissions.canAccessAdmin) {
    return <AdminFeatures />;
  }
  
  return <UserFeatures />;
};
```

## 🛡️ Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admins can read all user data
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🎯 Next Steps

1. **Setup Firebase project** theo hướng dẫn trên
2. **Configure environment variables**
3. **Test authentication flow**
4. **Customize UI** theo brand của bạn
5. **Add more features** như profile management, notifications

## 📞 Support

Nếu gặp vấn đề trong quá trình setup, vui lòng:
1. Kiểm tra Firebase console configuration
2. Verify environment variables
3. Check browser console for errors
4. Ensure all dependencies are installed
