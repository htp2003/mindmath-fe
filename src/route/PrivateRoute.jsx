// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const getRole = () => {
  // Lấy role từ localStorage, context hoặc API, ở đây tôi sẽ giả lập là từ localStorage
  return localStorage.getItem("role"); // "admin" hoặc "teacher"
};

const PrivateRoute = ({ children, adminOnly }) => {
  const role = getRole();

  if (adminOnly && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
