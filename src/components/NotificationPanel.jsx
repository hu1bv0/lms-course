// // import { useState, useEffect } from "react";
// // import { useNotificationSocket } from "../hooks/useNotificationSocket";
// // import { X } from "lucide-react";

// // export default function NotificationPanel() {
// //   const [notifications, setNotifications] = useState([]);

// //   // Nhận thông báo từ socket và thêm vào danh sách
// //   useNotificationSocket((message) => {
// //     const id = Date.now();
// //     const newNotification = { ...message, id };

// //     // Thêm thông báo
// //     setNotifications((prev) => [newNotification, ...prev]);

// //     // Tự động xóa sau 5 giây
// //     setTimeout(() => {
// //       setNotifications((prev) => prev.filter((n) => n.id !== id));
// //     }, 5000);
// //   });

// //   // Xử lý xóa thủ công
// //   const removeNotification = (id) => {
// //     setNotifications((prev) => prev.filter((n) => n.id !== id));
// //   };

// //   // Hàm để trích xuất ID test order từ content
// //   const extractTestOrderId = (content) => {
// //     const match = content.match(/Test order (\d+)/i);
// //     return match ? match[1] : null;
// //   };

// //   if (notifications.length === 0) return null;

// //   return (
// //     <div className="fixed top-[100px] right-4 w-80 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
// //       <div className="p-4 border-b font-semibold text-lg">Thông báo</div>
// //       <div className="max-h-96 overflow-y-auto">
// //         {notifications.map((n) => {
// //           const testOrderId = extractTestOrderId(n.content);
// //           const detailLink = testOrderId
// //             ? `http://localhost:3000/user/test-order-detail/${testOrderId}`
// //             : null;

// //           return (
// //             <div
// //               key={n.id}
// //               className="relative px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition duration-300"
// //             >
// //               {/* Nút x */}
// //               <button
// //                 onClick={() => removeNotification(n.id)}
// //                 className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
// //               >
// //                 <X className="w-4 h-4" />
// //               </button>

// //               {/* Nội dung */}
// //               <div className="font-medium text-gray-800">{n.type}</div>
// //               <div className="text-sm text-gray-600">
// //                 {n.content}
// //                 {detailLink && (
// //                   <>
// //                     {" "}
// //                     –{" "}
// //                     <a
// //                       href={detailLink}
// //                       target="_blank"
// //                       rel="noopener noreferrer"
// //                       className="text-blue-600 hover:underline"
// //                     >
// //                       View details
// //                     </a>
// //                   </>
// //                 )}
// //               </div>
// //               <div className="text-xs text-gray-400">
// //                 {new Date(n.timestamp).toLocaleString()}
// //               </div>

// //               {/* Thanh thời gian đếm ngược */}
// //               <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
// //                 <div className="h-full bg-red-500 animate-countdown" />
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* CSS animation (Tailwind custom) */}
// //       <style>
// //         {`
// //           @keyframes countdown {
// //             from { width: 100%; }
// //             to { width: 0%; }
// //           }
// //           .animate-countdown {
// //             animation: countdown 5s linear forwards;
// //           }
// //         `}
// //       </style>
// //     </div>
// //   );
// // }
// import { useState } from "react";
// import { useNotificationSocket } from "../hooks/useNotificationSocket";
// import { X, Bell } from "lucide-react";

// export default function NotificationPanel() {
//   const [notifications, setNotifications] = useState([]);

//   useNotificationSocket((message) => {
//     const id = Date.now();
//     const newNotification = { ...message, id };

//     setNotifications((prev) => [newNotification, ...prev]);

//     setTimeout(() => {
//       setNotifications((prev) => prev.filter((n) => n.id !== id));
//     }, 10000);
//   });

//   const removeNotification = (id) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//   };

//   const extractTestOrderId = (content) => {
//     const match = content.match(/Test order (\d+)/i);
//     return match ? match[1] : null;
//   };

//   if (notifications.length === 0) return null;

//   return (
//     <div className="fixed top-[100px] right-4 w-[360px] bg-gradient-to-r from-green-500 to-green-300 shadow-xl rounded-xl border border-gray-200 z-50 opacity-90">
//       <div className="p-4 border-b font-semibold text-lg text-white hover:text-black">
//         Thông báo
//       </div>
//       <div className="max-h-[500px] overflow-y-auto">
//         {notifications.map((n) => {
//           const testOrderId = extractTestOrderId(n.content);
//           const detailLink = testOrderId
//             ? `http://localhost:3000/user/test-order-detail/${testOrderId}`
//             : null;

//           return (
//             <div
//               key={n.id}
//               className="flex p-4 border-b border-gray-100 hover:bg-gray-50 transition duration-300 group"
//             >
//               {/* Icon Bell */}
//               <div className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-full mr-3 mt-1">
//                 <Bell className="w-5 h-5" />
//               </div>

//               {/* Content */}
//               <div className="flex-1">
//                 <div className="font-semibold text-white group-hover:text-black mb-1">
//                   {n.type}
//                 </div>
//                 <div className="text-sm text-white group-hover:text-black leading-snug">
//                   {n.content}
//                 </div>
//                 <div className="text-xs text-white group-hover:text-black mt-1">
//                   {new Date(n.timestamp).toLocaleString()}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex flex-col items-end justify-between ml-4">
//                 {detailLink && (
//                   <a
//                     href={detailLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-sm text-red-500 hover:text-red-700 hover:underline"
//                   >
//                     View detail
//                   </a>
//                 )}
//                 <button
//                   onClick={() => removeNotification(n.id)}
//                   className="text-gray-400 hover:text-red-500 mt-2"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Optional animation */}
//       <style>
//         {`
//           @keyframes countdown {
//             from { width: 100%; }
//             to { width: 0%; }
//           }
//           .animate-countdown {
//             animation: countdown 5s linear forwards;
//           }
//         `}
//       </style>
//     </div>
//   );
// }
