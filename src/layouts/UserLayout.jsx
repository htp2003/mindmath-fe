import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 ">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;