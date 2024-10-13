import React from "react";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";
const AdminLayout = () => {
  return (
    <div className="min-h-screen">
        <NavbarAdmin/>
      <div className="bg-gray-800 text-white p-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
