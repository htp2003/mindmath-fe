import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"; // Import trang Home
import Wallet from "./pages/Wallet"; // Các trang khác
// import Profile from "./pages/Profile";
// import Logout from "./pages/Logout";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wallet" element={<Wallet />} />
            {/* <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
