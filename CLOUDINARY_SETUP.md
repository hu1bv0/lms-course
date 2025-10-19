# Cloudinary Setup Guide

## 1. Environment Variables

Thêm vào file `.env`:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 2. Cấu trúc thư mục Cloudinary

```
payment-proofs/
├── transaction_1_image.jpg
├── transaction_2_image.png
└── ...
```

## 3. Usage

```javascript
// Upload image
const uploadResult = await authService.uploadImageToCloudinary(file);
if (uploadResult.success) {
  console.log('Image URL:', uploadResult.url);
  console.log('Public ID:', uploadResult.publicId);
}
```

## 4. Error Handling

- File size limit: 10MB (Cloudinary default)
- Supported formats: jpg, jpeg, png, gif, webp
- Network errors sẽ được handle trong authService

## 5. Notes

- Upload preset phải được cấu hình trong Cloudinary dashboard
- Tạo unsigned upload preset để cho phép upload từ browser
- Không sử dụng folder cố định, để Cloudinary tự động quản lý