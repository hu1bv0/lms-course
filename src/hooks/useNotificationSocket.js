// // import { useEffect, useRef } from "react";
// // import SockJS from "sockjs-client/dist/sockjs.min.js";
// // import { Client } from "@stomp/stompjs";

// // export function useNotificationSocket(onMessage) {
// //   const clientRef = useRef(null);
// //   const user = JSON.parse(localStorage.getItem("user")) || {};
// //   const userId = user.id;
// //   const token = localStorage.getItem("access_token");

// //   useEffect(() => {
// //     if (!userId || !token) {
// //       console.error("Missing userId or token, cannot connect to WebSocket");
// //       return;
// //     }

// //     console.log("Attempting to connect to WebSocket for userId:", userId);
// //     const socket = new SockJS("http://localhost:8089/ws");
// //     const stompClient = new Client({
// //       webSocketFactory: () => socket,
// //       connectHeaders: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //       debug: (msg) => console.log("WebSocket Debug:", msg),
// //       onConnect: (frame) => {
// //         console.log("STOMP frame:", frame);
// //         console.log("Connected to WebSocket for userId:", userId);
// //         setInterval(() => {
// //           console.log(
// //             "WebSocket state:",
// //             stompClient.connected ? "Connected" : "Disconnected"
// //           );
// //         }, 5000); // Log mỗi 5 giây
// //         // Đăng ký kênh global
// //         const globalSub = stompClient.subscribe(
// //           "/topic/notifications/global",
// //           (message) => {
// //             console.log("Received global notification:", message);
// //             try {
// //               const payload = JSON.parse(message.body);
// //               console.log("Parsed global notification payload:", payload);
// //               onMessage(payload);
// //             } catch (error) {
// //               console.error("Error parsing global notification:", error);
// //             }
// //           }
// //         );
// //         console.log(
// //           "Subscribed to global notifications: /topic/notifications/global",
// //           globalSub
// //         );

// //         // Đăng ký kênh user-specific
// //         // const userSub = stompClient.subscribe(
// //         //   `/user/${userId}/queue/notifications`,
// //         //   (message) => {
// //         //     console.log(
// //         //       "Received user notification for userId:",
// //         //       userId,
// //         //       message
// //         //     );
// //         //     try {
// //         //       const payload = JSON.parse(message.body);
// //         //       console.log("Parsed user notification payload:", payload);
// //         //       onMessage(payload);
// //         //     } catch (error) {
// //         //       console.error("Error parsing user notification:", error);
// //         //     }
// //         //   }
// //         // );
// //         const userSub = stompClient.subscribe(
// //           `/user/${userId}/queue/notifications`, // Thay đổi điểm đến nây cho mạng cơ bản
// //           (message) => {
// //             console.log(
// //               "Received user notification for userId:",
// //               userId,
// //               message
// //             );
// //             try {
// //               const payload = JSON.parse(message.body);
// //               console.log("Parsed user notification payload:", payload);
// //               onMessage(payload);
// //             } catch (error) {
// //               console.error("Error parsing user notification:", error);
// //             }
// //           }
// //         );
// //         console.log(
// //           "Subscribed to user notifications: /user/" +
// //             userId +
// //             "/queue/notifications",
// //           userSub
// //         );
// //       },
// //       onStompError: (frame) => {
// //         console.error("STOMP error:", frame.headers["message"]);
// //         console.error("Details:", frame);
// //       },
// //       onDisconnect: () => {
// //         console.log("Disconnected from WebSocket");
// //       },
// //       reconnectDelay: 5000,
// //     });

// //     stompClient.activate();
// //     clientRef.current = stompClient;

// //     return () => {
// //       stompClient.deactivate();
// //       console.log("Cleaned up WebSocket connection");
// //     };
// //   }, [userId, onMessage]);

// //   return clientRef.current;
// // }
// import { useEffect, useRef } from "react";
// import SockJS from "sockjs-client/dist/sockjs.min.js";
// import { Client } from "@stomp/stompjs";

// export function useNotificationSocket(onMessage) {
//   const clientRef = useRef(null);

//   const connect = () => {
//     const user = JSON.parse(localStorage.getItem("user")) || {};
//     const userId = user.id;
//     const token = localStorage.getItem("access_token");

//     const socket = new SockJS("http://localhost:8089/ws");
//     const stompClient = new Client({
//       webSocketFactory: () => socket,
//       connectHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//       debug: (msg) => console.log("WebSocket Debug:", msg),
//       onConnect: () => {
//         console.log("Connected to WebSocket for userId:", userId);

//         stompClient.subscribe("/topic/notifications/global", (message) => {
//           try {
//             const payload = JSON.parse(message.body);
//             onMessage(payload);
//           } catch (error) {
//             console.error("Error parsing global notification:", error);
//           }
//         });

//         stompClient.subscribe(
//           `/user/${userId}/queue/notifications`,
//           (message) => {
//             try {
//               const payload = JSON.parse(message.body);
//               onMessage(payload);
//             } catch (error) {
//               console.error("Error parsing user notification:", error);
//             }
//           }
//         );
//       },
//       onStompError: (frame) => {
//         console.error("STOMP error:", frame.headers["message"]);
//         console.error("Details:", frame);
//       },
//       onDisconnect: () => {
//         console.log("Disconnected from WebSocket");
//       },
//       reconnectDelay: 5000,
//     });

//     stompClient.activate();
//     clientRef.current = stompClient;
//   };

//   const disconnect = () => {
//     if (clientRef.current && clientRef.current.active) {
//       clientRef.current.deactivate();
//       console.log("WebSocket manually disconnected");
//     }
//   };

//   // Optionally connect on first mount
//   useEffect(() => {
//     connect();
//     return () => disconnect(); // Cleanup on unmount
//   }, []);

//   return { connect, disconnect, client: clientRef.current };
// }
