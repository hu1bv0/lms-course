// LandingLayout.js
// import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; 
// import Header from "../components/Header/Header";
// import Footer from "../components/Footer/Footer";

const LandingLayout = ({ children }) => {

  return (
    <>
      {/* <Header isLoginRequired={isLoginRequired} onLoginClick={handleLoginClick} /> */}
      {children}
      {/* <Footer /> */}
    </>
  );
};
LandingLayout.propTypes = {
  children: PropTypes.node.isRequired, // hoặc .optional nếu bạn muốn không bắt buộc
};
export default LandingLayout;
