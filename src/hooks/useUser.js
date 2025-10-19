import request from '../utils/request';
import endpoints from '../constants/apiEndpoints';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { ENDPOINTS } from '../routes/endpoints';
import axios from 'axios';


export const useUser = () => {
const getdetailuser = async (userId) => {
    const response = await request.get(endpoints.USER.Detailuser(userId));
    return response;
};
const deleteUser = async (userId) => {
    const response = await request.delete(endpoints.USER.DeleteUser(userId));
    return response;
}
const createUser = async (data) => {
    const response = await request.post(endpoints.USER.CreateUser, data);
    return response;
}
const updateUser = async (userId, data) => {
    const response = await request.put(endpoints.USER.UpdateUser(userId), data);
    return response;
}
const getUserbyId = async (userId) => {
    const response = await request.get(endpoints.USER.Detailuser(userId));
    return response;
}
const requestSignature = async () => {
    const response = await request.get(endpoints.USER.RequestSignature);
    return response;
}
const UploadAvatar = async (file) => {
  // Bước 1: Lấy chữ ký upload từ backend
  const {
    apiKey,
    cloudName,
    signature,
    timestamp,
    folder,
  } = await requestSignature(); // không cần truyền cloudName

  // Bước 2: Tạo formData để gửi ảnh lên Cloudinary
  const formData = new FormData();
  formData.append("file", file); // File ảnh người dùng chọn
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  // Bước 3: Gửi ảnh trực tiếp tới Cloudinary
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await axios.post(cloudinaryUrl, formData);

  return response; // Trả về link ảnh
};
const SendUrltoBackend = async (url) => {
  const response = await request.patch(endpoints.USER.SendUrltoBackend, { imageUrl: url });
  return response;
}
const activeUser = async (userId, active) => {
  const response = await request.patch(endpoints.USER.ChangeStatus(userId), { active: active });
  return response;
}
const requestPresignUrl = async (file) => {
  const response = await request.get(endpoints.USER.RequestPresignUrlS3,{
  params: {
    filename: file.name
  }
});
  return response;
}

const uploadFileToS3 = async (file, presignedUrl) => {
  const response = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type, // ví dụ: image/jpeg, application/pdf
      },
    });
  return response;
};
const getMyinfo = async () => {
  const response = await request.get(endpoints.USER.MyInfoUser);
  return response;
};

return { getdetailuser, deleteUser,createUser,updateUser,getUserbyId,requestSignature,UploadAvatar,SendUrltoBackend,activeUser,requestPresignUrl,uploadFileToS3, getMyinfo };
}