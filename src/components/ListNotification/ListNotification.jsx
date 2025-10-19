// import { X } from "lucide-react";
// import { useNotification } from "../../hooks/useNotification";
// import { useEffect, useState } from "react";

// const iconMap = {
//   success: "✅",
//   info: "ℹ️",
//   warning: "⚠️",
//   error: "❌",
// };

// const bgColorMap = {
//   read: {
//     success: "bg-green-500 border-green-300",
//     info: "bg-blue-50 border-blue-300",
//     warning: "bg-orange-50 border-orange-300",
//     error: "bg-red-50 border-red-300",
//   },
//   unread: {
//     success: "bg-green-50 border-green-300",
//     info: "bg-blue-50 border-blue-300",
//     warning: "bg-orange-50 border-orange-300",
//     error: "bg-red-50 border-red-300",
//   },
// };

// const iconBgMap = {
//   success: "bg-green-400",
//   info: "bg-blue-400",
//   warning: "bg-orange-400",
//   error: "bg-red-400",
// };

// function mapNotificationType(type) {
//   switch (type) {
//     case "MESSAGE":
//       return "success";
//     case "ERROR":
//       return "error";
//     default:
//       return "success";
//   }
// }

// export default function ListNotification({ userId }) {
//   const { getListNotification, readNotification } = useNotification();
//   const [listNotification, setListNotification] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       const response = await getListNotification(userId);
//       setListNotification(response || []);
//     }
//     fetchData();
//   }, [userId]);

//   const handleMarkAsRead = async (id) => {
//     await readNotification(id);
//     setListNotification((prev) =>
//       prev.map((noti) => (noti.id === id ? { ...noti, read: true } : noti))
//     );
//   };

//   const handleDeleteNotification = (id) => {
//     setListNotification((prev) => prev.filter((noti) => noti.id !== id));
//   };

//   return (
//     <div className="flex flex-col gap-4 p-4">
//       {listNotification.map((item) => {
//         const type = mapNotificationType(item.type);
//         const bgClass = bgColorMap[item.read ? "read" : "unread"][type];

//         return (
//           <div
//             key={item.id}
//             className={`flex items-start justify-between p-4 border rounded-lg shadow-sm ${bgClass}`}
//           >
//             <div className="flex items-start gap-3">
//               <div
//                 className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-lg ${iconBgMap[type]}`}
//               >
//                 {iconMap[type]}
//               </div>
//               <div>
//                 <div
//                   className={`font-semibold ${
//                     item.read ? "text-gray-800" : "text-gray-500"
//                   }`}
//                 >
//                   {type.toUpperCase()}
//                 </div>
//                 <div className="text-sm text-gray-600">{item.content}</div>
//                 <div className="text-xs text-gray-400">
//                   {new Date(item.createdAt).toLocaleString()}
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               {!item.read && (
//                 <button
//                   className="border rounded-md px-3 py-1 text-sm font-medium hover:bg-gray-100"
//                   onClick={() => handleMarkAsRead(item.id)}
//                 >
//                   Mark as read
//                 </button>
//               )}
//               <button
//                 className="text-gray-500 hover:text-gray-800"
//                 onClick={() => handleDeleteNotification(item.id)}
//               >
//                 <X size={18} />
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
import { X, Bell } from "lucide-react";
import { useNotification } from "../../hooks/useNotification";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../../routes/endPoints";
const iconMap = {
  success: <Bell />,
  info: "ℹ️",
  warning: "⚠️",
  error: "❌",
};

const bgColorMap = {
  read: {
    success: "bg-gradient-to-r from-[#7BE495] to-[#56C596]  border-green-300",

    info: "bg-blue-500 border-blue-300",
    warning: "bg-orange-500 border-orange-300",
    error: "bg-red-500 border-red-300",
  },
  unread: {
    success: "bg-green-50 border-green-300",
    info: "bg-blue-50 border-blue-300",
    warning: "bg-orange-50 border-orange-300",
    error: "bg-red-50 border-red-300",
  },
};

const iconBgMap = {
  success: "bg-green-400",
  info: "bg-blue-400",
  warning: "bg-orange-400",
  error: "bg-red-400",
};

const textColorMap = {
  read: {
    success: "text-black-600",
    info: "text-black-600",
    warning: "text-black-600",
    error: "text-black-600",
    content: "text-black-500",
  },
  unread: {
    success: "text-green-800",
    info: "text-blue-800",
    warning: "text-orange-800",
    error: "text-red-800",
    content: "text-gray-700",
  },
};

function mapNotificationType(type) {
  switch (type) {
    case "MESSAGE":
      return "success";
    case "ERROR":
      return "error";
    case "INFO":
      return "info";
    case "WARNING":
      return "warning";
    default:
      return "success";
  }
}

export default function ListNotification({ userId }) {
  const { getListNotification, readNotification } = useNotification();
  const [listNotification, setListNotification] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await getListNotification(userId);
      setListNotification(response || []);
    }
    fetchData();
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    await readNotification(id);
    setListNotification((prev) =>
      prev.map((noti) => (noti.id === id ? { ...noti, read: true } : noti))
    );
  };

  // const handleDeleteNotification = (id) => {
  //   setListNotification((prev) => prev.filter((noti) => noti.id !== id));
  // };
  const extractTestOrderId = (text) => {
    const match = text.match(/(?:ID\s*|order\s*)(\d+)/i);
    return match ? match[1] : null;
  };
  return (
    <div className="flex flex-col gap-4 p-4">
      {listNotification.map((item) => {
        const type = mapNotificationType(item.type);
        const status = item.read ? "read" : "unread";
        const bgClass = bgColorMap[status][type];
        const titleTextColor = textColorMap[status][type];
        const contentTextColor = textColorMap[status].content;
        const testOrderId = extractTestOrderId(item.content);

        return (
          <div
            key={item.id}
            className={`flex items-start justify-between p-4 border rounded-lg shadow-sm ${bgClass} transition-all duration-200`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full text-white text-lg ${iconBgMap[type]}`}
              >
                {iconMap[type]}
              </div>
              <div>
                <div className={`font-semibold text-sm ${titleTextColor}`}>
                  {type.toUpperCase()}
                </div>
                <div className={`text-sm ${contentTextColor}`}>
                  {item.content}
                </div>
                <div className={`text-sm ${contentTextColor}`}>
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!item.read && (
                <a
                  className="border rounded-md px-3 py-1 text-xs font-medium hover:bg-gray-100"
                  href={ENDPOINTS.USER.TESTORDER_DETAIL(testOrderId)}
                  onClick={() => handleMarkAsRead(item.id)}
                >
                  View
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
