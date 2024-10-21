import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/Admindashboard";
import UserManagement from "./pages/admin/UserManager";
import CategoryManagement from "./pages/admin/SubjectManagement";
import Login from "./pages/LoginPage/LoginPage";
import Register from "./pages/RegisterPage/RegisterPage";
import ChapterManagement from "./pages/admin/ChapterManagement";
import TopicManagement from "./pages/admin/TopicManagement";
import ProblemTypeManagement from "./pages/admin/ProblemTypeManagement";
import ProtectedRoute from "./components/ProtectRoute/ProtectedRoute";
import AuthRoute from "./components/AuthRoute/AuthRoute"; // Import AuthRoute
import { Toaster } from "react-hot-toast";
import CreateVideo from "./pages/CreateVideo/CreateVideo";


function App() {
  return (
    <Router>
      <Routes>
        {/* Layout cho người dùng */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="user-dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="create" element={<CreateVideo />} />
        </Route>

        {/* Layout cho Admin, bảo vệ bằng ProtectedRoute */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="chapters" element={<ChapterManagement />} />
          <Route path="topics" element={<TopicManagement />} />
          <Route path="problem-types" element={<ProblemTypeManagement />} />
        </Route>

        {/* Login and Register routes protected by AuthRoute */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>

  );
}

export default App;
