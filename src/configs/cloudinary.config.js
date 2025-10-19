// Cloudinary configuration for browser environment
const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  uploadUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
};

// Upload function using fetch API (browser-compatible)
export const uploadImageToCloudinary = async (file) => {
  try {
    // Check if required environment variables are available
    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
      throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);

    const response = await fetch(cloudinaryConfig.uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Không thể upload ảnh');
  }
};

export default cloudinaryConfig;
