// import React from "react";
// import Header from "../components/Header/Header";
// import Footer from "../components/Footer/Footer";
// import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import PropTypes from "prop-types";
import LoadingOverlay from "../components/LoadingOverlay/LoadingOverlay";
// import NotificationPanel from "../components/NotificationPanel";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Header luôn full chiều ngang */}
        <Header />

        {/* Bên dưới header chia làm 2 cột: sidebar + nội dung */}
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4">
            <LoadingOverlay />
            {/* <NotificationPanel /> */}
            {children}
          </main>
        </div>
      </div>
    </>
  );
};
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired, // hoặc .optional nếu bạn muốn không bắt buộc
};
export default DashboardLayout;
