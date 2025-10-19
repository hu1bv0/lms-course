// import React, { useState } from "react";
// import ico_printer from "../../assets/icons/ico_printer.png";

// const AuthCard = () => {
//   return (
//     <div className="bg-blue-600 p-8 rounded-lg shadow-md max-w-md w-full mx-auto mt-20">
//       <div className="flex flex-col items-center">
//         <img src={ico_printer} alt="WePress Logo" className="h-16 w-16" />
//         <h2 className="text-white text-xl font-bold mt-4">WePress</h2>
//       </div>

//       {!isResettingPassword ? (
//         <form className="mt-8 space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-white text-sm font-bold"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               placeholder="Enter your email"
//               className="mt-1 p-2 w-full border rounded-lg bg-white text-black"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-white text-sm font-bold"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               placeholder="Enter your password"
//               className="mt-1 p-2 w-full border rounded-lg bg-white text-black"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-400 text-white py-2 rounded-lg flex items-center justify-center space-x-2"
//           >
//             <span>Sign In</span>
//             <i className="fas fa-sign-in-alt"></i>
//           </button>
//           <div className="text-center mt-4">
//             <button
//               type="button"
//               onClick={() => setIsResettingPassword(true)}
//               className="text-sm text-white hover:underline"
//             >
//               Forgot Password?
//             </button>
//           </div>
//         </form>
//       ) : (
//         <div className="mt-8 space-y-6">
//           <h3 className="text-white text-lg font-bold text-center">
//             Password Reset
//           </h3>
//           <p className="text-white text-sm text-center">
//             Enter your e-mail address below, and we'll send you an e-mail
//             allowing you to reset it.
//           </p>
//           <div>
//             <label
//               htmlFor="resetEmail"
//               className="block text-white text-sm font-bold"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               id="resetEmail"
//               placeholder="Enter your email"
//               className="mt-1 p-2 w-full border rounded-lg bg-white text-black"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-400 text-white py-2 rounded-lg"
//           >
//             Reset My Password
//           </button>
//           <div className="text-center mt-4">
//             <button
//               type="button"
//               onClick={() => setIsResettingPassword(false)}
//               className="text-sm text-white hover:underline"
//             >
//               Log In
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AuthCard;
