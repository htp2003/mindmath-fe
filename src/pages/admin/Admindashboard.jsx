import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/admin/users"
          className="bg-blue-500 text-white p-4 rounded-lg text-center"
        >
          User Management
        </Link>
        <Link
          to="/admin/categories"
          className="bg-green-500 text-white p-4 rounded-lg text-center"
        >
          Category Management
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
