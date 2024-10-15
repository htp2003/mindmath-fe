import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
// import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/Admindashboard";
import UserManagement from "./pages/admin/UserManager";
import CategoryManagement from "./pages/admin/SubjectManagement";
// import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/LoginPage/LoginPage";
import Register from "./pages/RegisterPage/RegisterPage";
import ChapterManagement from "./pages/admin/ChapterManagement";
import TopicManagement from "./pages/admin/TopicManagement";
import ProblemTypeManagement from "./pages/admin/ProblemTypeManagement";
function App() {
  return (
    <Router>
      <Routes>
        {/* Layout cho người dùng */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Layout cho Admin */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="chapters" element={<ChapterManagement />} />
          <Route path="topics" element={<TopicManagement />} />
          <Route path="problem-types" element={<ProblemTypeManagement />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
