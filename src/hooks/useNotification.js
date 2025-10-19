// import request from "../utils/request";
// import endpoints from "../constants/apiEndpoints";
// import axios from "axios";
// export const useNotification = () => {
//   const getListNotification = async (userId) => {
//     const response = await request.get(
//       endpoints.NOTIFICATION.Getnotification(userId)
//     );
//     return response;
//   };
//   const readNotification = async (notificationId) => {
//     const response = await request.put(
//       endpoints.NOTIFICATION.Readnotification(notificationId)
//     );
//     return response;
//   };
//   const getUnreadnotification = async (userId) => {
//     const response = await request.get(
//       endpoints.NOTIFICATION.Unreadnotification(userId)
//     );
//     return response;
//   };

//   return {
//     getListNotification,
//     readNotification,
//     getUnreadnotification,
//   };
// };
